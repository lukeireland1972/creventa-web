import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, NotificationItemDto } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

type NotificationFilter = 'all' | 'unread' | 'read';

@Component({
  selector: 'app-notifications',
  imports: [DatePipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  loading = false;
  errorMessage = '';
  unreadCount = 0;
  notifications: NotificationItemDto[] = [];
  filter: NotificationFilter = 'all';

  get filteredNotifications(): NotificationItemDto[] {
    if (this.filter === 'unread') {
      return this.notifications.filter((item) => !item.isRead);
    }
    if (this.filter === 'read') {
      return this.notifications.filter((item) => item.isRead);
    }
    return this.notifications;
  }

  get groupedNotifications(): Array<{ key: string; label: string; items: NotificationItemDto[] }> {
    const today = new Date();
    const todayKey = this.dateKey(today);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = this.dateKey(yesterday);

    const groups: Array<{ key: string; label: string; items: NotificationItemDto[] }> = [
      { key: 'today', label: 'Today', items: [] },
      { key: 'yesterday', label: 'Yesterday', items: [] },
      { key: 'earlier', label: 'Earlier', items: [] }
    ];

    for (const item of this.filteredNotifications) {
      const itemKey = this.dateKey(new Date(item.createdAtUtc));
      if (itemKey === todayKey) {
        groups[0].items.push(item);
      } else if (itemKey === yesterdayKey) {
        groups[1].items.push(item);
      } else {
        groups[2].items.push(item);
      }
    }

    return groups.filter((group) => group.items.length > 0);
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  setFilter(filter: NotificationFilter): void {
    this.filter = filter;
  }

  refresh(): void {
    this.loadNotifications();
  }

  markAllRead(): void {
    this.api
      .markNotificationsRead({ markAll: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadNotifications();
        },
        error: () => {
          this.errorMessage = 'Unable to mark notifications as read right now.';
        }
      });
  }

  openNotification(item: NotificationItemDto): void {
    const navigate = () => {
      if (item.linkUrl) {
        this.router.navigateByUrl(item.linkUrl);
      }
    };

    if (item.isRead) {
      navigate();
      return;
    }

    this.api
      .markNotificationsRead({ markAll: false, notificationIds: [item.id] })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notifications = this.notifications.map((row) =>
            row.id === item.id
              ? { ...row, isRead: true, readAtUtc: new Date().toISOString() }
              : row);
          this.unreadCount = Math.max(0, this.unreadCount - 1);
          navigate();
        },
        error: () => {
          this.errorMessage = 'Unable to update notification status right now.';
          navigate();
        }
      });
  }

  private loadNotifications(): void {
    this.loading = true;
    this.errorMessage = '';
    this.api
      .getNotifications(this.auth.selectedVenueId ?? undefined, 200)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.notifications = response.items ?? [];
          this.unreadCount = response.unreadCount ?? 0;
          this.loading = false;
        },
        error: () => {
          this.notifications = [];
          this.unreadCount = 0;
          this.loading = false;
          this.errorMessage = 'Unable to load notifications right now.';
        }
      });
  }

  private dateKey(value: Date): string {
    return `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`;
  }
}
