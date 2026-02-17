import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ApiService, DashboardResponse } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let router: jasmine.SpyObj<Router>;
  let api: jasmine.SpyObj<ApiService>;

  const sessionSubject = new BehaviorSubject<any>({
    venueId: 'venue-1',
    venueRoles: [{ venueId: 'venue-1', venueName: 'Grand Hotel London', role: 'SalesManager' }]
  });

  const authStub = {
    session$: sessionSubject.asObservable(),
    get selectedVenueId() {
      return sessionSubject.value?.venueId ?? null;
    },
    get session() {
      return sessionSubject.value;
    },
    isOperationsOnly: jasmine.createSpy('isOperationsOnly').and.returnValue(false),
    setSelectedVenue: jasmine.createSpy('setSelectedVenue')
  };

  const dashboardResponse: DashboardResponse = {
    kpis: [],
    pipeline: {
      tentative: { label: 'Tentative', count: 1, value: 1000, currencyCode: 'GBP' },
      openProposals: { label: 'Open Proposals', count: 1, value: 2000, currencyCode: 'GBP' },
      provisional: { label: 'Provisional', count: 1, value: 1500, currencyCode: 'GBP' },
      confirmed: { label: 'Confirmed', count: 1, value: 3000, currencyCode: 'GBP' },
      averageConversionRatePercent: 40
    },
    upcomingPayments: {
      overdueAmount: 0,
      overdueCount: 0,
      sevenDaysAmount: 0,
      fourteenDaysAmount: 0,
      thirtyDaysAmount: 0,
      currencyCode: 'GBP'
    },
    recentActivity: [],
    upcomingEvents: [],
    taskSummary: {
      openCount: 0,
      overdueCount: 0,
      dueTodayCount: 0
    },
    tasksDueToday: [],
    overdueTasks: [],
    myTasks: [],
    actionRequired: {
      inactiveEnquiries: 1,
      unassignedEnquiries: 2,
      expiringHolds: 3,
      total: 6,
      priorityEnquiries: []
    },
    degradedMode: false,
    warnings: []
  };

  beforeEach(async () => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate', 'navigateByUrl']);
    api = jasmine.createSpyObj<ApiService>('ApiService', ['getDashboard']);
    api.getDashboard.and.returnValue(of(dashboardResponse));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: ApiService, useValue: api },
        { provide: AuthService, useValue: authStub as unknown as AuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads dashboard data on init', () => {
    expect(api.getDashboard).toHaveBeenCalledWith('venue-1', '30d');
    expect(component.data).toEqual(dashboardResponse);
    expect(component.errorMessage).toBe('');
  });

  it('navigates with expected quick filters from action-required widget', () => {
    component.openActionRequired('inactive');
    expect(router.navigate).toHaveBeenCalledWith(['/enquiries'], {
      queryParams: { statusTab: 'all', quickFilter: 'overdue-follow-up' }
    });

    component.openActionRequired('expiring');
    expect(router.navigate).toHaveBeenCalledWith(['/enquiries'], {
      queryParams: { statusTab: 'provisional', quickFilter: 'expiring-holds' }
    });
  });

  it('opens activity link when provided', () => {
    component.openActivity({
      id: 'a1',
      actionType: 'proposal.sent',
      entityType: 'Proposal',
      entityId: 'p1',
      summary: null,
      createdAtUtc: new Date().toISOString(),
      userName: 'Ryan',
      linkRoute: '/connect?focus=p1'
    });

    expect(router.navigateByUrl).toHaveBeenCalledWith('/connect?focus=p1');
  });
});
