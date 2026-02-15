import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ApiService {
    constructor(http) {
        this.http = http;
    }
    getHealth() {
        return this.http.get('/api/health');
    }
    getVenues() {
        return this.http.get('/api/venues');
    }
    getVenueProfile(venueId) {
        return this.http.get(`/api/venues/${venueId}`);
    }
    updateVenueProfile(venueId, payload) {
        return this.http.put(`/api/venues/${venueId}`, payload);
    }
    getVenueSpaces(venueId) {
        return this.http.get(`/api/venues/${venueId}/spaces`);
    }
    createVenueSpace(venueId, payload) {
        return this.http.post(`/api/venues/${venueId}/spaces`, payload);
    }
    updateVenueSpace(venueId, spaceId, payload) {
        return this.http.put(`/api/venues/${venueId}/spaces/${spaceId}`, payload);
    }
    getSpaceCombinations(venueId) {
        return this.http.get(`/api/venues/${venueId}/space-combinations`);
    }
    createSpaceCombination(venueId, payload) {
        return this.http.post(`/api/venues/${venueId}/space-combinations`, payload);
    }
    updateSpaceCombination(venueId, combinationId, payload) {
        return this.http.put(`/api/venues/${venueId}/space-combinations/${combinationId}`, payload);
    }
    getVenueBudgets(venueId, year) {
        const params = new HttpParams().set('year', year);
        return this.http.get(`/api/venues/${venueId}/budgets`, { params });
    }
    upsertVenueBudgetMonth(venueId, year, month, payload) {
        return this.http.put(`/api/venues/${venueId}/budgets/${year}/${month}`, payload);
    }
    importVenueBudgetsCsv(venueId, file) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`/api/venues/${venueId}/budgets/import-csv`, formData);
    }
    getUsers(venueId) {
        let params = new HttpParams();
        if (venueId) {
            params = params.set('venueId', venueId);
        }
        return this.http.get('/api/users', { params });
    }
    inviteUser(payload) {
        return this.http.post('/api/users/invite', payload);
    }
    updateUserStatus(userId, isActive) {
        return this.http.patch(`/api/users/${userId}/status`, { isActive });
    }
    updateUserPassword(userId, password) {
        return this.http.patch(`/api/users/${userId}/password`, { password });
    }
    getUserActivity(take = 50) {
        const params = new HttpParams().set('take', take);
        return this.http.get('/api/users/activity', { params });
    }
    getPaymentScheduleTemplates(venueId) {
        return this.http.get(`/api/venues/${venueId}/settings/payment-schedule-templates`);
    }
    upsertPaymentScheduleTemplates(venueId, templates) {
        return this.http.put(`/api/venues/${venueId}/settings/payment-schedule-templates`, { templates });
    }
    getTermsDocuments(venueId) {
        return this.http.get(`/api/venues/${venueId}/settings/terms-documents`);
    }
    upsertTermsDocuments(venueId, documents) {
        return this.http.put(`/api/venues/${venueId}/settings/terms-documents`, { documents });
    }
    getVenueProposalTemplates(venueId) {
        return this.http.get(`/api/venues/${venueId}/settings/proposal-templates`);
    }
    upsertVenueProposalTemplates(venueId, templates) {
        return this.http.put(`/api/venues/${venueId}/settings/proposal-templates`, { templates });
    }
    getPlanningMilestones(venueId) {
        return this.http.get(`/api/venues/${venueId}/settings/planning-milestones`);
    }
    upsertPlanningMilestones(venueId, milestones) {
        return this.http.put(`/api/venues/${venueId}/settings/planning-milestones`, { milestones });
    }
    getReportConfiguration(venueId) {
        return this.http.get(`/api/venues/${venueId}/settings/report-configuration`);
    }
    upsertReportConfiguration(venueId, config) {
        return this.http.put(`/api/venues/${venueId}/settings/report-configuration`, config);
    }
    getAutomationSettings(venueId) {
        return this.http.get(`/api/venues/${venueId}/settings/automation`);
    }
    upsertAutomationSettings(venueId, config) {
        return this.http.put(`/api/venues/${venueId}/settings/automation`, config);
    }
    getEmailTemplates(venueId) {
        return this.http.get(`/api/venues/${venueId}/settings/email-templates`);
    }
    upsertEmailTemplates(venueId, templates) {
        return this.http.put(`/api/venues/${venueId}/settings/email-templates`, { templates });
    }
    getWebsiteForms(venueId) {
        return this.http.get(`/api/venues/${venueId}/settings/website-forms`);
    }
    upsertWebsiteForms(venueId, forms) {
        return this.http.put(`/api/venues/${venueId}/settings/website-forms`, { forms });
    }
    getCalendarAccounts(venueId) {
        return this.http.get(`/api/venues/${venueId}/settings/calendar-accounts`);
    }
    upsertCalendarAccounts(venueId, accounts) {
        return this.http.put(`/api/venues/${venueId}/settings/calendar-accounts`, { accounts });
    }
    getVenueEmailAccounts(venueId) {
        return this.http.get(`/api/venues/${venueId}/email-accounts`);
    }
    createVenueEmailAccount(venueId, payload) {
        return this.http.post(`/api/venues/${venueId}/email-accounts`, payload);
    }
    updateVenueEmailAccount(venueId, accountId, payload) {
        return this.http.put(`/api/venues/${venueId}/email-accounts/${accountId}`, payload);
    }
    deleteVenueEmailAccount(venueId, accountId) {
        return this.http.delete(`/api/venues/${venueId}/email-accounts/${accountId}`);
    }
    getRecentEnquiries() {
        return this.http.get('/api/enquiries/recent');
    }
    getEnquiries(params) {
        let queryParams = new HttpParams().set('venueId', params.venueId);
        if (params.statusTab) {
            queryParams = queryParams.set('statusTab', params.statusTab);
        }
        if (params.period) {
            queryParams = queryParams.set('period', params.period);
        }
        if (params.eventManagerUserId) {
            queryParams = queryParams.set('eventManagerUserId', params.eventManagerUserId);
        }
        if (params.eventType) {
            queryParams = queryParams.set('eventType', params.eventType);
        }
        if (params.eventStyle) {
            queryParams = queryParams.set('eventStyle', params.eventStyle);
        }
        if (params.source) {
            queryParams = queryParams.set('source', params.source);
        }
        if (params.quickFilter) {
            queryParams = queryParams.set('quickFilter', params.quickFilter);
        }
        if (params.search) {
            queryParams = queryParams.set('search', params.search);
        }
        if (params.page) {
            queryParams = queryParams.set('page', params.page);
        }
        if (params.pageSize) {
            queryParams = queryParams.set('pageSize', params.pageSize);
        }
        return this.http.get('/api/enquiries', { params: queryParams });
    }
    createEnquiry(payload) {
        return this.http.post('/api/enquiries', payload);
    }
    getEnquiry(enquiryId) {
        return this.http.get(`/api/enquiries/${enquiryId}`);
    }
    transitionEnquiryStatus(enquiryId, payload) {
        return this.http.post(`/api/enquiries/${enquiryId}/status-transition`, payload);
    }
    getAvailability(venueId, date) {
        const params = new HttpParams().set('venueId', venueId).set('date', date);
        return this.http.get('/api/enquiries/availability', { params });
    }
    getDiary(params) {
        let queryParams = new HttpParams().set('venueId', params.venueId).set('view', params.view);
        if (params.startDate) {
            queryParams = queryParams.set('startDate', params.startDate);
        }
        return this.http.get('/api/diary', { params: queryParams });
    }
    moveDiaryEvent(payload) {
        return this.http.put('/api/diary/move', payload);
    }
    getOperationsOverview(venueId) {
        const params = new HttpParams().set('venueId', venueId);
        return this.http.get('/api/operations/overview', { params });
    }
    getProposals(params) {
        let queryParams = new HttpParams().set('venueId', params.venueId);
        if (params.status) {
            queryParams = queryParams.set('status', params.status);
        }
        if (params.eventType) {
            queryParams = queryParams.set('eventType', params.eventType);
        }
        if (params.dateFrom) {
            queryParams = queryParams.set('dateFrom', params.dateFrom);
        }
        if (params.dateTo) {
            queryParams = queryParams.set('dateTo', params.dateTo);
        }
        if (params.valueMin !== undefined && params.valueMin !== null) {
            queryParams = queryParams.set('valueMin', params.valueMin);
        }
        if (params.valueMax !== undefined && params.valueMax !== null) {
            queryParams = queryParams.set('valueMax', params.valueMax);
        }
        if (params.operatorUserId) {
            queryParams = queryParams.set('operatorUserId', params.operatorUserId);
        }
        if (params.sortBy) {
            queryParams = queryParams.set('sortBy', params.sortBy);
        }
        if (params.sortDirection) {
            queryParams = queryParams.set('sortDirection', params.sortDirection);
        }
        if (params.page) {
            queryParams = queryParams.set('page', params.page);
        }
        if (params.pageSize) {
            queryParams = queryParams.set('pageSize', params.pageSize);
        }
        return this.http.get('/api/proposals', { params: queryParams });
    }
    getEnquiryProposals(enquiryId) {
        return this.http.get(`/api/enquiries/${enquiryId}/proposals`);
    }
    getProposal(proposalId) {
        return this.http.get(`/api/proposals/${proposalId}`);
    }
    createProposal(enquiryId, payload) {
        return this.http.post(`/api/enquiries/${enquiryId}/proposals`, payload);
    }
    updateProposal(proposalId, payload) {
        return this.http.put(`/api/proposals/${proposalId}`, payload);
    }
    duplicateProposal(proposalId) {
        return this.http.post(`/api/proposals/${proposalId}/duplicate`, {});
    }
    sendProposal(proposalId, payload) {
        return this.http.post(`/api/proposals/${proposalId}/send`, payload);
    }
    compareProposals(proposalId, otherProposalId) {
        return this.http.get(`/api/proposals/${proposalId}/compare/${otherProposalId}`);
    }
    getProposalTemplateOptions(venueId, eventType) {
        let params = new HttpParams().set('venueId', venueId);
        if (eventType) {
            params = params.set('eventType', eventType);
        }
        return this.http.get('/api/proposals/template-options', { params });
    }
    getPaymentSchedule(enquiryId) {
        return this.http.get(`/api/enquiries/${enquiryId}/payments`);
    }
    createPaymentLink(milestoneId, payload) {
        return this.http.post(`/api/payment-milestones/${milestoneId}/payment-link`, payload);
    }
    recordPayment(milestoneId, payload) {
        return this.http.post(`/api/payment-milestones/${milestoneId}/record`, payload);
    }
    refundPayment(transactionId, payload) {
        return this.http.post(`/api/payment-transactions/${transactionId}/refund`, payload);
    }
    getFinancialWidgets(venueId) {
        const params = new HttpParams().set('venueId', venueId);
        return this.http.get('/api/financial/widgets', { params });
    }
    getDashboard(venueId, period = '30d') {
        const params = new HttpParams().set('venueId', venueId).set('period', period);
        return this.http.get('/api/dashboard', { params });
    }
    getConnectTimeline(params) {
        let queryParams = new HttpParams().set('venueId', params.venueId);
        if (params.enquiryId) {
            queryParams = queryParams.set('enquiryId', params.enquiryId);
        }
        if (params.type) {
            queryParams = queryParams.set('type', params.type);
        }
        if (params.search) {
            queryParams = queryParams.set('search', params.search);
        }
        if (params.page) {
            queryParams = queryParams.set('page', params.page);
        }
        if (params.pageSize) {
            queryParams = queryParams.set('pageSize', params.pageSize);
        }
        return this.http.get('/api/connect/timeline', { params: queryParams });
    }
    addInternalNote(enquiryId, payload) {
        return this.http.post(`/api/connect/enquiries/${enquiryId}/notes`, payload);
    }
    sendConnectEmail(enquiryId, payload) {
        return this.http.post(`/api/connect/enquiries/${enquiryId}/emails`, payload);
    }
    getUnmatchedInbox(venueId) {
        const params = new HttpParams().set('venueId', venueId);
        return this.http.get('/api/connect/inbox/unmatched', { params });
    }
    linkUnmatchedInboxItem(inboundEmailId, enquiryId) {
        return this.http.post(`/api/connect/inbox/unmatched/${inboundEmailId}/link`, { enquiryId });
    }
    getChatChannels(venueId) {
        let params = new HttpParams();
        if (venueId) {
            params = params.set('venueId', venueId);
        }
        return this.http.get('/api/connect/channels', { params });
    }
    createChatChannel(payload) {
        return this.http.post('/api/connect/channels', payload);
    }
    getChatThread(channelId) {
        return this.http.get(`/api/connect/channels/${channelId}`);
    }
    sendChatMessage(channelId, payload) {
        return this.http.post(`/api/connect/channels/${channelId}/messages`, payload);
    }
    markChatRead(channelId) {
        return this.http.post(`/api/connect/channels/${channelId}/read`, {});
    }
    searchSuggest(venueId, query) {
        const params = new HttpParams().set('venueId', venueId).set('q', query);
        return this.http.get('/api/search/suggest', { params });
    }
    searchResults(params) {
        let queryParams = new HttpParams().set('venueId', params.venueId).set('q', params.query);
        if (params.types && params.types.length > 0) {
            queryParams = queryParams.set('types', params.types.join(','));
        }
        if (params.page) {
            queryParams = queryParams.set('page', params.page);
        }
        if (params.pageSize) {
            queryParams = queryParams.set('pageSize', params.pageSize);
        }
        return this.http.get('/api/search/results', { params: queryParams });
    }
    getTasks(params) {
        let queryParams = new HttpParams().set('venueId', params.venueId);
        if (params.enquiryId) {
            queryParams = queryParams.set('enquiryId', params.enquiryId);
        }
        if (params.assignedUserId) {
            queryParams = queryParams.set('assignedUserId', params.assignedUserId);
        }
        if (params.status) {
            queryParams = queryParams.set('status', params.status);
        }
        if (params.due) {
            queryParams = queryParams.set('due', params.due);
        }
        return this.http.get('/api/tasks', { params: queryParams });
    }
    createTask(enquiryId, payload) {
        return this.http.post(`/api/enquiries/${enquiryId}/tasks`, payload);
    }
    updateTask(taskId, payload) {
        return this.http.put(`/api/tasks/${taskId}`, payload);
    }
    getTaskTemplates(venueId) {
        const params = new HttpParams().set('venueId', venueId);
        return this.http.get('/api/task-templates', { params });
    }
    upsertTaskTemplate(venueId, payload, templateId) {
        let params = new HttpParams().set('venueId', venueId);
        if (templateId) {
            params = params.set('templateId', templateId);
        }
        return this.http.post('/api/task-templates', payload, { params });
    }
    deleteTaskTemplate(templateId) {
        return this.http.delete(`/api/task-templates/${templateId}`);
    }
    getNotifications(venueId, take = 30) {
        let params = new HttpParams().set('take', take);
        if (venueId) {
            params = params.set('venueId', venueId);
        }
        return this.http.get('/api/notifications', { params });
    }
    markNotificationsRead(payload) {
        return this.http.post('/api/notifications/read', payload);
    }
    getNotificationPreferences() {
        return this.http.get('/api/notifications/preferences');
    }
    upsertNotificationPreference(payload) {
        return this.http.post('/api/notifications/preferences', payload);
    }
    getReportsCatalog() {
        return this.http.get('/api/reports');
    }
    getReport(reportKey, params) {
        let queryParams = new HttpParams().set('venueId', params.venueId);
        if (params.from) {
            queryParams = queryParams.set('from', params.from);
        }
        if (params.to) {
            queryParams = queryParams.set('to', params.to);
        }
        if (params.eventType) {
            queryParams = queryParams.set('eventType', params.eventType);
        }
        if (params.status) {
            queryParams = queryParams.set('status', params.status);
        }
        return this.http.get(`/api/reports/${reportKey}`, { params: queryParams });
    }
    exportReport(reportKey, params) {
        let queryParams = new HttpParams().set('venueId', params.venueId).set('format', params.format);
        if (params.from) {
            queryParams = queryParams.set('from', params.from);
        }
        if (params.to) {
            queryParams = queryParams.set('to', params.to);
        }
        return this.http.get(`/api/reports/${reportKey}/export`, { params: queryParams, responseType: 'blob' });
    }
    getReportSchedules(venueId) {
        const params = new HttpParams().set('venueId', venueId);
        return this.http.get('/api/reports/schedules', { params });
    }
    upsertReportSchedule(venueId, payload, scheduleId) {
        let params = new HttpParams().set('venueId', venueId);
        if (scheduleId) {
            params = params.set('scheduleId', scheduleId);
        }
        return this.http.post('/api/reports/schedules', payload, { params });
    }
    deleteReportSchedule(scheduleId) {
        return this.http.delete(`/api/reports/schedules/${scheduleId}`);
    }
    runPipelineSnapshot(venueId) {
        const params = new HttpParams().set('venueId', venueId);
        return this.http.post('/api/reports/pipeline-snapshot/run', {}, { params });
    }
    static { this.ɵfac = function ApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ApiService)(i0.ɵɵinject(i1.HttpClient)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ApiService, factory: ApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }], null); })();
//# sourceMappingURL=api.service.js.map