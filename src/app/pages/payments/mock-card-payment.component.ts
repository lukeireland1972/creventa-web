import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mock-card-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mock-card-payment.component.html',
  styleUrl: './mock-card-payment.component.scss'
})
export class MockCardPaymentComponent implements OnInit {
  private route = inject(ActivatedRoute);

  milestoneId = '';
  providerReference = '';
  amount = 0;
  currency = 'GBP';
  returnUrl = '';
  cancelUrl = '';

  cardholderName = '';
  cardNumber = '';
  expiry = '';
  cvc = '';
  processing = false;
  completed = false;
  cancelled = false;

  ngOnInit(): void {
    this.milestoneId = this.route.snapshot.paramMap.get('milestoneId') ?? '';
    this.providerReference = this.route.snapshot.queryParamMap.get('reference') ?? '';
    this.amount = Number(this.route.snapshot.queryParamMap.get('amount') ?? 0);
    this.currency = this.route.snapshot.queryParamMap.get('currency') ?? 'GBP';
    this.returnUrl = this.route.snapshot.queryParamMap.get('return') ?? '';
    this.cancelUrl = this.route.snapshot.queryParamMap.get('cancel') ?? '';
  }

  submitPayment(): void {
    if (this.processing || this.completed) {
      return;
    }

    this.processing = true;
    window.setTimeout(() => {
      this.processing = false;
      this.completed = true;

      if (this.returnUrl) {
        const target = this.appendResultQuery(this.returnUrl, 'success');
        window.location.assign(target);
      }
    }, 800);
  }

  cancelPayment(): void {
    this.cancelled = true;
    if (this.cancelUrl) {
      const target = this.appendResultQuery(this.cancelUrl, 'cancelled');
      window.location.assign(target);
      return;
    }

    window.history.back();
  }

  private appendResultQuery(targetUrl: string, status: 'success' | 'cancelled'): string {
    try {
      const parsed = new URL(targetUrl);
      parsed.searchParams.set('payment', status);
      if (this.providerReference) {
        parsed.searchParams.set('providerReference', this.providerReference);
      }
      if (this.milestoneId) {
        parsed.searchParams.set('milestone', this.milestoneId);
      }

      return parsed.toString();
    } catch {
      const separator = targetUrl.includes('?') ? '&' : '?';
      return `${targetUrl}${separator}payment=${status}`;
    }
  }
}
