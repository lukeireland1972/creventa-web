import { authGuard } from './auth.guard';
import { AppShellComponent } from './layout/app-shell.component';
import { ConnectComponent } from './pages/connect/connect.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EnquiriesComponent } from './pages/enquiries/enquiries.component';
import { EventDiaryComponent } from './pages/event-diary/event-diary.component';
import { LoginComponent } from './pages/login/login.component';
import { OperationsDashboardComponent } from './pages/operations-dashboard/operations-dashboard.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';
import { ProposalsComponent } from './pages/proposals/proposals.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AdminComponent } from './pages/admin/admin.component';
export const routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: AppShellComponent,
        canActivate: [authGuard],
        children: [
            { path: '', component: DashboardComponent, pathMatch: 'full' },
            { path: 'connect', component: ConnectComponent },
            { path: 'event-diary', component: EventDiaryComponent },
            { path: 'enquiries', component: EnquiriesComponent },
            { path: 'operations', component: OperationsDashboardComponent },
            { path: 'proposals', component: ProposalsComponent },
            { path: 'admin', component: AdminComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'events-hub', component: PlaceholderComponent, data: { title: 'Events Hub' } },
            { path: 'reports', component: ReportsComponent }
        ]
    },
    { path: '**', redirectTo: '/login' }
];
//# sourceMappingURL=app.routes.js.map