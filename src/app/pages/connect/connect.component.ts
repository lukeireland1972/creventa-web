import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';
import { QuillModule } from 'ngx-quill';
import {
  ApiService,
  ChatChannelDto,
  ChatMessageDto,
  ConnectEmailTemplateDto,
  ConnectInlineAttachmentDto,
  ConnectTimelineItemDto,
  EnquiryDetailResponse,
  UnmatchedEmailDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { QuickTaskCreatedEvent, TaskQuickCreateModalComponent } from '../../ui/task-quick-create-modal/task-quick-create-modal.component';

interface ComposeAttachment {
  id: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
  contentBase64: string;
}

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_BYTES = 25 * 1024 * 1024;
const ALLOWED_ATTACHMENT_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'csv']);
const ALLOWED_ATTACHMENT_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'text/csv'
]);

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [FormsModule, DatePipe, QuillModule, TaskQuickCreateModalComponent],
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
  selectedEnquiry: EnquiryDetailResponse | null = null;
  noteDraft = '';

  composeChannel: 'email' | 'portal' = 'email';
  emailTo = '';
  emailCc = '';
  emailBcc = '';
  emailSubject = '';
  emailBody = '';
  showEmailCopyFields = false;
  portalSubject = '';
  portalBody = '';
  composeError = '';
  composeSuccess = '';

  showTemplatePicker = false;
  templatesLoading = false;
  templateError = '';
  emailTemplates: ConnectEmailTemplateDto[] = [];

  attachmentError = '';
  isAttachmentDragActive = false;
  attachments: ComposeAttachment[] = [];
  isSendingCompose = false;

  unmatchedInbox: UnmatchedEmailDto[] = [];

  channels: ChatChannelDto[] = [];
  selectedChannelId: string | null = null;
  chatMessages: ChatMessageDto[] = [];
  chatDraft = '';

  isLoadingTimeline = false;
  isLoadingChat = false;
  showAddTaskModal = false;
  readonly composeEditorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ]
  };

  get canCompose(): boolean {
    return this.selectedEnquiryId.length > 0;
  }

  get selectedChannel(): ChatChannelDto | null {
    return this.channels.find((channel) => channel.id === this.selectedChannelId) ?? null;
  }

  get availableTemplates(): ConnectEmailTemplateDto[] {
    return this.emailTemplates.filter((template) => template.isActive);
  }

  get mergeFieldPreviewList(): string[] {
    return Object.entries(this.buildMergeFields()).map(([key, value]) => `${key} = ${value || '—'}`);
  }

  get attachmentTotalBytes(): number {
    return this.attachments.reduce((total, attachment) => total + attachment.sizeBytes, 0);
  }

  get canAttachFiles(): boolean {
    return this.composeChannel === 'email' && this.canCompose;
  }

  get canSendEmail(): boolean {
    return (
      !!this.venueId &&
      this.canCompose &&
      !this.isSendingCompose &&
      !!this.emailTo.trim() &&
      !!this.emailSubject.trim() &&
      this.hasEmailBodyContent(this.emailBody)
    );
  }

  get canSendPortalMessage(): boolean {
    return !!this.venueId && this.canCompose && !this.isSendingCompose && !!this.portalBody.trim();
  }

  ngOnInit(): void {
    this.auth.session$
      .pipe(
        map((session) => session?.venueId ?? null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((venueId) => {
        this.handleVenueChange(venueId);
      });
  }

  setTimelineType(type: 'all' | 'emails' | 'notes' | 'system'): void {
    this.timelineType = type;
    this.loadTimeline();
  }

  openAddTask(): void {
    this.showAddTaskModal = true;
  }

  closeAddTaskModal(): void {
    this.showAddTaskModal = false;
  }

  onTaskQuickCreated(event: QuickTaskCreatedEvent): void {
    this.showAddTaskModal = false;
    if (event.enquiryId === this.selectedEnquiryId) {
      this.loadTimeline();
    }
  }

  setComposeChannel(channel: 'email' | 'portal'): void {
    this.composeChannel = channel;
    this.composeError = '';
    this.composeSuccess = '';
    this.showTemplatePicker = false;
  }

  toggleEmailCopyFields(): void {
    this.showEmailCopyFields = !this.showEmailCopyFields;
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

          if ((!this.selectedEnquiryId || !this.timeline.some((item) => item.enquiryId === this.selectedEnquiryId)) && this.timeline.length > 0) {
            this.selectedEnquiryId = this.timeline[0].enquiryId;
            this.loadSelectedEnquiry();
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
    this.loadSelectedEnquiry();
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

  sendCompose(): void {
    if (this.composeChannel === 'email') {
      this.sendEmail();
      return;
    }

    this.sendPortalMessage();
  }

  sendEmail(): void {
    if (!this.canSendEmail || !this.venueId) {
      return;
    }

    this.composeError = '';
    this.composeSuccess = '';
    this.isSendingCompose = true;

    const inlineAttachments: ConnectInlineAttachmentDto[] = this.attachments.map((attachment) => ({
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      sizeBytes: attachment.sizeBytes,
      contentBase64: attachment.contentBase64
    }));

    this.api
      .sendConnectEmail(this.selectedEnquiryId, {
        venueId: this.venueId,
        to: this.emailTo.trim(),
        cc: this.emailCc.trim() || undefined,
        bcc: this.emailBcc.trim() || undefined,
        subject: this.emailSubject.trim(),
        body: this.emailBody.trim(),
        attachments: inlineAttachments
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSendingCompose = false;
          this.emailTo = '';
          this.emailCc = '';
          this.emailBcc = '';
          this.emailSubject = '';
          this.emailBody = '';
          this.attachments = [];
          this.composeSuccess = 'Email sent successfully.';
          this.loadTimeline();
        },
        error: (error) => {
          this.isSendingCompose = false;
          this.composeError =
            typeof error?.error?.error === 'string' ? error.error.error : 'Unable to send email. Please try again.';
        }
      });
  }

  sendPortalMessage(): void {
    if (!this.canSendPortalMessage || !this.venueId) {
      return;
    }

    this.composeError = '';
    this.composeSuccess = '';
    this.isSendingCompose = true;

    this.api
      .sendConnectPortalMessage(this.selectedEnquiryId, {
        venueId: this.venueId,
        subject: this.portalSubject.trim() || undefined,
        body: this.portalBody.trim()
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSendingCompose = false;
          this.portalSubject = '';
          this.portalBody = '';
          this.composeSuccess = 'Portal message sent.';
          this.loadTimeline();
        },
        error: (error) => {
          this.isSendingCompose = false;
          this.composeError =
            typeof error?.error?.error === 'string' ? error.error.error : 'Unable to send portal message. Please try again.';
        }
      });
  }

  toggleTemplatePicker(): void {
    if (this.templatesLoading) {
      return;
    }

    this.showTemplatePicker = !this.showTemplatePicker;
  }

  applyTemplate(template: ConnectEmailTemplateDto): void {
    this.emailSubject = this.applyMergeFields(template.subjectTemplate);
    this.emailBody = this.applyMergeFields(template.bodyHtmlTemplate);
    this.showTemplatePicker = false;
    this.composeChannel = 'email';
    this.composeSuccess = '';
    this.composeError = '';
  }

  onAttachmentBrowse(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (files.length === 0) {
      return;
    }

    void this.addAttachments(files);
  }

  onAttachmentDragOver(event: DragEvent): void {
    if (!this.canAttachFiles) {
      return;
    }

    event.preventDefault();
    this.isAttachmentDragActive = true;
  }

  onAttachmentDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isAttachmentDragActive = false;
  }

  onAttachmentDrop(event: DragEvent): void {
    if (!this.canAttachFiles) {
      return;
    }

    event.preventDefault();
    this.isAttachmentDragActive = false;

    const files = Array.from(event.dataTransfer?.files ?? []);
    if (files.length === 0) {
      return;
    }

    void this.addAttachments(files);
  }

  removeAttachment(attachmentId: string): void {
    this.attachments = this.attachments.filter((attachment) => attachment.id !== attachmentId);
    if (this.attachments.length === 0) {
      this.attachmentError = '';
    }
  }

  formatAttachmentSize(sizeBytes: number): string {
    if (sizeBytes < 1024) {
      return `${sizeBytes} B`;
    }

    if (sizeBytes < 1024 * 1024) {
      return `${(sizeBytes / 1024).toFixed(1)} KB`;
    }

    return `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  timelineTypeBadgeClass(type: string): string {
    const normalized = type.trim().toLowerCase();
    if (normalized === 'email') {
      return 'email';
    }
    if (normalized === 'portal-message') {
      return 'portal';
    }
    if (normalized === 'note') {
      return 'note';
    }
    if (normalized === 'system') {
      return 'system';
    }

    return 'default';
  }

  timelineTypeBadgeLabel(type: string): string {
    const normalized = type.trim().toLowerCase();
    if (normalized === 'portal-message') {
      return 'Portal Message';
    }
    if (normalized === 'note') {
      return 'Internal Note';
    }
    if (normalized === 'system') {
      return 'System';
    }
    if (normalized === 'email') {
      return 'Email';
    }

    return type;
  }

  timelineTypeBadgeIcon(type: string): string {
    const normalized = type.trim().toLowerCase();
    if (normalized === 'portal-message') {
      return 'PM';
    }
    if (normalized === 'note') {
      return 'IN';
    }
    if (normalized === 'system') {
      return 'SY';
    }
    if (normalized === 'email') {
      return 'EM';
    }

    return 'CM';
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

  private loadTemplates(): void {
    if (!this.venueId) {
      return;
    }

    this.templatesLoading = true;
    this.templateError = '';

    this.api
      .getConnectTemplates(this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (templates) => {
          this.templatesLoading = false;
          this.emailTemplates = templates.map((template) => ({
            ...template,
            category: template.category || 'Custom'
          }));
        },
        error: () => {
          this.templatesLoading = false;
          this.emailTemplates = [];
          this.templateError = 'Unable to load templates.';
        }
      });
  }

  private loadSelectedEnquiry(): void {
    if (!this.selectedEnquiryId) {
      this.selectedEnquiry = null;
      return;
    }

    this.api
      .getEnquiry(this.selectedEnquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (enquiry) => {
          this.selectedEnquiry = enquiry;
          if (!this.emailTo.trim()) {
            this.emailTo = enquiry.contactEmail ?? '';
          }
        },
        error: () => {
          this.selectedEnquiry = null;
        }
      });
  }

  private async addAttachments(files: File[]): Promise<void> {
    if (!this.canAttachFiles) {
      return;
    }

    const next: ComposeAttachment[] = [];
    const errors: string[] = [];
    let runningTotal = this.attachmentTotalBytes;

    for (const file of files) {
      const extension = this.fileExtension(file.name);
      if (!extension || !ALLOWED_ATTACHMENT_EXTENSIONS.has(extension)) {
        errors.push(`${file.name}: unsupported file type.`);
        continue;
      }

      if (file.size <= 0 || file.size > MAX_ATTACHMENT_BYTES) {
        errors.push(`${file.name}: exceeds 10MB limit.`);
        continue;
      }

      if (file.type && !ALLOWED_ATTACHMENT_MIME_TYPES.has(file.type.toLowerCase())) {
        errors.push(`${file.name}: unsupported MIME type.`);
        continue;
      }

      if (runningTotal + file.size > MAX_TOTAL_ATTACHMENT_BYTES) {
        errors.push(`${file.name}: total attachments cannot exceed 25MB.`);
        continue;
      }

      try
      {
        const contentBase64 = await this.readFileAsBase64(file);
        runningTotal += file.size;
        next.push({
          id: this.generateClientId(),
          fileName: file.name,
          sizeBytes: file.size,
          mimeType: file.type || this.inferMimeType(extension),
          contentBase64
        });
      }
      catch
      {
        errors.push(`${file.name}: failed to read file.`);
      }
    }

    if (next.length > 0) {
      this.attachments = [...this.attachments, ...next];
    }

    this.attachmentError = errors[0] ?? '';
  }

  private applyMergeFields(input: string): string {
    const mergeFields = this.buildMergeFields();
    let output = input ?? '';

    for (const [key, value] of Object.entries(mergeFields)) {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      output = output.replace(new RegExp(`{{\\s*${escapedKey}\\s*}}`, 'gi'), value);
      output = output.replace(new RegExp(`{\\s*${escapedKey}\\s*}`, 'gi'), value);
    }

    return output;
  }

  private buildMergeFields(): Record<string, string> {
    const enquiry = this.selectedEnquiry;
    const venueName = this.resolveVenueName();
    const eventName = enquiry?.eventName || enquiry?.eventType || 'your event';
    const eventDate = enquiry?.eventStartUtc ? this.formatDate(enquiry.eventStartUtc) : '';
    const contactName = enquiry ? `${enquiry.contactFirstName} ${enquiry.contactLastName}`.trim() : '';
    const contactFirstName = enquiry?.contactFirstName || '';
    const managerName = enquiry?.eventManagerName || this.auth.session?.fullName || '';
    const enquiryRef = enquiry?.reference || '';
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    const proposalLink = enquiry ? `${origin}/enquiries?enquiry=${enquiry.id}&tab=proposals` : '';
    const paymentLink = enquiry ? `${origin}/payments?enquiry=${enquiry.id}` : '';
    const portalLink = origin ? `${origin}/portal` : '';
    const totalValueAmount = enquiry?.budgetMaxAmount ?? enquiry?.budgetMinAmount ?? 0;
    const depositAmount = totalValueAmount * 0.2;
    const holdExpiryDate = enquiry?.holdExpiresAtUtc ? this.formatDate(enquiry.holdExpiresAtUtc) : '';
    const guestCount = enquiry?.guestsExpected ? String(enquiry.guestsExpected) : '';

    return {
      contact_name: contactName,
      client_name: contactName,
      client_first_name: contactFirstName,
      event_name: eventName,
      event_date: eventDate,
      venue_name: venueName,
      manager_name: managerName,
      operator_name: managerName,
      enquiry_ref: enquiryRef,
      proposal_link: proposalLink,
      payment_link: paymentLink,
      portal_link: portalLink,
      total_value: this.formatCurrency(totalValueAmount),
      deposit_amount: this.formatCurrency(depositAmount),
      hold_expiry_date: holdExpiryDate,
      guest_count: guestCount
    };
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 2
    }).format(Number.isFinite(amount) ? amount : 0);
  }

  private hasEmailBodyContent(value: string): boolean {
    if (!value) {
      return false;
    }

    const plain = value
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return plain.length > 0;
  }

  private resolveVenueName(): string {
    const session = this.auth.session;
    if (!session || !this.venueId) {
      return '';
    }

    return session.venueRoles.find((role) => role.venueId === this.venueId)?.venueName ?? '';
  }

  private formatDate(value: string): string {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(parsed);
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        const marker = 'base64,';
        const markerIndex = result.indexOf(marker);
        if (markerIndex < 0) {
          reject(new Error('Unable to parse base64 payload.'));
          return;
        }

        resolve(result.slice(markerIndex + marker.length));
      };
      reader.onerror = () => reject(reader.error ?? new Error('Unable to read file.'));
      reader.readAsDataURL(file);
    });
  }

  private fileExtension(fileName: string): string {
    const normalized = (fileName || '').toLowerCase().trim();
    const lastDot = normalized.lastIndexOf('.');
    if (lastDot < 0 || lastDot === normalized.length - 1) {
      return '';
    }

    return normalized.slice(lastDot + 1);
  }

  private inferMimeType(extension: string): string {
    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'csv':
        return 'text/csv';
      default:
        return 'application/octet-stream';
    }
  }

  private generateClientId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  }

  private handleVenueChange(venueId: string | null): void {
    this.venueId = venueId;
    this.resetVenueScopedState();

    if (!this.venueId) {
      return;
    }

    this.loadTimeline();
    this.loadTemplates();
    this.loadUnmatchedInbox();
    this.loadChannels();
  }

  private resetVenueScopedState(): void {
    this.timeline = [];
    this.unmatchedInbox = [];
    this.channels = [];
    this.chatMessages = [];
    this.selectedChannelId = null;
    this.selectedEnquiryId = '';
    this.selectedEnquiry = null;
    this.unmatchedEmailCount = 0;
    this.unreadMentionCount = 0;
    this.noteDraft = '';
    this.attachments = [];
    this.emailCc = '';
    this.emailBcc = '';
    this.showEmailCopyFields = false;
    this.attachmentError = '';
    this.composeError = '';
    this.composeSuccess = '';
    this.showTemplatePicker = false;
  }
}
