import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, TaskItemDto, TaskTemplateDto, UserSummaryDto } from '../../../../services/api.service';
import { AuthService } from '../../../../services/auth.service';

type TaskSort = 'due_date' | 'priority' | 'status' | 'category' | 'manual';
type TaskGroupBy = 'none' | 'category' | 'assignee' | 'priority';

@Component({
  selector: 'app-enquiry-tasks-tab',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './tasks-tab.component.html',
  styleUrl: './tasks-tab.component.scss'
})
export class TasksTabComponent implements OnInit, OnChanges {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) enquiryId!: string;
  @Input({ required: true }) venueId!: string;
  @Input({ required: true }) eventType = '';
  @Input({ required: true }) eventDate = '';
  @Input() enquiryOwnerId?: string | null;
  @Input() users: UserSummaryDto[] = [];

  @ViewChild('quickAddInput') quickAddInput?: ElementRef<HTMLInputElement>;

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly tasks = signal<TaskItemDto[]>([]);
  readonly summary = signal({
    completed: 0,
    total: 0,
    percent: 0
  });
  readonly selectedTask = signal<TaskItemDto | null>(null);
  readonly showFullForm = signal(false);
  readonly showTemplateModal = signal(false);
  readonly templateForceApply = signal(false);
  readonly templates = signal<TaskTemplateDto[]>([]);
  readonly draggingTaskId = signal<string | null>(null);

  readonly filtersForm = this.formBuilder.group({
    status: [''],
    assigneeScope: ['all'],
    assigneeId: [''],
    category: [''],
    priority: [''],
    sort: ['manual'],
    groupBy: ['none']
  });

  readonly quickAddForm = this.formBuilder.group({
    title: ['']
  });

  readonly taskForm = this.formBuilder.group({
    id: [''],
    title: [''],
    description: [''],
    status: ['todo'],
    priority: ['medium'],
    category: ['other'],
    assigneeId: [''],
    dueDate: [''],
    dueTime: [''],
    notes: ['']
  });

  readonly groupedTasks = computed(() => {
    const groupBy = (this.filtersForm.get('groupBy')?.value as TaskGroupBy) ?? 'none';
    const filtered = this.applyClientFilters(this.tasks());

    if (groupBy === 'none') {
      return [{ key: 'all', label: 'All Tasks', items: filtered }];
    }

    const groups = new Map<string, TaskItemDto[]>();
    for (const task of filtered) {
      const key = groupBy === 'category'
        ? task.category
        : groupBy === 'assignee'
          ? task.assigneeName || 'Unassigned'
          : task.priority;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(task);
    }

    return [...groups.entries()].map(([key, items]) => ({ key, label: key, items }));
  });

  private focusedTaskId: string | null = null;

  ngOnInit(): void {
    this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.loadTasks();
    });

    this.loadTemplates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enquiryId'] || changes['venueId']) {
      this.loadTasks();
      this.loadTemplates();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyboard(event: KeyboardEvent): void {
    if (event.key.toLowerCase() === 'n') {
      event.preventDefault();
      this.quickAddInput?.nativeElement.focus();
      return;
    }

    if (event.key === 'Escape') {
      if (this.selectedTask()) {
        this.closeDetail();
        event.preventDefault();
      }
      this.showFullForm.set(false);
      return;
    }

    if (event.key === ' ' && this.focusedTaskId) {
      const task = this.tasks().find((item) => item.id === this.focusedTaskId);
      if (task) {
        event.preventDefault();
        this.toggleComplete(task, task.status !== 'completed');
      }
    }
  }

  loadTasks(): void {
    if (!this.enquiryId) {
      this.tasks.set([]);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const filter = this.filtersForm.getRawValue();
    const assigneeScope = filter.assigneeScope ?? 'all';
    const assigneeId = assigneeScope === 'specific' ? (filter.assigneeId || undefined) : undefined;
    const status = filter.status || undefined;
    const category = filter.category || undefined;
    const priority = filter.priority || undefined;
    const sort = filter.sort || 'manual';

    this.api
      .getEnquiryTasks(this.enquiryId, {
        assigneeId,
        status,
        category,
        priority,
        sort
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          this.tasks.set(response.items);
          this.updateProgress();
          if (this.selectedTask()) {
            const refreshed = response.items.find((item) => item.id === this.selectedTask()!.id) ?? null;
            this.selectedTask.set(refreshed);
            if (refreshed) {
              this.patchTaskForm(refreshed);
            }
          }
        },
        error: (error) => {
          this.loading.set(false);
          this.tasks.set([]);
          const message = typeof error?.error === 'string' ? error.error : 'Unable to load enquiry tasks.';
          this.errorMessage.set(message);
          this.updateProgress();
        }
      });
  }

  loadTemplates(): void {
    if (!this.venueId) {
      this.templates.set([]);
      return;
    }

    this.api
      .getTaskTemplates(this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const filtered = response.templates.filter((template) => template.eventType === this.eventType || template.eventType === 'Any');
          this.templates.set(filtered);
        },
        error: () => this.templates.set([])
      });
  }

  quickAdd(): void {
    const title = (this.quickAddForm.get('title')?.value ?? '').trim();
    if (!title || !this.enquiryId) {
      return;
    }

    this.api
      .createTask(this.enquiryId, {
        title,
        status: 'todo',
        priority: 'medium',
        category: 'other',
        assigneeId: null,
        dueDate: null,
        dueTime: null
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) => {
          this.quickAddForm.patchValue({ title: '' });
          this.tasks.set([...this.tasks(), created]);
          this.updateProgress();
        },
        error: () => this.errorMessage.set('Unable to add task.')
      });
  }

  createFromForm(): void {
    const value = this.taskForm.getRawValue();
    const title = (value.title ?? '').trim();
    if (!title || !this.enquiryId) {
      this.errorMessage.set('Task title is required.');
      return;
    }

    this.api
      .createTask(this.enquiryId, {
        title,
        description: value.description || null,
        status: value.status || 'todo',
        priority: value.priority || 'medium',
        category: value.category || 'other',
        assigneeId: value.assigneeId || null,
        dueDate: value.dueDate || null,
        dueTime: value.dueTime || null,
        notes: value.notes || null
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) => {
          this.tasks.set([...this.tasks(), created]);
          this.updateProgress();
          this.showFullForm.set(false);
          this.taskForm.reset({
            id: '',
            title: '',
            description: '',
            status: 'todo',
            priority: 'medium',
            category: 'other',
            assigneeId: '',
            dueDate: '',
            dueTime: '',
            notes: ''
          });
        },
        error: () => this.errorMessage.set('Unable to create task.')
      });
  }

  openDetail(task: TaskItemDto): void {
    this.selectedTask.set(task);
    this.patchTaskForm(task);
  }

  closeDetail(): void {
    this.selectedTask.set(null);
  }

  saveDetail(): void {
    const value = this.taskForm.getRawValue();
    const taskId = value.id || this.selectedTask()?.id;
    if (!taskId || !this.enquiryId) {
      return;
    }

    this.api
      .updateTask(this.enquiryId, taskId, {
        title: value.title || '',
        description: value.description || null,
        status: value.status || 'todo',
        priority: value.priority || 'medium',
        category: value.category || 'other',
        assigneeId: value.assigneeId || null,
        dueDate: value.dueDate || null,
        dueTime: value.dueTime || null,
        notes: value.notes || null
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.replaceTask(updated);
          this.selectedTask.set(updated);
          this.patchTaskForm(updated);
          this.updateProgress();
        },
        error: () => this.errorMessage.set('Unable to save task changes.')
      });
  }

  toggleComplete(task: TaskItemDto, shouldComplete: boolean): void {
    const request$ = shouldComplete
      ? this.api.completeTask(this.enquiryId, task.id, task.notes ?? null)
      : this.api.reopenTask(this.enquiryId, task.id);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.replaceTask(updated);
          this.updateProgress();
          if (this.selectedTask()?.id === updated.id) {
            this.selectedTask.set(updated);
            this.patchTaskForm(updated);
          }
        },
        error: () => this.errorMessage.set('Unable to update task status.')
      });
  }

  cancelTask(task: TaskItemDto): void {
    this.api
      .updateTask(this.enquiryId, task.id, {
        title: task.title,
        description: task.description ?? null,
        status: 'cancelled',
        priority: task.priority,
        category: task.category,
        assigneeId: task.assigneeId ?? null,
        dueDate: task.dueDate ?? null,
        dueTime: task.dueTime ?? null,
        notes: task.notes ?? null
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.replaceTask(updated);
          this.updateProgress();
        },
        error: () => this.errorMessage.set('Unable to cancel task.')
      });
  }

  deleteTask(task: TaskItemDto): void {
    this.api
      .deleteTask(this.enquiryId, task.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.tasks.set(this.tasks().filter((item) => item.id !== task.id));
          this.updateProgress();
          if (this.selectedTask()?.id === task.id) {
            this.closeDetail();
          }
        },
        error: () => this.errorMessage.set('Unable to delete task.')
      });
  }

  openTemplateModal(): void {
    this.showTemplateModal.set(true);
    this.templateForceApply.set(false);
  }

  closeTemplateModal(): void {
    this.showTemplateModal.set(false);
  }

  applyTemplate(template: TaskTemplateDto): void {
    this.api
      .applyTaskTemplate(this.enquiryId, template.id, this.templateForceApply())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result.alreadyApplied && !this.templateForceApply()) {
            this.errorMessage.set('This template has already been applied. Enable force apply to add again.');
            return;
          }

          this.closeTemplateModal();
          this.loadTasks();
        },
        error: () => this.errorMessage.set('Unable to apply task template.')
      });
  }

  templateTaskTitles(template: TaskTemplateDto): string {
    return template.tasks.map((task) => task.title).join(', ');
  }

  onDragStart(task: TaskItemDto): void {
    if ((this.filtersForm.get('sort')?.value || 'manual') !== 'manual') {
      return;
    }
    this.draggingTaskId.set(task.id);
  }

  onDrop(targetTask: TaskItemDto): void {
    if ((this.filtersForm.get('sort')?.value || 'manual') !== 'manual') {
      return;
    }

    const draggingId = this.draggingTaskId();
    if (!draggingId || draggingId === targetTask.id) {
      return;
    }

    const ordered = [...this.tasks()];
    const sourceIndex = ordered.findIndex((task) => task.id === draggingId);
    const targetIndex = ordered.findIndex((task) => task.id === targetTask.id);
    if (sourceIndex < 0 || targetIndex < 0) {
      return;
    }

    const [moved] = ordered.splice(sourceIndex, 1);
    ordered.splice(targetIndex, 0, moved);
    this.tasks.set(ordered);
    this.draggingTaskId.set(null);

    this.api
      .reorderEnquiryTasks(this.enquiryId, ordered.map((task) => task.id))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.tasks.set(response.items);
          this.updateProgress();
        },
        error: () => {
          this.errorMessage.set('Unable to persist task order.');
          this.loadTasks();
        }
      });
  }

  trackTaskFocus(taskId: string): void {
    this.focusedTaskId = taskId;
  }

  onQuickAddKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.quickAdd();
    }
  }

  private patchTaskForm(task: TaskItemDto): void {
    this.taskForm.patchValue({
      id: task.id,
      title: task.title,
      description: task.description ?? '',
      status: task.status,
      priority: task.priority,
      category: task.category,
      assigneeId: task.assigneeId ?? '',
      dueDate: task.dueDate ?? '',
      dueTime: task.dueTime ?? '',
      notes: task.notes ?? ''
    });
  }

  private replaceTask(updated: TaskItemDto): void {
    this.tasks.set(this.tasks().map((item) => (item.id === updated.id ? updated : item)));
  }

  private updateProgress(): void {
    const list = this.tasks();
    const total = list.length;
    const completed = list.filter((task) => task.status === 'completed').length;
    this.summary.set({
      completed,
      total,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100)
    });
  }

  private applyClientFilters(source: TaskItemDto[]): TaskItemDto[] {
    const filter = this.filtersForm.getRawValue();
    let tasks = [...source];

    if (filter.assigneeScope === 'mine') {
      const currentUserId = this.users.find((user) => user.email === this.auth.session?.email)?.id ?? this.auth.session?.userId;
      tasks = tasks.filter((task) => !!currentUserId && task.assigneeId === currentUserId);
    } else if (filter.assigneeScope === 'unassigned') {
      tasks = tasks.filter((task) => !task.assigneeId);
    } else if (filter.assigneeScope === 'specific' && filter.assigneeId) {
      tasks = tasks.filter((task) => task.assigneeId === filter.assigneeId);
    }

    const sort = (filter.sort as TaskSort) || 'manual';
    tasks.sort((left, right) => this.compareTasks(left, right, sort));
    return tasks;
  }

  private compareTasks(left: TaskItemDto, right: TaskItemDto, sort: TaskSort): number {
    if (sort === 'priority') {
      return this.priorityWeight(right.priority) - this.priorityWeight(left.priority);
    }
    if (sort === 'status') {
      return left.status.localeCompare(right.status);
    }
    if (sort === 'category') {
      return left.category.localeCompare(right.category);
    }
    if (sort === 'manual') {
      return left.sortOrder - right.sortOrder;
    }

    const leftDue = left.dueDate ? new Date(left.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
    const rightDue = right.dueDate ? new Date(right.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
    return leftDue - rightDue;
  }

  private priorityWeight(priority: string): number {
    switch (priority) {
      case 'urgent':
        return 4;
      case 'high':
        return 3;
      case 'medium':
        return 2;
      case 'low':
      default:
        return 1;
    }
  }

  assigneeInitials(task: TaskItemDto): string {
    const name = (task.assigneeName || '').trim();
    if (!name) {
      return 'UN';
    }

    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
  }

  dueState(task: TaskItemDto): 'none' | 'future' | 'today' | 'overdue' {
    if (!task.dueDate) {
      return 'none';
    }

    const due = new Date(task.dueDate);
    if (Number.isNaN(due.getTime())) {
      return 'none';
    }

    const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const today = new Date();
    const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (task.status === 'completed' || task.status === 'cancelled') {
      return dueDate < localToday ? 'overdue' : dueDate.getTime() === localToday.getTime() ? 'today' : 'future';
    }

    if (dueDate < localToday) {
      return 'overdue';
    }

    if (dueDate.getTime() === localToday.getTime()) {
      return 'today';
    }

    return 'future';
  }
}
