import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiaryEventDto, PaymentScheduleResponse } from '../../../../services/api.service';

@Component({
  selector: 'app-diary-event-popover',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './diary-event-popover.component.html',
  styleUrl: './diary-event-popover.component.scss'
})
export class DiaryEventPopoverComponent {
  @Input({ required: true }) event!: DiaryEventDto;
  @Input() headline?: string;
  @Input() expanded = false;
  @Input() paymentSchedule: PaymentScheduleResponse | null = null;
  @Input() paymentScheduleLoading = false;
  @Input() paymentScheduleError = '';
  @Output() viewDetails = new EventEmitter<void>();
  @Output() toggleExpanded = new EventEmitter<void>();

  get title(): string {
    if (this.headline && this.headline.trim().length > 0) {
      return this.headline.trim();
    }

    return this.event.label;
  }

  get statusLabel(): string {
    return this.event.statusKey || this.event.enquiryStatus || this.event.eventType;
  }

  get statusClass(): string {
    const key = (this.event.visualType || '').toLowerCase();
    return key ? `status-${key}` : 'status-default';
  }

  get showHoldCountdown(): boolean {
    const visualType = (this.event.visualType || '').toLowerCase();
    return visualType === 'provisional' || !!this.event.holdExpiresAtUtc;
  }

  get holdCountdownLabel(): string {
    const parsed = this.event.holdExpiresAtUtc ? new Date(this.event.holdExpiresAtUtc) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) {
      return 'No hold expiry';
    }

    const remainingMs = parsed.getTime() - Date.now();
    if (remainingMs <= 0) {
      return 'Expired';
    }

    const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    return `${remainingDays} day${remainingDays === 1 ? '' : 's'} remaining`;
  }

  get planningPercent(): number {
    return this.paymentSchedule?.planningProgress?.percent ?? 0;
  }

  get paymentPercent(): number {
    return this.paymentSchedule?.paymentProgress?.percent ?? 0;
  }

  get paidAmount(): number {
    return this.paymentSchedule?.paymentProgress?.paidAmount ?? 0;
  }

  get totalAmount(): number {
    return this.paymentSchedule?.paymentProgress?.totalAmount ?? 0;
  }

  onToggleDetails(mouseEvent: MouseEvent): void {
    mouseEvent.stopPropagation();
    this.toggleExpanded.emit();
  }

  onViewDetails(mouseEvent: MouseEvent): void {
    mouseEvent.stopPropagation();
    this.viewDetails.emit();
  }
}
