import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { EnquiriesComponent } from './enquiries.component';
import { ApiService, EnquiryDetailResponse, EnquiryListResponse } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

describe('EnquiriesComponent', () => {
  let fixture: ComponentFixture<EnquiriesComponent>;
  let component: EnquiriesComponent;
  let router: jasmine.SpyObj<Router>;
  let api: jasmine.SpyObj<ApiService>;
  let queryParamSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  const emptyListResponse: EnquiryListResponse = {
    stats: {
      newEnquiries: 0,
      newEnquiriesDeltaPercent: 0,
      proposalsSent: 0,
      proposalsSentDeltaPercent: 0,
      confirmed: 0,
      confirmedDeltaPercent: 0,
      lost: 0,
      lostRatePercent: 0
    },
    statusTabCounts: {
      'new-unanswered': 0,
      proposals: 0,
      provisional: 0,
      confirmed: 0,
      lost: 0,
      all: 0
    },
    page: {
      items: [],
      page: 1,
      pageSize: 25,
      totalCount: 0
    }
  };

  const detailResponse: EnquiryDetailResponse = {
    id: 'enq-1',
    venueId: 'venue-1',
    reference: 'ENQ-2026-0001',
    status: 'New',
    contactFirstName: 'Alex',
    contactLastName: 'Smith',
    contactEmail: 'alex@example.com',
    contactPhoneNumberE164: '+447700900123',
    marketingConsent: false,
    sourceType: 'Phone',
    sourceDetail: null,
    eventType: 'Wedding',
    eventName: 'Smith Wedding',
    eventStartUtc: new Date().toISOString(),
    eventEndUtc: null,
    hasFlexibleDates: false,
    flexibleDateNotes: null,
    guestsExpected: 80,
    guestsConfirmed: null,
    eventStyle: '3-Course Dinner',
    setupStyle: 'Banquet',
    budgetMinAmount: null,
    budgetMaxAmount: null,
    currencyCode: 'GBP',
    specialRequirements: null,
    internalNotes: null,
    eventManagerUserId: null,
    eventManagerName: null,
    leadQuality: 3,
    holdExpiresAtUtc: null,
    lostReason: null,
    lostReasonDetail: null,
    subEvents: [],
    appointments: [],
    recent: [],
    sameDateAvailability: null,
    activityLog: []
  };

  const authStub = {
    selectedVenueId: 'venue-1'
  };

  beforeEach(async () => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    queryParamSubject = new BehaviorSubject(
      convertToParamMap({
        statusTab: 'proposals',
        search: 'smith',
        quickFilter: 'unassigned',
        pageSize: '50'
      })
    );

    api = jasmine.createSpyObj<ApiService>('ApiService', [
      'getEnquiries',
      'getEnquiry',
      'transitionEnquiryStatus',
      'getUsers',
      'getLostReasons'
    ]);
    api.getEnquiries.and.returnValue(of(emptyListResponse));
    api.getEnquiry.and.returnValue(of(detailResponse));
    api.transitionEnquiryStatus.and.returnValue(of(void 0));
    api.getUsers.and.returnValue(of([]));
    api.getLostReasons.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [EnquiriesComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: ApiService, useValue: api },
        { provide: AuthService, useValue: authStub as unknown as AuthService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamSubject.asObservable()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('hydrates active tab and filters from query params', () => {
    expect(component.activeTab).toBe('proposals');
    expect(component.filtersForm.getRawValue().search).toBe('smith');
    expect(component.filtersForm.getRawValue().quickFilter).toBe('unassigned');
    expect(component.filtersForm.getRawValue().pageSize).toBe(50);

    expect(api.getEnquiries).toHaveBeenCalledWith(
      jasmine.objectContaining({
        venueId: 'venue-1',
        statusTab: 'proposals',
        search: 'smith',
        quickFilter: 'unassigned',
        pageSize: 50
      })
    );
  });

  it('syncs filter changes back to the URL query params', () => {
    component.filtersForm.patchValue({
      search: 'corporate',
      quickFilter: 'expiring-holds',
      pageSize: 100
    });

    expect(router.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({
          search: 'corporate',
          quickFilter: 'expiring-holds',
          pageSize: 100
        }),
        queryParamsHandling: 'merge',
        replaceUrl: true
      })
    );
  });

  it('setTab updates route query params', () => {
    component.setTab('confirmed');

    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: jasmine.anything(),
      queryParams: { statusTab: 'confirmed' },
      queryParamsHandling: 'merge'
    });
  });

  it('select all toggles visible enquiry rows', () => {
    component.enquiries = [
      { id: 'e1' },
      { id: 'e2' },
      { id: 'e3' }
    ] as unknown as EnquiryListResponse['page']['items'];

    component.toggleSelectAll(true);
    expect(component.selectedCount).toBe(3);
    expect(component.isEnquirySelected('e1')).toBeTrue();
    expect(component.isEnquirySelected('e2')).toBeTrue();
    expect(component.isEnquirySelected('e3')).toBeTrue();

    component.toggleSelectAll(false);
    expect(component.selectedCount).toBe(0);
  });

  it('opening Lost bulk status shows lost reason modal', () => {
    component.selectedEnquiryIds = new Set(['e1', 'e2']);
    component.applyBulkStatus('Lost');

    expect(component.showLostReasonModal).toBeTrue();
    expect(component.lostReasonModalMode).toBe('bulk');
  });

  it('clears bulk selection when changing status tab', () => {
    component.selectedEnquiryIds = new Set(['e1', 'e2']);
    component.setTab('confirmed');

    expect(component.selectedCount).toBe(0);
  });
});
