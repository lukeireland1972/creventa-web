import { Routes } from '@angular/router';
import { authChildGuard, authGuard } from './auth.guard';
import { AppShellComponent } from './layout/app-shell.component';
import { MockCardPaymentComponent } from './pages/payments/mock-card-payment.component';
import { PortalViewComponent } from './pages/portal/portal-view.component';
import { SignaturePortalComponent } from './pages/signature/signature-portal.component';
import { EventsHubRegistrationComponent } from './pages/events-hub/events-hub-registration.component';

export const routes: Routes = [
  { path: 'portal/e/:token', redirectTo: 'portal/:token/proposal', pathMatch: 'full' },
  { path: 'portal/:token/:tab', component: PortalViewComponent },
  { path: 'portal/:token', redirectTo: 'portal/:token/proposal', pathMatch: 'full' },
  { path: 'payments/mock/:milestoneId', component: MockCardPaymentComponent },
  { path: 'signature/e/:token', component: SignaturePortalComponent },
  { path: 'events-hub/register/:eventId', component: EventsHubRegistrationComponent },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent) },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    children: [
      { path: 'connect', loadComponent: () => import('./pages/connect/connect.component').then((m) => m.ConnectComponent) },
      { path: 'contacts', loadComponent: () => import('./pages/contacts/contacts.component').then((m) => m.ContactsComponent) },
      { path: 'portfolio', redirectTo: 'group-portfolio', pathMatch: 'full' },
      { path: 'group-portfolio', loadComponent: () => import('./pages/portfolio/portfolio.component').then((m) => m.PortfolioComponent) },
      { path: 'event-diary', loadComponent: () => import('./pages/event-diary/event-diary.component').then((m) => m.EventDiaryComponent) },
      { path: 'appointments', loadComponent: () => import('./pages/appointments/appointments.component').then((m) => m.AppointmentsComponent) },
      { path: 'enquiries/:id', loadComponent: () => import('./pages/enquiries/enquiry-detail.component').then((m) => m.EnquiryDetailComponent) },
      { path: 'enquiries', loadComponent: () => import('./pages/enquiries/enquiries.component').then((m) => m.EnquiriesComponent) },
      { path: 'tasks', loadComponent: () => import('./pages/tasks/tasks.component').then((m) => m.TasksComponent) },
      { path: 'operations', loadComponent: () => import('./pages/operations-dashboard/operations-dashboard.component').then((m) => m.OperationsDashboardComponent) },
      { path: 'proposals', loadComponent: () => import('./pages/proposals/proposals.component').then((m) => m.ProposalsComponent) },
      { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent) },
      { path: 'events-hub', loadComponent: () => import('./pages/events-hub/events-hub.component').then((m) => m.EventsHubComponent) },
      { path: 'reports', loadComponent: () => import('./pages/reports/reports.component').then((m) => m.ReportsComponent) },
      { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications.component').then((m) => m.NotificationsComponent) },
      { path: 'search', loadComponent: () => import('./pages/search/search-results.component').then((m) => m.SearchResultsComponent) },
      { path: 'website-enquiry', loadComponent: () => import('./pages/website-enquiry/website-enquiry.component').then((m) => m.WebsiteEnquiryComponent) },
      { path: 'ticket-dashboard', loadComponent: () => import('./pages/ticket-dashboard/ticket-dashboard.component').then((m) => m.TicketDashboardComponent) },
      { path: 'feedback-insights', loadComponent: () => import('./pages/feedback-insights/feedback-insights.component').then((m) => m.FeedbackInsightsComponent) },
      { path: '', loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent), pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
