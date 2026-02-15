import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ApiService,
  ChatChannelDto,
  ChatMessageDto,
  ConnectTimelineItemDto,
  UnmatchedEmailDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.scss'
})
export class ConnectComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  venueId: string | null = null;

  timelineType: 'all' | 'emails' | 'notes' | 'system' = 'all';
  timelineSearch = '';
  timeline: ConnectTimelineItemDto[] = [];
  unmatchedEmailCount = 0;
  unreadMentionCount = 0;

  selectedEnquiryId = '';
  noteDraft = '';

  emailTo = '';
  emailCc = '';
  emailSubject = '';
  emailBody = '';

  unmatchedInbox: UnmatchedEmailDto[] = [];

  channels: ChatChannelDto[] = [];
  selectedChannelId: string | null = null;
  chatMessages: ChatMessageDto[] = [];
  chatDraft = '';

  isLoadingTimeline = false;
  isLoadingChat = false;

  get canCompose(): boolean {
    return this.selectedEnquiryId.length > 0;
  }

  get selectedChannel(): ChatChannelDto | null {
    return this.channels.find((channel) => channel.id === this.selectedChannelId) ?? null;
  }

  ngOnInit(): void {
    this.venueId = this.auth.selectedVenueId;
    if (!this.venueId) {
      return;
    }

    this.loadTimeline();
    this.loadUnmatchedInbox();
    this.loadChannels();
  }

  setTimelineType(type: 'all' | 'emails' | 'notes' | 'system'): void {
    this.timelineType = type;
    this.loadTimeline();
  }

  loadTimeline(): void {
    if (!this.venueId) {
      return;
    }

    this.isLoadingTimeline = true;
    this.api
      .getConnectTimeline({
        venueId: this.venueId,
        type: this.timelineType,
        search: this.timelineSearch || undefined,
        page: 1,
        pageSize: 80
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.timeline = response.page.items;
          this.unmatchedEmailCount = response.unmatchedEmailCount;
          this.unreadMentionCount = response.unreadMentionCount;

          if (!this.selectedEnquiryId && this.timeline.length > 0) {
            this.selectedEnquiryId = this.timeline[0].enquiryId;
          }

          this.isLoadingTimeline = false;
        },
        error: () => {
          this.timeline = [];
          this.isLoadingTimeline = false;
        }
      });
  }

  selectTimelineItem(item: ConnectTimelineItemDto): void {
    this.selectedEnquiryId = item.enquiryId;
  }

  addNote(): void {
    if (!this.canCompose || !this.noteDraft.trim()) {
      return;
    }

    this.api
      .addInternalNote(this.selectedEnquiryId, { body: this.noteDraft.trim() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.noteDraft = '';
          this.loadTimeline();
        }
      });
  }

  sendEmail(): void {
    if (!this.canCompose || !this.venueId || !this.emailTo.trim() || !this.emailSubject.trim() || !this.emailBody.trim()) {
      return;
    }

    this.api
      .sendConnectEmail(this.selectedEnquiryId, {
        venueId: this.venueId,
        to: this.emailTo.trim(),
        cc: this.emailCc.trim() || undefined,
        subject: this.emailSubject.trim(),
        body: this.emailBody.trim()
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.emailTo = '';
          this.emailCc = '';
          this.emailSubject = '';
          this.emailBody = '';
          this.loadTimeline();
        }
      });
  }

  loadUnmatchedInbox(): void {
    if (!this.venueId) {
      return;
    }

    this.api
      .getUnmatchedInbox(this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.unmatchedInbox = response.items;
        },
        error: () => {
          this.unmatchedInbox = [];
        }
      });
  }

  linkUnmatched(item: UnmatchedEmailDto): void {
    if (!this.selectedEnquiryId) {
      return;
    }

    this.api
      .linkUnmatchedInboxItem(item.id, this.selectedEnquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadUnmatchedInbox();
          this.loadTimeline();
        }
      });
  }

  loadChannels(): void {
    this.api
      .getChatChannels(this.venueId ?? undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.channels = response.channels;
          if (!this.selectedChannelId && this.channels.length > 0) {
            this.openChannel(this.channels[0]);
          }
        },
        error: () => {
          this.channels = [];
          this.chatMessages = [];
        }
      });
  }

  openChannel(channel: ChatChannelDto): void {
    this.selectedChannelId = channel.id;
    this.isLoadingChat = true;

    this.api
      .getChatThread(channel.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.chatMessages = response.messages;
          this.isLoadingChat = false;
          this.api.markChatRead(channel.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
          this.loadChannels();
        },
        error: () => {
          this.chatMessages = [];
          this.isLoadingChat = false;
        }
      });
  }

  sendChatMessage(): void {
    if (!this.selectedChannelId || !this.chatDraft.trim()) {
      return;
    }

    this.api
      .sendChatMessage(this.selectedChannelId, { body: this.chatDraft.trim() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (message) => {
          this.chatMessages = [...this.chatMessages, message];
          this.chatDraft = '';
          this.loadChannels();
        }
      });
  }
}
