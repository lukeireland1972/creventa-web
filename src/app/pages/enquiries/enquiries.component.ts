import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, EnquiryDetailResponse, EnquiryListItemDto, EnquiryListResponse, ProposalListItemDto } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface StatusTab {
  key: string;
  label: string;
}

@Component({
    selector: 'app-enquiries',
    imports: [DatePipe, DecimalPipe, ReactiveFormsModule],
    templateUrl: './enquiries.component.html',
    styleUrl: './enquiries.component.scss'
})
export class EnquiriesComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = new FormBuilder();

  statusTabs: StatusTab[] = [
    { key: 'new-unanswered', label: 'New / Unanswered' },
    { key: 'proposals', label: 'Proposals' },
    { key: 'provisional', label: 'Provisional' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'lost', label: 'Lost' },
    { key: 'all', label: 'All' }
  ];

  quickFilters = [
    { value: '', label: 'No quick filter' },
    { value: 'my-enquiries', label: 'My Enquiries' },
    { value: 'unassigned', label: 'Unassigned' },
    { value: 'overdue-follow-up', label: 'Overdue Follow-up' },
    { value: 'expiring-holds', label: 'Expiring Holds' }
  ];

  activeTab = 'new-unanswered';
  listResponse: EnquiryListResponse | null = null;
  enquiries: EnquiryListItemDto[] = [];
  loading = false;

  selectedEnquiryId: string | null = null;
  selectedEnquiry: EnquiryDetailResponse | null = null;
  detailTab: 'overview' | 'events' | 'appointments' | 'proposals' | 'documents' | 'activity' = 'overview';
  enquiryProposals: ProposalListItemDto[] = [];
  enquiryProposalsLoading = false;
  private readonly pageSizeOptions = new Set([10, 25, 50, 100]);

  filtersForm = this.formBuilder.group({
    search: [''],
    quickFilter: [''],
    pageSize: [25]
  });

  get venueId(): string | null {
    return this.auth.selectedVenueId;
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const previousSelectedEnquiryId = this.selectedEnquiryId;
      const enquiryId = params.get('enquiry');
      const requestedStatusTab = params.get('statusTab');
      const requestedSearch = params.get('search') ?? '';
      const requestedQuickFilter = params.get('quickFilter') ?? '';
      const requestedPageSize = this.parsePageSize(params.get('pageSize'));
      let shouldReloadList = false;

      if (requestedStatusTab && this.isValidStatusTab(requestedStatusTab) && requestedStatusTab !== this.activeTab) {
        this.activeTab = requestedStatusTab;
        shouldReloadList = true;
      }

      if (!requestedStatusTab && this.activeTab !== 'new-unanswered') {
        this.activeTab = 'new-unanswered';
        shouldReloadList = true;
      }

      const currentFilters = this.filtersForm.getRawValue();
      const currentPageSize = this.parsePageSize(String(currentFilters.pageSize ?? 25));
      if (
        (currentFilters.search ?? '') !== requestedSearch ||
        (currentFilters.quickFilter ?? '') !== requestedQuickFilter ||
        currentPageSize !== requestedPageSize
      ) {
        this.filtersForm.patchValue(
          {
            search: requestedSearch,
            quickFilter: requestedQuickFilter,
            pageSize: requestedPageSize
          },
          { emitEvent: false }
        );
        shouldReloadList = true;
      }

      this.selectedEnquiryId = enquiryId;

      if (shouldReloadList || !this.listResponse) {
        this.loadEnquiries(1);
        return;
      }

      if (enquiryId && enquiryId !== previousSelectedEnquiryId) {
        this.loadEnquiryDetail(enquiryId);
      }
    });

    this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const filters = this.filtersForm.getRawValue();
      const trimmedSearch = (filters.search ?? '').trim();
      const quickFilter = filters.quickFilter ?? '';
      const pageSize = this.parsePageSize(String(filters.pageSize ?? 25));

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          search: trimmedSearch || null,
          quickFilter: quickFilter || null,
          pageSize: pageSize === 25 ? null : pageSize
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
      this.loadEnquiries(1);
    });
  }

  setTab(tabKey: string): void {
    if (!this.isValidStatusTab(tabKey) || this.activeTab === tabKey) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { statusTab: tabKey },
      queryParamsHandling: 'merge'
    });
  }

  loadEnquiries(page: number): void {
    const venueId = this.venueId;
    if (!venueId) {
      return;
    }

    this.loading = true;
    const filters = this.filtersForm.getRawValue();

    this.api
      .getEnquiries({
        venueId,
        statusTab: this.activeTab,
        period: 'this-month',
        quickFilter: filters.quickFilter || undefined,
        search: filters.search || undefined,
        page,
        pageSize: Number(filters.pageSize) || 25
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.listResponse = response;
          this.enquiries = response.page.items;

          if (!this.selectedEnquiryId && this.enquiries.length > 0) {
            this.selectEnquiry(this.enquiries[0].id);
          }

          if (this.selectedEnquiryId) {
            this.loadEnquiryDetail(this.selectedEnquiryId);
          }
        },
        error: () => {
          this.loading = false;
          this.enquiries = [];
          this.selectedEnquiry = null;
        }
      });
  }

  selectEnquiry(enquiryId: string): void {
    this.selectedEnquiryId = enquiryId;
    this.enquiryProposals = [];
    this.enquiryProposalsLoading = false;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { enquiry: enquiryId },
      queryParamsHandling: 'merge'
    });
    this.loadEnquiryDetail(enquiryId);
  }

  changeDetailTab(tab: 'overview' | 'events' | 'appointments' | 'proposals' | 'documents' | 'activity'): void {
    this.detailTab = tab;
    if (tab === 'proposals' && this.selectedEnquiryId) {
      this.loadEnquiryProposals(this.selectedEnquiryId);
    }
  }

  changeStatus(targetStatus: string): void {
    if (!this.selectedEnquiryId) {
      return;
    }

    this.api
      .transitionEnquiryStatus(this.selectedEnquiryId, { targetStatus })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadEnquiryDetail(this.selectedEnquiryId!);
          this.loadEnquiries(this.listResponse?.page.page ?? 1);
        }
      });
  }

  statusToken(status: string | null | undefined): string {
    const normalized = (status ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    if (normalized === 'openproposal') {
      return 'open-proposal';
    }

    return normalized;
  }

  private isValidStatusTab(tabKey: string): boolean {
    return this.statusTabs.some((tab) => tab.key === tabKey);
  }

  private parsePageSize(raw: string | null): number {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      return 25;
    }

    return this.pageSizeOptions.has(parsed) ? parsed : 25;
  }

  private loadEnquiryDetail(enquiryId: string): void {
    this.api
      .getEnquiry(enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (enquiry) => {
          this.selectedEnquiry = enquiry;
          this.loadEnquiryProposals(enquiryId);
        },
        error: () => {
          this.selectedEnquiry = null;
          this.enquiryProposals = [];
          this.enquiryProposalsLoading = false;
        }
      });
  }

  createProposalForSelectedEnquiry(): void {
    if (!this.selectedEnquiryId) {
      return;
    }

    this.router.navigate(['/proposals'], {
      queryParams: {
        enquiry: this.selectedEnquiryId,
        create: 1
      }
    });
  }

  openProposalInMaker(proposalId: string): void {
    this.router.navigate(['/proposals'], {
      queryParams: {
        proposal: proposalId
      }
    });
  }

  private loadEnquiryProposals(enquiryId: string): void {
    this.enquiryProposalsLoading = true;

    this.api
      .getEnquiryProposals(enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (proposals) => {
          this.enquiryProposalsLoading = false;
          this.enquiryProposals = proposals;
        },
        error: () => {
          this.enquiryProposalsLoading = false;
          this.enquiryProposals = [];
        }
      });
  }
}
