import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, GlobalSearchResultDto } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { forkJoin } from 'rxjs';

interface SearchTypeOption {
  key: string;
  label: string;
  apiValue: string;
}

type SearchTabKey = 'all' | 'enquiries' | 'contacts' | 'events' | 'proposals';
type SearchSortMode = 'relevance' | 'date';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly typeOptions: SearchTypeOption[] = [
    { key: 'Enquiries', label: 'Enquiries', apiValue: 'enquiries' },
    { key: 'Contacts', label: 'Contacts', apiValue: 'contacts' },
    { key: 'Events', label: 'Events', apiValue: 'events' },
    { key: 'Proposals', label: 'Proposals', apiValue: 'proposals' }
  ];
  readonly statusOptions = ['Any', 'New', 'Tentative', 'Open Proposal', 'Provisional', 'Confirmed', 'Completed', 'Lost', 'Archived'];
  readonly pageSizeOptions = [10, 25, 50, 100];

  venueId: string | null = null;
  query = '';
  activeTab: SearchTabKey = 'all';
  page = 1;
  pageSize = 25;
  total = 0;
  loading = false;
  errorMessage = '';
  intentLabel = '';
  results: GlobalSearchResultDto[] = [];
  sortMode: SearchSortMode = 'relevance';
  statusFilter = 'Any';
  dateFrom = '';
  dateTo = '';
  tabCounts: Record<SearchTabKey, number> = {
    all: 0,
    enquiries: 0,
    contacts: 0,
    events: 0,
    proposals: 0
  };

  get totalPages(): number {
    const pages = Math.ceil(this.total / this.pageSize);
    return Math.max(1, pages);
  }

  get resultCountLabel(): string {
    if (this.total === 0) {
      return 'No results';
    }

    if (this.total === 1) {
      return '1 result';
    }

    return `${this.total} results`;
  }

  get groupedResults(): Array<{ type: string; results: GlobalSearchResultDto[] }> {
    if (this.filteredSortedResults.length === 0) {
      return [];
    }

    const order = new Map(this.typeOptions.map((option, index) => [option.key, index]));
    const grouped = new Map<string, GlobalSearchResultDto[]>();
    for (const result of this.filteredSortedResults) {
      const key = result.type || 'Other';
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(result);
    }

    return Array.from(grouped.entries())
      .sort((left, right) => (order.get(left[0]) ?? 999) - (order.get(right[0]) ?? 999))
      .map(([type, entries]) => ({ type, results: entries }));
  }

  ngOnInit(): void {
    this.auth.session$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((session) => {
        this.venueId = session?.venueId ?? null;
      });

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.query = (params.get('q') ?? '').trim();
        this.page = this.parsePositiveInteger(params.get('page'), 1);
        this.pageSize = this.parsePositiveInteger(params.get('pageSize'), 25);
        const tabValue = (params.get('tab') ?? 'all').trim().toLowerCase();
        this.activeTab = this.normalizeTab(tabValue);
        const sortValue = (params.get('sort') ?? 'relevance').trim().toLowerCase();
        this.sortMode = sortValue === 'date' ? 'date' : 'relevance';
        this.statusFilter = this.statusOptions.find((value) => value.toLowerCase() === (params.get('status') ?? '').trim().toLowerCase()) ?? 'Any';
        this.dateFrom = (params.get('from') ?? '').trim();
        this.dateTo = (params.get('to') ?? '').trim();
        if (!this.pageSizeOptions.includes(this.pageSize)) {
          this.pageSize = 25;
        }

        this.loadResults();
      });
  }

  submitSearch(event: Event): void {
    event.preventDefault();
    this.page = 1;
    this.syncQueryParams();
  }

  selectTab(tab: SearchTabKey): void {
    if (this.activeTab === tab) {
      return;
    }
    this.activeTab = tab;
    this.page = 1;
    this.syncQueryParams();
  }

  applySearchFilters(): void {
    this.page = 1;
    this.syncQueryParams();
  }

  updatePageSize(value: number): void {
    this.pageSize = value;
    this.page = 1;
    this.syncQueryParams();
  }

  previousPage(): void {
    if (this.page <= 1) {
      return;
    }

    this.page -= 1;
    this.syncQueryParams();
  }

  nextPage(): void {
    if (this.page >= this.totalPages) {
      return;
    }

    this.page += 1;
    this.syncQueryParams();
  }

  openResult(result: GlobalSearchResultDto): void {
    this.router.navigateByUrl(result.route);
  }

  highlightText(value: string | null | undefined): string {
    const source = `${value ?? ''}`;
    if (!source) {
      return '';
    }

    const escaped = source
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const query = this.query.trim();
    if (query.length < 2) {
      return escaped;
    }

    const tokens = Array.from(new Set(
      query
        .split(/\s+/)
        .map((token) => token.trim())
        .filter((token) => token.length >= 2)))
      .sort((left, right) => right.length - left.length);

    let output = escaped;
    for (const token of tokens) {
      const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      output = output.replace(new RegExp(`(${escapedToken})`, 'gi'), '<mark>$1</mark>');
    }

    return output;
  }

  private loadResults(): void {
    const query = this.query.trim();
    if (!this.venueId) {
      this.results = [];
      this.total = 0;
      this.intentLabel = '';
      this.loading = false;
      this.errorMessage = 'Select a venue to search.';
      return;
    }

    if (query.length < 3) {
      this.results = [];
      this.total = 0;
      this.intentLabel = '';
      this.loading = false;
      this.errorMessage = '';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const selectedTypes = this.activeTab === 'all'
      ? []
      : [this.activeTab];

    this.api
      .searchResults({
        venueId: this.venueId,
        query,
        types: selectedTypes,
        sort: this.sortMode,
        status: this.statusFilter === 'Any' ? undefined : this.statusFilter,
        from: this.dateFrom || undefined,
        to: this.dateTo || undefined,
        page: this.page,
        pageSize: this.pageSize
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.results = response.page.items;
          this.total = response.page.totalCount;
          this.page = response.page.page;
          this.pageSize = response.page.pageSize;
          this.intentLabel = response.intent?.intentLabel?.trim() || '';
          this.loading = false;
          this.loadTabCounts();
        },
        error: () => {
          this.results = [];
          this.total = 0;
          this.intentLabel = '';
          this.loading = false;
          this.errorMessage = 'Unable to load search results right now.';
        }
      });
  }

  private syncQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.query.trim() || null,
        tab: this.activeTab === 'all' ? null : this.activeTab,
        sort: this.sortMode === 'relevance' ? null : this.sortMode,
        status: this.statusFilter === 'Any' ? null : this.statusFilter,
        from: this.dateFrom || null,
        to: this.dateTo || null,
        page: this.page > 1 ? this.page : null,
        pageSize: this.pageSize !== 25 ? this.pageSize : null
      },
      queryParamsHandling: 'merge'
    });
  }

  private get filteredSortedResults(): GlobalSearchResultDto[] {
    return this.results;
  }

  private loadTabCounts(): void {
    const query = this.query.trim();
    if (!this.venueId || query.length < 3) {
      this.tabCounts = { all: 0, enquiries: 0, contacts: 0, events: 0, proposals: 0 };
      return;
    }

    forkJoin({
      enquiries: this.api.searchResults({
        venueId: this.venueId,
        query,
        types: ['enquiries'],
        status: this.statusFilter === 'Any' ? undefined : this.statusFilter,
        from: this.dateFrom || undefined,
        to: this.dateTo || undefined,
        page: 1,
        pageSize: 1
      }),
      contacts: this.api.searchResults({
        venueId: this.venueId,
        query,
        types: ['contacts'],
        status: this.statusFilter === 'Any' ? undefined : this.statusFilter,
        from: this.dateFrom || undefined,
        to: this.dateTo || undefined,
        page: 1,
        pageSize: 1
      }),
      events: this.api.searchResults({
        venueId: this.venueId,
        query,
        types: ['events'],
        status: this.statusFilter === 'Any' ? undefined : this.statusFilter,
        from: this.dateFrom || undefined,
        to: this.dateTo || undefined,
        page: 1,
        pageSize: 1
      }),
      proposals: this.api.searchResults({
        venueId: this.venueId,
        query,
        types: ['proposals'],
        status: this.statusFilter === 'Any' ? undefined : this.statusFilter,
        from: this.dateFrom || undefined,
        to: this.dateTo || undefined,
        page: 1,
        pageSize: 1
      })
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (counts) => {
          const enquiries = counts.enquiries.page.totalCount ?? 0;
          const contacts = counts.contacts.page.totalCount ?? 0;
          const events = counts.events.page.totalCount ?? 0;
          const proposals = counts.proposals.page.totalCount ?? 0;
          this.tabCounts = {
            all: enquiries + contacts + events + proposals,
            enquiries,
            contacts,
            events,
            proposals
          };
        }
      });
  }

  private normalizeTab(value: string): SearchTabKey {
    switch (value) {
      case 'enquiries':
      case 'contacts':
      case 'events':
      case 'proposals':
        return value;
      default:
        return 'all';
    }
  }

  private parsePositiveInteger(value: string | null, fallback: number): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return fallback;
    }

    return Math.trunc(parsed);
  }
}
