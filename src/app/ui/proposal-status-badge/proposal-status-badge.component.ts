import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-proposal-status-badge',
  standalone: true,
  template: `<span class="status-badge" [attr.data-status]="statusToken">{{ statusLabel }}</span>`,
  styleUrl: './proposal-status-badge.component.scss'
})
export class ProposalStatusBadgeComponent {
  @Input() status: string | null | undefined;

  get statusLabel(): string {
    return (this.status ?? 'Unknown').trim() || 'Unknown';
  }

  get statusToken(): string {
    return this.statusLabel
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
  }
}
