import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { AppShellComponent } from './layout/app-shell.component';
import { ConnectComponent } from './pages/connect/connect.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EnquiriesComponent } from './pages/enquiries/enquiries.component';
import { EventDiaryComponent } from './pages/event-diary/event-diary.component';
import { LoginComponent } from './pages/login/login.component';
import { OperationsDashboardComponent } from './pages/operations-dashboard/operations-dashboard.component';
import { PortalViewComponent } from './pages/portal/portal-view.component';
import { ProposalsComponent } from './pages/proposals/proposals.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AdminComponent } from './pages/admin/admin.component';
import { SignaturePortalComponent } from './pages/signature/signature-portal.component';

export const routes: Routes = [
  { path: 'portal/e/:token', component: PortalViewComponent },
  { path: 'signature/e/:token', component: SignaturePortalComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'connect', component: ConnectComponent },
      { path: 'contacts', loadComponent: () => import('./pages/contacts/contacts.component').then((m) => m.ContactsComponent) },
      { path: 'portfolio', loadComponent: () => import('./pages/portfolio/portfolio.component').then((m) => m.PortfolioComponent) },
      { path: 'event-diary', component: EventDiaryComponent },
      { path: 'enquiries', component: EnquiriesComponent },
      { path: 'tasks', loadComponent: () => import('./pages/tasks/tasks.component').then((m) => m.TasksComponent) },
      { path: 'operations', component: OperationsDashboardComponent },
      { path: 'proposals', component: ProposalsComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'events-hub', loadComponent: () => import('./pages/events-hub/events-hub.component').then((m) => m.EventsHubComponent) },
      { path: 'reports', component: ReportsComponent },
      { path: 'feedback-insights', loadComponent: () => import('./pages/feedback-insights/feedback-insights.component').then((m) => m.FeedbackInsightsComponent) },
      { path: '', component: DashboardComponent, pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
