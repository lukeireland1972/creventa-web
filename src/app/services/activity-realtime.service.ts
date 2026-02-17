import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';

export interface ActivityRealtimeEvent {
  id?: string;
  actionType?: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  createdAtUtc?: string;
}

@Injectable({ providedIn: 'root' })
export class ActivityRealtimeService {
  private connection: signalR.HubConnection | null = null;
  private startPromise: Promise<void> | null = null;
  private subscribedTenantId: string | null = null;
  private subscribedVenueIds = new Set<string>();
  private eventsSubject = new Subject<ActivityRealtimeEvent>();

  readonly events$ = this.eventsSubject.asObservable();

  constructor(private auth: AuthService) {}

  async ensureConnected(tenantId: string, venueId?: string | null): Promise<void> {
    if (!tenantId) {
      return;
    }

    this.subscribedTenantId = tenantId;
    if (venueId) {
      this.subscribedVenueIds.add(venueId);
    }

    await this.startConnectionAsync();
    await this.subscribeAsync();
  }

  private async startConnectionAsync(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    if (this.startPromise) {
      return this.startPromise;
    }

    if (!this.connection) {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/notifications', {
          accessTokenFactory: () => this.auth.accessToken ?? ''
        })
        .withAutomaticReconnect()
        .build();

      this.connection.on('activity.logged', (payload: ActivityRealtimeEvent) => {
        this.eventsSubject.next(payload ?? {});
      });

      this.connection.onreconnected(() => this.subscribeAsync());
    }

    this.startPromise = this.connection.start()
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => {
        this.startPromise = null;
      });

    await this.startPromise;
  }

  private async subscribeAsync(): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    if (this.subscribedTenantId) {
      await this.connection.invoke('SubscribeTenant', this.subscribedTenantId).catch(() => undefined);
    }

    if (this.subscribedVenueIds.size > 0) {
      for (const venueId of this.subscribedVenueIds) {
        await this.connection.invoke('SubscribeVenue', venueId).catch(() => undefined);
      }
    }
  }
}
