import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, OperationsDayColumnDto } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-operations-dashboard',
    imports: [DatePipe],
    templateUrl: './operations-dashboard.component.html',
    styleUrl: './operations-dashboard.component.scss'
})
export class OperationsDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  columns: OperationsDayColumnDto[] = [];

  ngOnInit(): void {
    const venueId = this.auth.selectedVenueId;
    if (!venueId) {
      return;
    }

    this.api
      .getOperationsOverview(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.columns = response.columns;
      });
  }
}
