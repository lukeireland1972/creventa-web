import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiaryEventDto } from '../../../../services/api.service';

@Component({
  selector: 'app-diary-event-popover',
  imports: [DatePipe],
  templateUrl: './diary-event-popover.component.html',
  styleUrl: './diary-event-popover.component.scss'
})
export class DiaryEventPopoverComponent {
  @Input({ required: true }) event!: DiaryEventDto;
  @Input() headline?: string;
  @Input() expanded = false;
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

  onToggleDetails(mouseEvent: MouseEvent): void {
    mouseEvent.stopPropagation();
    this.toggleExpanded.emit();
  }

  onViewDetails(mouseEvent: MouseEvent): void {
    mouseEvent.stopPropagation();
    this.viewDetails.emit();
  }
}
