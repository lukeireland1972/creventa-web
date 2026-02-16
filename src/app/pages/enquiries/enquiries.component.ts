import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import {
  ApiService,
  BulkActionResultResponse,
  EnquiryDetailResponse,
  EnquiryListItemDto,
  EnquiryListResponse,
  ProposalListItemDto,
  UserSummaryDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface StatusTab {
  key: string;
  label: string;
}

interface BulkEmailRecipient {
  enquiryId: string;
  reference: string;
  name: string;
  email: string;
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
  sourceFilter = '';

  selectedEnquiryId: string | null = null;
  selectedEnquiry: EnquiryDetailResponse | null = null;
  detailTab: 'overview' | 'events' | 'appointments' | 'proposals' | 'documents' | 'activity' = 'overview';
  enquiryProposals: ProposalListItemDto[] = [];
  enquiryProposalsLoading = false;
  selectedEnquiryIds = new Set<string>();
  assignableUsers: UserSummaryDto[] = [];
  loadingAssignableUsers = false;
  bulkActionBusy = false;
  bulkActionFeedback = '';
  pendingBulkAssignValue = '';
  pendingBulkStatusValue = '';
  showLostReasonModal = false;
  bulkLostReason = '';
  bulkLostReasonDetail = '';
  showBulkEmailModal = false;
  bulkEmailRecipients: BulkEmailRecipient[] = [];
  loadingBulkEmailRecipients = false;
  sendingBulkEmail = false;
  bulkEmailSubject = '';
  bulkEmailBody = '';
  private loadedAssignableUsersVenueId: string | null = null;
  private readonly pageSizeOptions = new Set([10, 25, 50, 100]);
  private readonly lostReasonChoices = [
    'Price / Budget',
    'Date unavailable',
    'Chose another venue',
    'No response',
    'Event cancelled',
    'Requirements mismatch',
    'Other'
  ];

  filtersForm = this.formBuilder.group({
    search: [''],
    quickFilter: [''],
    pageSize: [25]
  });

  get venueId(): string | null {
    return this.auth.selectedVenueId;
  }

  get selectedCount(): number {
    return this.selectedEnquiryIds.size;
  }

  get allVisibleSelected(): boolean {
    return this.enquiries.length > 0 && this.enquiries.every((enquiry) => this.selectedEnquiryIds.has(enquiry.id));
  }

  get partiallyVisibleSelected(): boolean {
    if (this.enquiries.length === 0) {
      return false;
    }

    const selectedVisible = this.enquiries.filter((enquiry) => this.selectedEnquiryIds.has(enquiry.id)).length;
    return selectedVisible > 0 && selectedVisible < this.enquiries.length;
  }

  get bulkStatusOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'New', label: 'New' },
      { value: 'Tentative', label: 'Tentative' },
      { value: 'OpenProposal', label: 'Open Proposal' },
      { value: 'Provisional', label: 'Provisional' },
      { value: 'Confirmed', label: 'Confirmed' },
      { value: 'Completed', label: 'Completed' },
      { value: 'Lost', label: 'Lost' },
      { value: 'Archived', label: 'Archived' }
    ];
  }

  get lostReasonOptions(): string[] {
    return this.lostReasonChoices;
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const previousSelectedEnquiryId = this.selectedEnquiryId;
      const enquiryId = params.get('enquiry');
      const requestedStatusTab = params.get('statusTab');
      const requestedSearch = params.get('search') ?? '';
      const requestedQuickFilter = params.get('quickFilter') ?? '';
      const requestedSource = params.get('source') ?? '';
      const requestedPageSize = this.parsePageSize(params.get('pageSize'));
      let shouldReloadList = false;
      const previousTab = this.activeTab;

      if (requestedStatusTab && this.isValidStatusTab(requestedStatusTab) && requestedStatusTab !== this.activeTab) {
        this.activeTab = requestedStatusTab;
        this.clearBulkSelection();
        shouldReloadList = true;
      }

      if (!requestedStatusTab && this.activeTab !== 'new-unanswered') {
        this.activeTab = 'new-unanswered';
        this.clearBulkSelection();
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

      if (this.sourceFilter !== requestedSource) {
        this.sourceFilter = requestedSource;
        shouldReloadList = true;
      }

      this.selectedEnquiryId = enquiryId;

      if (previousTab !== this.activeTab) {
        this.bulkActionFeedback = '';
      }

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
          source: this.sourceFilter || null,
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

    this.clearBulkSelection();
    this.bulkActionFeedback = '';

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

    this.ensureAssignableUsersLoaded(venueId);
    this.loading = true;
    const filters = this.filtersForm.getRawValue();

    this.api
      .getEnquiries({
        venueId,
        statusTab: this.activeTab,
        period: 'this-month',
        quickFilter: filters.quickFilter || undefined,
        search: filters.search || undefined,
        source: this.sourceFilter || undefined,
        page,
        pageSize: Number(filters.pageSize) || 25
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.listResponse = response;
          this.enquiries = response.page.items;
          this.syncBulkSelectionToVisibleRows();

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

  isEnquirySelected(enquiryId: string): boolean {
    return this.selectedEnquiryIds.has(enquiryId);
  }

  toggleSelectAll(checked: boolean): void {
    if (!checked) {
      this.clearBulkSelection();
      return;
    }

    this.selectedEnquiryIds = new Set(this.enquiries.map((enquiry) => enquiry.id));
  }

  toggleEnquirySelection(enquiryId: string, checked: boolean): void {
    const next = new Set(this.selectedEnquiryIds);
    if (checked) {
      next.add(enquiryId);
    } else {
      next.delete(enquiryId);
    }

    this.selectedEnquiryIds = next;
  }

  clearBulkSelection(): void {
    this.selectedEnquiryIds = new Set<string>();
    this.pendingBulkAssignValue = '';
    this.pendingBulkStatusValue = '';
  }

  applyBulkAssign(targetValue: string): void {
    this.pendingBulkAssignValue = targetValue;
    if (!targetValue || this.selectedCount === 0 || this.bulkActionBusy) {
      return;
    }

    const eventManagerUserId = targetValue === 'unassigned' ? null : targetValue;
    this.bulkActionBusy = true;
    this.bulkActionFeedback = '';

    this.api
      .bulkAssignEnquiries({
        enquiryIds: Array.from(this.selectedEnquiryIds),
        eventManagerUserId
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.pendingBulkAssignValue = '';
          this.handleBulkActionResult('assigned', result);
        },
        error: (error) => {
          this.bulkActionBusy = false;
          this.pendingBulkAssignValue = '';
          this.bulkActionFeedback =
            typeof error?.error?.error === 'string' ? error.error.error : 'Bulk assignment failed. Please try again.';
        }
      });
  }

  applyBulkStatus(targetStatus: string): void {
    this.pendingBulkStatusValue = targetStatus;
    if (!targetStatus || this.selectedCount === 0 || this.bulkActionBusy) {
      return;
    }

    if (targetStatus === 'Lost') {
      this.bulkLostReason = '';
      this.bulkLostReasonDetail = '';
      this.showLostReasonModal = true;
      return;
    }

    this.executeBulkStatusTransition(targetStatus);
  }

  cancelLostReasonModal(): void {
    this.showLostReasonModal = false;
    this.pendingBulkStatusValue = '';
    this.bulkLostReason = '';
    this.bulkLostReasonDetail = '';
  }

  confirmLostStatusTransition(): void {
    if (!this.bulkLostReason.trim()) {
      this.bulkActionFeedback = 'Lost reason is required for bulk Lost transitions.';
      return;
    }

    this.showLostReasonModal = false;
    this.executeBulkStatusTransition('Lost', this.bulkLostReason.trim(), this.bulkLostReasonDetail.trim() || undefined);
  }

  openBulkEmailComposer(): void {
    if (this.selectedCount === 0 || this.loadingBulkEmailRecipients) {
      return;
    }

    const selectedIds = Array.from(this.selectedEnquiryIds);
    this.loadingBulkEmailRecipients = true;
    this.bulkActionFeedback = '';

    forkJoin(selectedIds.map((enquiryId) => this.api.getEnquiry(enquiryId)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (details) => {
          this.loadingBulkEmailRecipients = false;
          this.bulkEmailRecipients = details
            .map((detail) => ({
              enquiryId: detail.id,
              reference: detail.reference,
              name: `${detail.contactFirstName} ${detail.contactLastName}`.trim(),
              email: detail.contactEmail
            }))
            .filter((recipient) => !!recipient.email);

          this.bulkEmailSubject = '';
          this.bulkEmailBody = '';
          this.showBulkEmailModal = this.bulkEmailRecipients.length > 0;

          if (this.bulkEmailRecipients.length === 0) {
            this.bulkActionFeedback = 'Selected enquiries do not have contact emails.';
          }
        },
        error: () => {
          this.loadingBulkEmailRecipients = false;
          this.bulkActionFeedback = 'Unable to prepare email recipients for selected enquiries.';
        }
      });
  }

  closeBulkEmailModal(): void {
    this.showBulkEmailModal = false;
    this.bulkEmailRecipients = [];
    this.bulkEmailSubject = '';
    this.bulkEmailBody = '';
  }

  sendBulkEmail(): void {
    if (!this.venueId || this.sendingBulkEmail) {
      return;
    }

    const subject = this.bulkEmailSubject.trim();
    const body = this.bulkEmailBody.trim();
    if (!subject || !body) {
      this.bulkActionFeedback = 'Email subject and body are required.';
      return;
    }

    const requests = this.bulkEmailRecipients.map((recipient) =>
      this.api.sendConnectEmail(recipient.enquiryId, {
        venueId: this.venueId!,
        to: recipient.email,
        subject,
        body
      })
    );

    if (requests.length === 0) {
      this.bulkActionFeedback = 'No valid recipients available.';
      return;
    }

    this.sendingBulkEmail = true;
    forkJoin(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.sendingBulkEmail = false;
          this.closeBulkEmailModal();
          this.bulkActionFeedback = `Email sent to ${requests.length} selected contact${requests.length === 1 ? '' : 's'}.`;
        },
        error: () => {
          this.sendingBulkEmail = false;
          this.bulkActionFeedback = 'Bulk email send failed. Please try again.';
        }
      });
  }

  exportSelected(): void {
    const selectedRows = this.enquiries.filter((enquiry) => this.selectedEnquiryIds.has(enquiry.id));
    if (selectedRows.length === 0) {
      return;
    }

    const headers = [
      'Reference',
      'Contact',
      'Event Type',
      'Event Style',
      'Event Date',
      'Guests',
      'Status',
      'Value',
      'Currency',
      'Owner',
      'Source',
      'Last Activity'
    ];

    const rows = selectedRows.map((enquiry) => [
      enquiry.reference,
      enquiry.contactName,
      enquiry.eventType,
      enquiry.eventStyle ?? '',
      new Date(enquiry.eventStartUtc).toISOString(),
      String(enquiry.guestsExpected),
      enquiry.status,
      enquiry.proposalValue?.toString() ?? '',
      enquiry.currencyCode,
      enquiry.eventManagerName ?? 'Unassigned',
      enquiry.sourceType,
      new Date(enquiry.lastActivityAtUtc).toISOString()
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => this.escapeCsv(cell)).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.href = url;
    link.download = `creventa-enquiries-selected-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  private executeBulkStatusTransition(targetStatus: string, lostReason?: string, lostReasonDetail?: string): void {
    this.bulkActionBusy = true;
    this.bulkActionFeedback = '';

    this.api
      .bulkTransitionEnquiries({
        enquiryIds: Array.from(this.selectedEnquiryIds),
        targetStatus,
        lostReason,
        lostReasonDetail
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.pendingBulkStatusValue = '';
          this.bulkLostReason = '';
          this.bulkLostReasonDetail = '';
          this.handleBulkActionResult(`moved to ${targetStatus}`, result);
        },
        error: (error) => {
          this.bulkActionBusy = false;
          this.pendingBulkStatusValue = '';
          this.bulkActionFeedback =
            typeof error?.error?.error === 'string' ? error.error.error : 'Bulk status change failed. Please try again.';
        }
      });
  }

  private handleBulkActionResult(actionLabel: string, result: BulkActionResultResponse): void {
    this.bulkActionBusy = false;
    const failed = result.failed.length;
    if (failed === 0) {
      this.bulkActionFeedback = `${result.succeeded} enquir${result.succeeded === 1 ? 'y' : 'ies'} ${actionLabel}.`;
    } else {
      this.bulkActionFeedback = `${result.succeeded}/${result.requested} enquir${result.requested === 1 ? 'y' : 'ies'} ${actionLabel}. ${failed} failed.`;
    }

    this.clearBulkSelection();
    this.loadEnquiries(this.listResponse?.page.page ?? 1);
    if (this.selectedEnquiryId) {
      this.loadEnquiryDetail(this.selectedEnquiryId);
    }
  }

  private ensureAssignableUsersLoaded(venueId: string): void {
    if (this.loadedAssignableUsersVenueId === venueId || this.loadingAssignableUsers) {
      return;
    }

    this.loadingAssignableUsers = true;
    this.api
      .getUsers(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.loadingAssignableUsers = false;
          this.loadedAssignableUsersVenueId = venueId;
          this.assignableUsers = users
            .filter((user) => user.isActive)
            .sort((left, right) =>
              `${left.firstName} ${left.lastName}`.localeCompare(`${right.firstName} ${right.lastName}`, undefined, {
                sensitivity: 'base'
              })
            );
        },
        error: () => {
          this.loadingAssignableUsers = false;
          this.assignableUsers = [];
        }
      });
  }

  private syncBulkSelectionToVisibleRows(): void {
    if (this.selectedEnquiryIds.size === 0) {
      return;
    }

    const visibleIds = new Set(this.enquiries.map((enquiry) => enquiry.id));
    this.selectedEnquiryIds = new Set(Array.from(this.selectedEnquiryIds).filter((id) => visibleIds.has(id)));
  }

  private escapeCsv(value: string): string {
    const stringValue = `${value ?? ''}`;
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }
}
