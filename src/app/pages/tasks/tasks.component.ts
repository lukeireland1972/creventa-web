import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, TaskItemDto, TaskListResponse, UserSummaryDto } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { QuickTaskCreatedEvent, TaskQuickCreateModalComponent } from '../../ui/task-quick-create-modal/task-quick-create-modal.component';

type SummaryFilter = 'all' | 'overdue' | 'today' | 'week' | 'in_progress' | 'completed30';
type ViewMode = 'all' | 'my';
type GroupBy = 'none' | 'enquiry' | 'assignee' | 'category' | 'priority';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, TaskQuickCreateModalComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly response = signal<TaskListResponse | null>(null);
  readonly users = signal<UserSummaryDto[]>([]);
  readonly selectedIds = signal<Set<string>>(new Set<string>());
  readonly expandedTaskId = signal<string | null>(null);
  readonly activeSummaryFilter = signal<SummaryFilter>('all');
  readonly viewMode = signal<ViewMode>('all');
  readonly bulkBusy = signal(false);
  readonly bulkMessage = signal('');
  readonly showAddTaskModal = signal(false);

  readonly filtersForm = this.formBuilder.group({
    status: [''],
    assigneeScope: ['all'],
    assigneeId: [''],
    category: [''],
    priority: [''],
    datePreset: [''],
    dateFrom: [''],
    dateTo: [''],
    groupBy: ['none'],
    sort: ['due_date']
  });

  readonly bulkForm = this.formBuilder.group({
    assignTo: [''],
    changePriority: [''],
    rescheduleDate: ['']
  });

  readonly tasks = computed(() => this.response()?.items ?? []);
  readonly summary = computed(() => this.response()?.summary ?? null);

  readonly visibleTasks = computed(() => {
    const base = this.tasks();
    const summaryFilter = this.activeSummaryFilter();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let filtered = base;
    if (summaryFilter === 'overdue') {
      filtered = filtered.filter((task) => task.isOverdue);
    } else if (summaryFilter === 'today') {
      filtered = filtered.filter((task) => this.toDate(task.dueDate)?.getTime() === today.getTime() && !this.isTerminal(task.status));
    } else if (summaryFilter === 'week') {
      filtered = filtered.filter((task) => {
        const due = this.toDate(task.dueDate);
        return !!due && due >= today && due <= in7Days && !this.isTerminal(task.status);
      });
    } else if (summaryFilter === 'in_progress') {
      filtered = filtered.filter((task) => task.status === 'in_progress');
    } else if (summaryFilter === 'completed30') {
      filtered = filtered.filter((task) => {
        if (!task.completedAtUtc) {
          return false;
        }
        const completed = new Date(task.completedAtUtc);
        return completed >= thirtyDaysAgo;
      });
    }

    const form = this.filtersForm.getRawValue();
    if (form.assigneeScope === 'unassigned') {
      filtered = filtered.filter((task) => !task.assigneeId);
    } else if (form.assigneeScope === 'mine') {
      const currentUserId = this.auth.session?.userId;
      filtered = filtered.filter((task) => !!currentUserId && task.assigneeId === currentUserId);
    } else if (form.assigneeScope === 'specific' && form.assigneeId) {
      filtered = filtered.filter((task) => task.assigneeId === form.assigneeId);
    }

    if (form.dateFrom) {
      const from = new Date(form.dateFrom);
      filtered = filtered.filter((task) => {
        const due = this.toDate(task.dueDate);
        return !due || due >= from;
      });
    }
    if (form.dateTo) {
      const to = new Date(form.dateTo);
      filtered = filtered.filter((task) => {
        const due = this.toDate(task.dueDate);
        return !due || due <= to;
      });
    }

    return filtered;
  });

  readonly groupedTasks = computed(() => {
    const tasks = this.visibleTasks();
    const viewMode = this.viewMode();
    if (viewMode === 'my') {
      return this.groupMyTasks(tasks);
    }

    const groupBy = (this.filtersForm.get('groupBy')?.value as GroupBy) ?? 'none';
    if (groupBy === 'none') {
      return [{ key: 'all', label: 'All Tasks', tasks }];
    }

    const map = new Map<string, TaskItemDto[]>();
    for (const task of tasks) {
      const key = this.resolveGroupKey(task, groupBy);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(task);
    }

    return [...map.entries()].map(([key, grouped]) => ({ key, label: key, tasks: grouped }));
  });

  get venueId(): string | null {
    return this.auth.selectedVenueId;
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const queryView = params.get('view');
      const querySummary = this.parseSummaryFilter(params.get('summary'));
      const nextView: ViewMode = queryView === 'my' ? 'my' : 'all';
      let changed = false;

      if (this.viewMode() !== nextView) {
        this.viewMode.set(nextView);
        changed = true;
      }

      if (this.activeSummaryFilter() !== querySummary) {
        this.activeSummaryFilter.set(querySummary);
        changed = true;
      }

      if (changed) {
        this.clearSelection();
        this.loadTasks();
      }
    });

    this.auth.session$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.loadUsers();
      this.loadTasks();
    });

    this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.clearSelection();
      this.loadTasks();
    });
  }

  setViewMode(mode: ViewMode): void {
    if (this.viewMode() === mode) {
      return;
    }
    this.viewMode.set(mode);
    this.clearSelection();
    this.syncQueryParams();
    this.loadTasks();
  }

  setSummaryFilter(filter: SummaryFilter): void {
    this.activeSummaryFilter.set(filter);
    this.clearSelection();
    this.syncQueryParams();
    this.loadTasks();
  }

  openAddTaskModal(): void {
    this.showAddTaskModal.set(true);
  }

  closeAddTaskModal(): void {
    this.showAddTaskModal.set(false);
  }

  onTaskQuickCreated(event: QuickTaskCreatedEvent): void {
    this.showAddTaskModal.set(false);
    this.bulkMessage.set('Task created.');
    this.loadTasks();
  }

  onDatePresetChange(): void {
    const preset = this.filtersForm.get('datePreset')?.value || '';
    if (!preset) {
      return;
    }

    const today = this.localDateOnly(new Date());
    let from: Date;
    let to: Date;

    switch (preset) {
      case 'this_month':
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'last_30':
        to = today;
        from = new Date(today);
        from.setDate(from.getDate() - 29);
        break;
      case 'last_90':
        to = today;
        from = new Date(today);
        from.setDate(from.getDate() - 89);
        break;
      case 'this_year':
        from = new Date(today.getFullYear(), 0, 1);
        to = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        return;
    }

    this.filtersForm.patchValue(
      {
        dateFrom: this.toIsoDate(from),
        dateTo: this.toIsoDate(to)
      },
      { emitEvent: true }
    );
  }

  loadTasks(): void {
    const venueId = this.venueId;
    if (!venueId) {
      this.response.set(null);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const form = this.filtersForm.getRawValue();
    const viewMode = this.viewMode();
    const params = {
      status: form.status || undefined,
      category: form.category || undefined,
      priority: form.priority || undefined,
      sort: form.sort || 'due_date'
    };

    const request$ = viewMode === 'my'
      ? this.api.getMyTasks(venueId, params)
      : this.api.getTasks({
          venueId,
          status: params.status,
          category: params.category,
          priority: params.priority,
          sort: params.sort,
          dateFrom: form.dateFrom || undefined,
          dateTo: form.dateTo || undefined,
          due: this.summaryFilterToDue(this.activeSummaryFilter())
        });

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.loading.set(false);
          this.response.set(result);
          this.syncSelection(result.items);
        },
        error: (error) => {
          this.loading.set(false);
          const message = typeof error?.error === 'string' ? error.error : 'Unable to load tasks.';
          this.errorMessage.set(message);
          this.response.set({ items: [], summary: this.emptySummary() });
        }
      });
  }

  loadUsers(): void {
    const venueId = this.venueId;
    if (!venueId) {
      this.users.set([]);
      return;
    }

    this.api.getUsers(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => this.users.set(users),
        error: () => this.users.set([])
      });
  }

  isSelected(taskId: string): boolean {
    return this.selectedIds().has(taskId);
  }

  toggleRowSelection(taskId: string, checked: boolean): void {
    const next = new Set(this.selectedIds());
    if (checked) {
      next.add(taskId);
    } else {
      next.delete(taskId);
    }
    this.selectedIds.set(next);
  }

  toggleSelectAll(checked: boolean): void {
    if (!checked) {
      this.clearSelection();
      return;
    }

    this.selectedIds.set(new Set(this.visibleTasks().map((task) => task.id)));
  }

  get allSelected(): boolean {
    const visibleIds = this.visibleTasks().map((task) => task.id);
    return visibleIds.length > 0 && visibleIds.every((id) => this.selectedIds().has(id));
  }

  get someSelected(): boolean {
    const visibleIds = this.visibleTasks().map((task) => task.id);
    const selectedVisible = visibleIds.filter((id) => this.selectedIds().has(id)).length;
    return selectedVisible > 0 && selectedVisible < visibleIds.length;
  }

  get selectedCount(): number {
    return this.selectedIds().size;
  }

  openEnquiry(task: TaskItemDto): void {
    this.router.navigate(['/enquiries'], {
      queryParams: {
        enquiry: task.enquiryId,
        tab: 'tasks',
        statusTab: 'all'
      }
    });
  }

  toggleExpanded(taskId: string): void {
    this.expandedTaskId.set(this.expandedTaskId() === taskId ? null : taskId);
  }

  toggleComplete(task: TaskItemDto, checked: boolean): void {
    const request$ = checked
      ? this.api.completeTask(task.enquiryId, task.id, task.notes ?? null)
      : this.api.reopenTask(task.enquiryId, task.id);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updated) => this.mergeTask(updated),
      error: () => this.errorMessage.set('Unable to update task status.')
    });
  }

  applyBulkAssign(): void {
    const assigneeId = this.bulkForm.get('assignTo')?.value || null;
    this.applyBulkUpdate((task) => ({
      ...this.toTaskUpdatePayload(task),
      assigneeId
    }), 'Tasks reassigned.');
  }

  applyBulkComplete(): void {
    const selectedTasks = this.resolveSelectedTasks();
    if (selectedTasks.length === 0) {
      return;
    }

    this.bulkBusy.set(true);
    forkJoin(
      selectedTasks.map((task) => this.api.completeTask(task.enquiryId, task.id, task.notes ?? null).pipe(catchError(() => of(null))))
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => {
          this.bulkBusy.set(false);
          for (const updated of results) {
            if (updated) {
              this.mergeTask(updated);
            }
          }
          this.bulkMessage.set('Tasks marked complete.');
          this.clearSelection();
        },
        error: () => {
          this.bulkBusy.set(false);
          this.bulkMessage.set('Bulk complete failed.');
        }
      });
  }

  applyBulkPriority(): void {
    const priority = this.bulkForm.get('changePriority')?.value;
    if (!priority) {
      return;
    }

    this.applyBulkUpdate((task) => ({
      ...this.toTaskUpdatePayload(task),
      priority
    }), 'Priority updated.');
  }

  applyBulkReschedule(): void {
    const dueDate = this.bulkForm.get('rescheduleDate')?.value;
    if (!dueDate) {
      return;
    }

    this.applyBulkUpdate((task) => ({
      ...this.toTaskUpdatePayload(task),
      dueDate
    }), 'Tasks rescheduled.');
  }

  private applyBulkUpdate(
    payloadFactory: (task: TaskItemDto) => {
      title: string;
      description?: string | null;
      status: string;
      priority: string;
      category: string;
      assigneeId?: string | null;
      dueDate?: string | null;
      dueTime?: string | null;
      notes?: string | null;
    },
    successMessage: string
  ): void {
    const selectedTasks = this.resolveSelectedTasks();
    if (selectedTasks.length === 0) {
      return;
    }

    this.bulkBusy.set(true);
    forkJoin(
      selectedTasks.map((task) =>
        this.api.updateTask(task.enquiryId, task.id, payloadFactory(task)).pipe(catchError(() => of(null)))
      )
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => {
          this.bulkBusy.set(false);
          for (const updated of results) {
            if (updated) {
              this.mergeTask(updated);
            }
          }
          this.bulkMessage.set(successMessage);
          this.clearSelection();
        },
        error: () => {
          this.bulkBusy.set(false);
          this.bulkMessage.set('Bulk update failed.');
        }
      });
  }

  private mergeTask(updated: TaskItemDto): void {
    const current = this.response();
    if (!current) {
      return;
    }

    const items = current.items.map((task) => (task.id === updated.id ? updated : task));
    this.response.set({
      items,
      summary: this.computeSummary(items)
    });
  }

  private computeSummary(items: TaskItemDto[]): TaskListResponse['summary'] {
    const today = this.localDateOnly(new Date());
    const in7 = new Date(today);
    in7.setDate(in7.getDate() + 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const completed30 = items.filter((task) => {
      if (!task.completedAtUtc) {
        return false;
      }
      return new Date(task.completedAtUtc) >= thirtyDaysAgo;
    }).length;

    return {
      total: items.length,
      open: items.filter((task) => !this.isTerminal(task.status)).length,
      todo: items.filter((task) => task.status === 'todo').length,
      inProgress: items.filter((task) => task.status === 'in_progress').length,
      completed: items.filter((task) => task.status === 'completed').length,
      cancelled: items.filter((task) => task.status === 'cancelled').length,
      overdue: items.filter((task) => task.isOverdue).length,
      dueToday: items.filter((task) => this.toDate(task.dueDate)?.getTime() === today.getTime() && !this.isTerminal(task.status)).length,
      dueThisWeek: items.filter((task) => {
        const due = this.toDate(task.dueDate);
        return !!due && due >= today && due <= in7 && !this.isTerminal(task.status);
      }).length,
      completedLast30Days: completed30,
      unassigned: items.filter((task) => !task.assigneeId).length
    };
  }

  private emptySummary(): TaskListResponse['summary'] {
    return {
      total: 0,
      open: 0,
      todo: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      overdue: 0,
      dueToday: 0,
      dueThisWeek: 0,
      completedLast30Days: 0,
      unassigned: 0
    };
  }

  private resolveSelectedTasks(): TaskItemDto[] {
    const selected = this.selectedIds();
    return this.tasks().filter((task) => selected.has(task.id));
  }

  private syncSelection(items: TaskItemDto[]): void {
    const validIds = new Set(items.map((task) => task.id));
    const next = new Set([...this.selectedIds()].filter((id) => validIds.has(id)));
    this.selectedIds.set(next);
  }

  private clearSelection(): void {
    this.selectedIds.set(new Set<string>());
  }

  private summaryFilterToDue(filter: SummaryFilter): 'today' | 'overdue' | 'week' | 'open' | undefined {
    if (filter === 'today') {
      return 'today';
    }
    if (filter === 'overdue') {
      return 'overdue';
    }
    if (filter === 'week') {
      return 'week';
    }
    if (filter === 'all') {
      return undefined;
    }
    return undefined;
  }

  private parseSummaryFilter(raw: string | null): SummaryFilter {
    switch ((raw || '').trim().toLowerCase()) {
      case 'overdue':
        return 'overdue';
      case 'today':
        return 'today';
      case 'week':
      case 'due-this-week':
        return 'week';
      case 'in_progress':
      case 'in-progress':
        return 'in_progress';
      case 'completed30':
      case 'completed-30':
        return 'completed30';
      default:
        return 'all';
    }
  }

  private syncQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        view: this.viewMode() === 'my' ? 'my' : null,
        summary: this.activeSummaryFilter() === 'all' ? null : this.activeSummaryFilter()
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private resolveGroupKey(task: TaskItemDto, groupBy: GroupBy): string {
    if (groupBy === 'enquiry') {
      return `${task.enquiryReference} - ${task.enquiryName}`;
    }
    if (groupBy === 'assignee') {
      return task.assigneeName || 'Unassigned';
    }
    if (groupBy === 'category') {
      return task.category;
    }
    return task.priority;
  }

  private groupMyTasks(tasks: TaskItemDto[]): Array<{ key: string; label: string; tasks: TaskItemDto[] }> {
    const today = this.localDateOnly(new Date());
    const in7 = new Date(today);
    in7.setDate(in7.getDate() + 7);
    const groups = new Map<string, TaskItemDto[]>();

    const ensure = (key: string) => {
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      return groups.get(key)!;
    };

    for (const task of tasks) {
      const due = this.toDate(task.dueDate);
      let bucket = 'No Due Date';
      if (task.isOverdue) {
        bucket = 'Overdue';
      } else if (due && due.getTime() === today.getTime()) {
        bucket = 'Due Today';
      } else if (due && due > today && due <= in7) {
        bucket = 'Due This Week';
      } else if (due && due > in7) {
        bucket = 'Due Later';
      }
      ensure(bucket).push(task);
    }

    const order = ['Overdue', 'Due Today', 'Due This Week', 'Due Later', 'No Due Date'];
    return order
      .filter((key) => groups.has(key))
      .map((key) => ({ key, label: key, tasks: groups.get(key)! }));
  }

  private toTaskUpdatePayload(task: TaskItemDto): {
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    category: string;
    assigneeId?: string | null;
    dueDate?: string | null;
    dueTime?: string | null;
    notes?: string | null;
  } {
    return {
      title: task.title,
      description: task.description ?? null,
      status: task.status,
      priority: task.priority,
      category: task.category,
      assigneeId: task.assigneeId ?? null,
      dueDate: task.dueDate ?? null,
      dueTime: task.dueTime ?? null,
      notes: task.notes ?? null
    };
  }

  private isTerminal(status: string): boolean {
    return status === 'completed' || status === 'cancelled';
  }

  private toDate(value?: string | null): Date | null {
    if (!value) {
      return null;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    return this.localDateOnly(parsed);
  }

  private localDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private toIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
