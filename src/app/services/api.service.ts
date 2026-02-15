import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HealthStatus {
  status: string;
}

export interface VenueSummaryDto {
  id: string;
  name: string;
  timeZone: string;
  currencyCode: string;
}

export interface VenueProfileDto {
  id: string;
  name: string;
  legalEntityName?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  region?: string | null;
  postcode?: string | null;
  countryCode: string;
  phoneNumberE164?: string | null;
  enquiriesEmail?: string | null;
  websiteUrl?: string | null;
  vatNumber?: string | null;
  companyRegistrationNumber?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  cancellationPolicy?: string | null;
  currencyCode: string;
  defaultVatRate: number;
  timeZone: string;
  locale: string;
  minimumBookingNoticeDays: number;
  defaultHoldPeriodDays: number;
  holdWarningDays: number;
  holdAutoReleaseMode: string;
  maxHoldsPerDateAndSpace: number;
}

export interface UpdateVenueProfileRequest {
  name: string;
  legalEntityName?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  region?: string | null;
  postcode?: string | null;
  countryCode: string;
  phoneNumberE164?: string | null;
  enquiriesEmail?: string | null;
  websiteUrl?: string | null;
  vatNumber?: string | null;
  companyRegistrationNumber?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  cancellationPolicy?: string | null;
  currencyCode: string;
  defaultVatRate: number;
  timeZone: string;
  locale: string;
  minimumBookingNoticeDays: number;
  defaultHoldPeriodDays: number;
  holdWarningDays: number;
  holdAutoReleaseMode: string;
  maxHoldsPerDateAndSpace: number;
}

export interface SpaceCapacityDto {
  setupStyle: string;
  capacity: number;
}

export interface SpacePricingDto {
  rateType: string;
  amount: number;
  currencyCode: string;
  dayOfWeek?: string | null;
}

export interface SpaceSummaryDto {
  id: string;
  venueId: string;
  name: string;
  description?: string | null;
  locationText?: string | null;
  floorAreaSqm?: number | null;
  facilitiesCsv: string;
  minimumSpendAmount?: number | null;
  minimumSpendCurrencyCode: string;
  turnaroundMinutes: number;
  isActive: boolean;
  capacityBySetup: SpaceCapacityDto[];
  pricing: SpacePricingDto[];
}

export interface UpsertSpaceRequest {
  name: string;
  description?: string | null;
  locationText?: string | null;
  floorAreaSqm?: number | null;
  facilitiesCsv: string;
  minimumSpendAmount?: number | null;
  minimumSpendCurrencyCode: string;
  turnaroundMinutes: number;
  isActive: boolean;
  capacityBySetup: SpaceCapacityDto[];
  pricing: SpacePricingDto[];
}

export interface SpaceCombinationDto {
  id: string;
  venueId: string;
  name: string;
  description?: string | null;
  priceAmount?: number | null;
  currencyCode: string;
  spaceIds: string[];
  capacityBySetup: SpaceCapacityDto[];
}

export interface UpsertSpaceCombinationRequest {
  name: string;
  description?: string | null;
  priceAmount?: number | null;
  currencyCode: string;
  spaceIds: string[];
  capacityBySetup: SpaceCapacityDto[];
}

export interface BudgetByEventTypeDto {
  eventType: string;
  revenueTarget: number;
  coversTarget: number;
  bookingCountTarget: number;
  averageSellingPriceTarget: number;
}

export interface BudgetMonthDto {
  id: string;
  venueId: string;
  year: number;
  month: number;
  overallRevenueTarget: number;
  currencyCode: string;
  targetsByEventType: BudgetByEventTypeDto[];
}

export interface UpsertBudgetMonthRequest {
  year: number;
  month: number;
  overallRevenueTarget: number;
  currencyCode: string;
  targetsByEventType: BudgetByEventTypeDto[];
}

export interface UserVenueRoleSummaryDto {
  venueId: string;
  venueName: string;
  role: string;
}

export interface UserSummaryDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumberE164?: string | null;
  isActive: boolean;
  requiresTotp: boolean;
  venueRoles: UserVenueRoleSummaryDto[];
}

export interface InviteVenueRoleRequest {
  venueId: string;
  role: string;
}

export interface InviteUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumberE164?: string | null;
  venueRoles: InviteVenueRoleRequest[];
  requiresTotp: boolean;
}

export interface InviteUserResponse {
  invitationId: string;
  email: string;
  expiresAtUtc: string;
  debugToken?: string | null;
}

export interface UserActivityItemDto {
  id: string;
  createdAtUtc: string;
  actionType: string;
  entityType: string;
  entityId: string;
  changeSummaryJson?: string | null;
  userId?: string | null;
  userName?: string | null;
}

export interface PaymentScheduleTemplateMilestoneSettingDto {
  name: string;
  dueDateRule: string;
  amountType: string;
  amount: number;
  paymentMethodsAccepted: string[];
  autoReminderEnabled: boolean;
  autoReminderDays: number;
  lateReminderEnabled: boolean;
  lateReminderDays: number;
}

export interface PaymentScheduleTemplateSettingDto {
  id: string;
  name: string;
  eventType: string;
  isDefault: boolean;
  milestones: PaymentScheduleTemplateMilestoneSettingDto[];
}

export interface TermsDocumentSettingDto {
  id: string;
  title: string;
  eventType: string;
  version: string;
  content: string;
  isActive: boolean;
  updatedAtUtc: string;
}

export interface ProposalTemplateLineItemSettingDto {
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitPriceExclVat: number;
  vatRate: number;
  discountPercent: number;
  discountAmount: number;
}

export interface ProposalTemplateSettingDto {
  key: string;
  label: string;
  eventType: string;
  defaultLineItems: ProposalTemplateLineItemSettingDto[];
  defaultIntroduction?: string | null;
  defaultTermsVersion?: string | null;
  defaultValidityDays: number;
}

export interface PlanningMilestoneSettingDto {
  key: string;
  label: string;
  isEnabled: boolean;
}

export interface ReportConfigurationSettingDto {
  provisionalWeightPercent: number;
  tentativeWeightPercent: number;
  openProposalWeightPercent: number;
}

export interface AutomationSettingsDto {
  proposalAcceptedTargetStatus: string;
  followUpInactiveDays: number;
  autoArchiveEnabled: boolean;
  autoArchiveDays: number;
}

export interface VenueEmailAccountDto {
  id: string;
  venueId: string;
  address: string;
  provider: string;
  externalAccountReference?: string | null;
  isActive: boolean;
  connectionStatus: string;
  lastSyncedAtUtc?: string | null;
  lastSyncError?: string | null;
  useForOutbound: boolean;
}

export interface VenueEmailTemplateDto {
  key: string;
  name: string;
  subjectTemplate: string;
  bodyHtmlTemplate: string;
  isActive: boolean;
}

export interface WebsiteFormSettingDto {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  successMessage: string;
  redirectUrl?: string | null;
  requiredFields: string[];
  optionalFields: string[];
  styleJson?: string | null;
}

export interface CalendarAccountSettingDto {
  id: string;
  address: string;
  provider: string;
  externalCalendarId?: string | null;
  isActive: boolean;
  syncProvisionalHolds: boolean;
  connectionStatus: string;
  lastSyncedAtUtc?: string | null;
}

export interface RecentlyViewedDto {
  id: string;
  entityType: string;
  entityId: string;
  label: string;
  status?: string | null;
  secondaryLine?: string | null;
  viewedAtUtc: string;
}

export interface EnquiryStatsDto {
  newEnquiries: number;
  newEnquiriesDeltaPercent: number;
  proposalsSent: number;
  proposalsSentDeltaPercent: number;
  confirmed: number;
  confirmedDeltaPercent: number;
  lost: number;
  lostRatePercent: number;
}

export interface EnquiryListItemDto {
  id: string;
  reference: string;
  contactName: string;
  eventType: string;
  eventStyle?: string | null;
  eventStartUtc: string;
  eventEndUtc?: string | null;
  guestsExpected: number;
  status: string;
  proposalValue?: number | null;
  currencyCode: string;
  eventManagerName?: string | null;
  lastActivityAtUtc: string;
  daysSinceContact: number;
  sourceType: string;
  venueId: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface EnquiryListResponse {
  stats: EnquiryStatsDto;
  statusTabCounts: Record<string, number>;
  page: PagedResult<EnquiryListItemDto>;
}

export interface SubEventDto {
  id: string;
  name: string;
  startUtc: string;
  endUtc: string;
  guestCount: number;
  setupStyle?: string | null;
  specialRequirements?: string | null;
  priceAmount?: number | null;
  currencyCode: string;
  spaceIds: string[];
}

export interface AppointmentDto {
  id: string;
  title: string;
  type: string;
  startUtc: string;
  durationMinutes: number;
  spaceId?: string | null;
  spaceName?: string | null;
  attendees?: string | null;
  assignedToUserId?: string | null;
  assignedToName?: string | null;
  status: string;
  notes?: string | null;
}

export interface ActivityLogEntryDto {
  id: string;
  createdAtUtc: string;
  actionType: string;
  entityType: string;
  entityId: string;
  changeSummaryJson?: string | null;
  userId?: string | null;
  userName?: string | null;
}

export interface AvailabilityEventDto {
  recordId: string;
  recordType: string;
  label: string;
  enquiryStatus?: string | null;
  covers?: number | null;
  eventType?: string | null;
  eventStyle?: string | null;
  spaceName: string;
  startUtc: string;
  endUtc: string;
  eventManagerName?: string | null;
}

export interface SpaceAvailabilityGroupDto {
  spaceId: string;
  spaceName: string;
  isAvailable: boolean;
  events: AvailabilityEventDto[];
}

export interface AvailabilitySidebarResponse {
  date: string;
  spaces: SpaceAvailabilityGroupDto[];
}

export interface EnquiryDetailResponse {
  id: string;
  venueId: string;
  reference: string;
  status: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhoneNumberE164: string;
  secondaryContactName?: string | null;
  secondaryEmail?: string | null;
  secondaryPhoneNumberE164?: string | null;
  companyName?: string | null;
  marketingConsent: boolean;
  eventType: string;
  eventName?: string | null;
  eventStartUtc: string;
  eventEndUtc?: string | null;
  hasFlexibleDates: boolean;
  flexibleDateNotes?: string | null;
  guestsExpected: number;
  guestsConfirmed?: number | null;
  eventStyle?: string | null;
  setupStyle?: string | null;
  budgetMinAmount?: number | null;
  budgetMaxAmount?: number | null;
  currencyCode: string;
  specialRequirements?: string | null;
  internalNotes?: string | null;
  eventManagerUserId?: string | null;
  eventManagerName?: string | null;
  sourceType: string;
  sourceDetail?: string | null;
  leadQuality: number;
  holdExpiresAtUtc?: string | null;
  lostReason?: string | null;
  lostReasonDetail?: string | null;
  subEvents: SubEventDto[];
  appointments: AppointmentDto[];
  activityLog: ActivityLogEntryDto[];
  recent: RecentlyViewedDto[];
  sameDateAvailability?: AvailabilitySidebarResponse | null;
}

export interface CreateEnquiryRequest {
  venueId: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhoneNumberE164: string;
  secondaryContactName?: string;
  secondaryEmail?: string;
  secondaryPhoneNumberE164?: string;
  companyName?: string;
  marketingConsent: boolean;
  eventType: string;
  eventName?: string;
  eventStartUtc: string;
  eventEndUtc?: string;
  hasFlexibleDates: boolean;
  flexibleDateNotes?: string;
  guestsExpected: number;
  eventStyle?: string;
  setupStyle?: string;
  budgetMinAmount?: number;
  budgetMaxAmount?: number;
  currencyCode: string;
  sourceType: string;
  sourceDetail?: string;
  leadQuality: number;
  specialRequirements?: string;
  internalNotes?: string;
  eventManagerUserId?: string;
}

export interface DiarySpaceDto {
  spaceId: string;
  spaceName: string;
  isVisible: boolean;
}

export interface DiaryEventDto {
  id: string;
  eventType: 'Enquiry' | 'Appointment' | 'VenueEvent';
  enquiryId?: string | null;
  appointmentId?: string | null;
  venueEventId?: string | null;
  spaceId: string;
  spaceName: string;
  label: string;
  statusKey?: string | null;
  visualType: string;
  enquiryStatus?: string | null;
  isProvisional: boolean;
  isBlocked: boolean;
  covers?: number | null;
  eventStyle?: string | null;
  startUtc: string;
  endUtc: string;
  eventManagerName?: string | null;
  contactName?: string | null;
  contactPhoneNumberE164?: string | null;
  specialRequirements?: string | null;
}

export interface DiaryResponse {
  view: string;
  windowStart: string;
  windowEnd: string;
  spaces: DiarySpaceDto[];
  events: DiaryEventDto[];
}

export interface MoveDiaryEventRequest {
  eventType: 'Enquiry' | 'Appointment' | 'VenueEvent';
  eventId: string;
  targetSpaceId: string;
  newStartUtc: string;
  newEndUtc: string;
}

export interface OperationsDiaryItemDto {
  enquiryId: string;
  reference: string;
  eventName: string;
  spaceName: string;
  startUtc: string;
  endUtc: string;
  covers: number;
  eventStyle?: string | null;
  setupRequirements?: string | null;
}

export interface OperationsDayColumnDto {
  label: string;
  date: string;
  items: OperationsDiaryItemDto[];
}

export interface OperationsOverviewResponse {
  columns: OperationsDayColumnDto[];
}

export interface ProposalListItemDto {
  id: string;
  enquiryId: string;
  venueId: string;
  enquiryReference: string;
  clientName: string;
  eventType: string;
  eventStartUtc: string;
  version: string;
  status: string;
  totalAmount: number;
  currencyCode: string;
  validUntilDate?: string | null;
  createdAtUtc: string;
  sentAtUtc?: string | null;
  lastViewedAtUtc?: string | null;
  createdByName?: string | null;
  isLatestVersion: boolean;
}

export interface ProposalListResponse {
  page: PagedResult<ProposalListItemDto>;
  statusCounts: Record<string, number>;
}

export interface ProposalVatBreakdownDto {
  vatRate: number;
  vatAmount: number;
}

export interface ProposalLineItemDto {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitPriceExclVat: number;
  discountPercent: number;
  discountAmount: number;
  subtotalExclVat: number;
  vatRate: number;
  vatAmount: number;
  totalInclVat: number;
}

export interface ProposalVersionSummaryDto {
  id: string;
  version: string;
  status: string;
  totalAmount: number;
  createdAtUtc: string;
  sentAtUtc?: string | null;
  lastViewedAtUtc?: string | null;
  acceptedAtUtc?: string | null;
  isLatestVersion: boolean;
}

export interface ProposalDocumentDto {
  id: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  createdAtUtc: string;
}

export interface ProposalDetailResponse {
  id: string;
  enquiryId: string;
  venueId: string;
  enquiryReference: string;
  clientName: string;
  eventType: string;
  version: string;
  status: string;
  title?: string | null;
  validUntilDate?: string | null;
  termsVersion: string;
  introduction?: string | null;
  subtotalExclVat: number;
  serviceChargeAmount: number;
  totalVat: number;
  totalAmount: number;
  currencyCode: string;
  vatBreakdown: ProposalVatBreakdownDto[];
  lineItems: ProposalLineItemDto[];
  versions: ProposalVersionSummaryDto[];
  documents: ProposalDocumentDto[];
  portalLink?: string | null;
  createdAtUtc: string;
  sentAtUtc?: string | null;
  lastViewedAtUtc?: string | null;
  acceptedAtUtc?: string | null;
  acceptedByName?: string | null;
  isLatestVersion: boolean;
  isEditable: boolean;
}

export interface CreateProposalLineItemRequest {
  category: string;
  description: string;
  quantity: number;
  unit?: string;
  unitPriceExclVat: number;
  vatRate: number;
  discountPercent?: number;
  discountAmount?: number;
}

export interface CreateProposalRequest {
  title?: string;
  validUntilDate?: string;
  introduction?: string;
  termsVersion?: string;
  currencyCode: string;
  serviceChargePercent?: number;
  lineItems: CreateProposalLineItemRequest[];
}

export interface SendProposalRequest {
  clientEmail: string;
  message?: string;
  portalBaseUrl?: string;
}

export interface SendProposalResponse {
  proposalId: string;
  version: string;
  status: string;
  portalLink: string;
  sentAtUtc: string;
}

export interface DuplicateProposalResponse {
  proposalId: string;
  version: string;
}

export interface ProposalComparisonLineDto {
  description: string;
  leftTotal: number;
  rightTotal: number;
  delta: number;
  changeType: string;
}

export interface ProposalComparisonResponse {
  leftProposalId: string;
  rightProposalId: string;
  leftTotal: number;
  rightTotal: number;
  totalDelta: number;
  lineDeltas: ProposalComparisonLineDto[];
}

export interface ProposalTemplateOptionDto {
  key: string;
  label: string;
  eventType: string;
  defaultLineItems: CreateProposalLineItemRequest[];
  defaultIntroduction?: string | null;
  defaultTermsVersion?: string | null;
  defaultValidityDays: number;
}

export interface PaymentProgressDto {
  paidAmount: number;
  totalAmount: number;
  percent: number;
  statusColor: string;
  hasOverdue: boolean;
  hasDueSoon: boolean;
}

export interface PlanningMilestoneDto {
  key: string;
  label: string;
  complete: boolean;
}

export interface PlanningProgressDto {
  completed: number;
  total: number;
  percent: number;
  milestones: PlanningMilestoneDto[];
}

export interface PaymentMilestoneDto {
  id: string;
  label: string;
  dueDate: string;
  amount: number;
  currencyCode: string;
  amountPaid: number;
  balanceRemaining: number;
  status: string;
  isOverdue: boolean;
  isDueSoon: boolean;
  paymentLink?: string | null;
}

export interface PaymentTransactionDto {
  id: string;
  milestoneId: string;
  provider: string;
  providerReference?: string | null;
  amount: number;
  currencyCode: string;
  paidAtUtc: string;
  notes?: string | null;
  isRefund: boolean;
  reversesTransactionId?: string | null;
}

export interface PaymentScheduleResponse {
  enquiryId: string;
  scheduleId?: string | null;
  scheduleName?: string | null;
  proposalTotal: number;
  totalPaid: number;
  totalOutstanding: number;
  nextDueDate?: string | null;
  currencyCode: string;
  paymentProgress: PaymentProgressDto;
  planningProgress: PlanningProgressDto;
  milestones: PaymentMilestoneDto[];
  transactions: PaymentTransactionDto[];
}

export interface PaymentLinkResponse {
  milestoneId: string;
  paymentUrl: string;
  expiresAtUtc: string;
  providerReference: string;
}

export interface PaymentWidgetsResponse {
  totalOutstanding: number;
  upcoming: {
    sevenDays: number;
    fourteenDays: number;
    thirtyDays: number;
  };
  monthlyReceived: {
    amount: number;
    yearOnYearPercent: number;
  };
  overdue: {
    count: number;
    amount: number;
  };
}

export interface DashboardKpiCardDto {
  key: string;
  label: string;
  value: number;
  displayValue: string;
  deltaPercent: number;
  secondaryText: string;
  clickRoute: string;
}

export interface PipelineStageDto {
  label: string;
  count: number;
  value: number;
  currencyCode: string;
}

export interface PipelineWidgetDto {
  tentative: PipelineStageDto;
  openProposals: PipelineStageDto;
  provisional: PipelineStageDto;
  confirmed: PipelineStageDto;
  averageConversionRatePercent: number;
}

export interface UpcomingPaymentsWidgetDto {
  overdueAmount: number;
  overdueCount: number;
  sevenDaysAmount: number;
  fourteenDaysAmount: number;
  thirtyDaysAmount: number;
  currencyCode: string;
}

export interface ActivityFeedItemDto {
  id: string;
  actionType: string;
  entityType: string;
  entityId: string;
  summary?: string | null;
  createdAtUtc: string;
  userName?: string | null;
  linkRoute?: string | null;
}

export interface UpcomingEventDto {
  enquiryId: string;
  enquiryReference: string;
  eventName: string;
  clientName: string;
  eventStartUtc: string;
  eventEndUtc?: string | null;
  spaceName?: string | null;
  guests: number;
  status: string;
}

export interface TaskDueDto {
  taskId: string;
  enquiryId: string;
  enquiryReference: string;
  title: string;
  priority: string;
  dueDate?: string | null;
  isOverdue: boolean;
}

export interface ActionRequiredWidgetDto {
  inactiveEnquiries: number;
  unassignedEnquiries: number;
  expiringHolds: number;
  total: number;
}

export interface DashboardResponse {
  kpis: DashboardKpiCardDto[];
  pipeline: PipelineWidgetDto;
  upcomingPayments: UpcomingPaymentsWidgetDto;
  recentActivity: ActivityFeedItemDto[];
  upcomingEvents: UpcomingEventDto[];
  tasksDueToday: TaskDueDto[];
  actionRequired: ActionRequiredWidgetDto;
  degradedMode: boolean;
  warnings: string[];
}

export interface ConnectTimelineItemDto {
  id: string;
  enquiryId: string;
  enquiryReference: string;
  contactName: string;
  type: string;
  direction: string;
  isInternal: boolean;
  subject?: string | null;
  preview: string;
  fromAddress?: string | null;
  toAddresses?: string | null;
  ccAddresses?: string | null;
  occurredAtUtc: string;
  attachmentCount: number;
  trackingStatus: string;
  createdByUserId?: string | null;
  createdByName?: string | null;
}

export interface ConnectTimelineResponse {
  page: PagedResult<ConnectTimelineItemDto>;
  unmatchedEmailCount: number;
  unreadMentionCount: number;
}

export interface UnmatchedEmailDto {
  id: string;
  venueId: string;
  fromAddress: string;
  subject: string;
  preview: string;
  receivedAtUtc: string;
}

export interface ConnectInboxResponse {
  items: UnmatchedEmailDto[];
}

export interface ChatChannelDto {
  id: string;
  name: string;
  slug: string;
  isPrivate: boolean;
  isDirectMessage: boolean;
  venueId?: string | null;
  unreadCount: number;
  lastMessagePreview?: string | null;
  lastMessageAtUtc?: string | null;
}

export interface ConnectChannelListResponse {
  channels: ChatChannelDto[];
}

export interface ChatMessageDto {
  id: string;
  channelId: string;
  senderUserId: string;
  senderName: string;
  body: string;
  mentionedUserIds: string[];
  createdAtUtc: string;
  isSystemMessage: boolean;
}

export interface ChatThreadResponse {
  channel: ChatChannelDto;
  messages: ChatMessageDto[];
}

export interface GlobalSearchResultDto {
  type: string;
  entityId: string;
  primaryText: string;
  secondaryText?: string | null;
  route: string;
  venueId: string;
}

export interface GlobalSearchGroupDto {
  type: string;
  results: GlobalSearchResultDto[];
}

export interface GlobalSearchSuggestResponse {
  groups: GlobalSearchGroupDto[];
  recentSearches: string[];
}

export interface GlobalSearchResultsResponse {
  page: PagedResult<GlobalSearchResultDto>;
  appliedTypes: string[];
}

export interface TaskItemDto {
  id: string;
  enquiryId: string;
  enquiryReference: string;
  title: string;
  description?: string | null;
  priority: string;
  status: string;
  dueDate?: string | null;
  assignedUserId?: string | null;
  assignedUserName?: string | null;
  createdByUserId?: string | null;
  createdByUserName?: string | null;
  createdAtUtc: string;
  completedAtUtc?: string | null;
}

export interface TaskSummaryDto {
  total: number;
  dueToday: number;
  overdue: number;
  completed: number;
}

export interface TaskListResponse {
  items: TaskItemDto[];
  summary: TaskSummaryDto;
}

export interface TaskTemplateItemDto {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  dueDateRule: string;
  dueOffsetDays: number;
}

export interface TaskTemplateDto {
  id: string;
  venueId: string;
  name: string;
  eventType: string;
  triggerStatus: string;
  assignToEventManager: boolean;
  items: TaskTemplateItemDto[];
}

export interface TaskTemplateResponse {
  templates: TaskTemplateDto[];
}

export interface NotificationItemDto {
  id: string;
  triggerKey: string;
  title: string;
  body: string;
  linkUrl?: string | null;
  isRead: boolean;
  createdAtUtc: string;
  readAtUtc?: string | null;
}

export interface NotificationListResponse {
  unreadCount: number;
  items: NotificationItemDto[];
}

export interface NotificationPreferenceDto {
  id: string;
  triggerKey: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
}

export interface NotificationPreferencesResponse {
  preferences: NotificationPreferenceDto[];
}

export interface ReportDefinitionDto {
  key: string;
  name: string;
  description: string;
}

export interface ReportsCatalogResponse {
  reports: ReportDefinitionDto[];
}

export interface ReportPointDto {
  x: string;
  y: number;
}

export interface ReportSeriesDto {
  label: string;
  points: ReportPointDto[];
}

export interface ReportResponse {
  key: string;
  name: string;
  generatedAtUtc: string;
  columns: string[];
  rows: Record<string, unknown>[];
  series: ReportSeriesDto[];
  note?: string | null;
}

export interface ReportScheduleDto {
  id: string;
  name: string;
  reportKey: string;
  frequency: string;
  recipients: string[];
  isActive: boolean;
  lastRunAtUtc?: string | null;
  nextRunAtUtc?: string | null;
  venueId?: string | null;
}

export interface ReportSchedulesResponse {
  items: ReportScheduleDto[];
}

export interface SnapshotRunResponse {
  snapshotDate: string;
  rowsInserted: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>('/api/health');
  }

  getVenues(): Observable<VenueSummaryDto[]> {
    return this.http.get<VenueSummaryDto[]>('/api/venues');
  }

  getVenueProfile(venueId: string): Observable<VenueProfileDto> {
    return this.http.get<VenueProfileDto>(`/api/venues/${venueId}`);
  }

  updateVenueProfile(venueId: string, payload: UpdateVenueProfileRequest): Observable<VenueProfileDto> {
    return this.http.put<VenueProfileDto>(`/api/venues/${venueId}`, payload);
  }

  getVenueSpaces(venueId: string): Observable<SpaceSummaryDto[]> {
    return this.http.get<SpaceSummaryDto[]>(`/api/venues/${venueId}/spaces`);
  }

  createVenueSpace(venueId: string, payload: UpsertSpaceRequest): Observable<SpaceSummaryDto> {
    return this.http.post<SpaceSummaryDto>(`/api/venues/${venueId}/spaces`, payload);
  }

  updateVenueSpace(venueId: string, spaceId: string, payload: UpsertSpaceRequest): Observable<SpaceSummaryDto> {
    return this.http.put<SpaceSummaryDto>(`/api/venues/${venueId}/spaces/${spaceId}`, payload);
  }

  getSpaceCombinations(venueId: string): Observable<SpaceCombinationDto[]> {
    return this.http.get<SpaceCombinationDto[]>(`/api/venues/${venueId}/space-combinations`);
  }

  createSpaceCombination(venueId: string, payload: UpsertSpaceCombinationRequest): Observable<SpaceCombinationDto> {
    return this.http.post<SpaceCombinationDto>(`/api/venues/${venueId}/space-combinations`, payload);
  }

  updateSpaceCombination(venueId: string, combinationId: string, payload: UpsertSpaceCombinationRequest): Observable<SpaceCombinationDto> {
    return this.http.put<SpaceCombinationDto>(`/api/venues/${venueId}/space-combinations/${combinationId}`, payload);
  }

  getVenueBudgets(venueId: string, year: number): Observable<BudgetMonthDto[]> {
    const params = new HttpParams().set('year', year);
    return this.http.get<BudgetMonthDto[]>(`/api/venues/${venueId}/budgets`, { params });
  }

  upsertVenueBudgetMonth(
    venueId: string,
    year: number,
    month: number,
    payload: UpsertBudgetMonthRequest
  ): Observable<BudgetMonthDto> {
    return this.http.put<BudgetMonthDto>(`/api/venues/${venueId}/budgets/${year}/${month}`, payload);
  }

  importVenueBudgetsCsv(venueId: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`/api/venues/${venueId}/budgets/import-csv`, formData);
  }

  getUsers(venueId?: string): Observable<UserSummaryDto[]> {
    let params = new HttpParams();
    if (venueId) {
      params = params.set('venueId', venueId);
    }
    return this.http.get<UserSummaryDto[]>('/api/users', { params });
  }

  inviteUser(payload: InviteUserRequest): Observable<InviteUserResponse> {
    return this.http.post<InviteUserResponse>('/api/users/invite', payload);
  }

  updateUserStatus(userId: string, isActive: boolean): Observable<void> {
    return this.http.patch<void>(`/api/users/${userId}/status`, { isActive });
  }

  updateUserPassword(userId: string, password: string): Observable<void> {
    return this.http.patch<void>(`/api/users/${userId}/password`, { password });
  }

  getUserActivity(take = 50): Observable<UserActivityItemDto[]> {
    const params = new HttpParams().set('take', take);
    return this.http.get<UserActivityItemDto[]>('/api/users/activity', { params });
  }

  getPaymentScheduleTemplates(venueId: string): Observable<PaymentScheduleTemplateSettingDto[]> {
    return this.http.get<PaymentScheduleTemplateSettingDto[]>(`/api/venues/${venueId}/settings/payment-schedule-templates`);
  }

  upsertPaymentScheduleTemplates(
    venueId: string,
    templates: PaymentScheduleTemplateSettingDto[]
  ): Observable<PaymentScheduleTemplateSettingDto[]> {
    return this.http.put<PaymentScheduleTemplateSettingDto[]>(
      `/api/venues/${venueId}/settings/payment-schedule-templates`,
      { templates }
    );
  }

  getTermsDocuments(venueId: string): Observable<TermsDocumentSettingDto[]> {
    return this.http.get<TermsDocumentSettingDto[]>(`/api/venues/${venueId}/settings/terms-documents`);
  }

  upsertTermsDocuments(venueId: string, documents: TermsDocumentSettingDto[]): Observable<TermsDocumentSettingDto[]> {
    return this.http.put<TermsDocumentSettingDto[]>(`/api/venues/${venueId}/settings/terms-documents`, { documents });
  }

  getVenueProposalTemplates(venueId: string): Observable<ProposalTemplateSettingDto[]> {
    return this.http.get<ProposalTemplateSettingDto[]>(`/api/venues/${venueId}/settings/proposal-templates`);
  }

  upsertVenueProposalTemplates(venueId: string, templates: ProposalTemplateSettingDto[]): Observable<ProposalTemplateSettingDto[]> {
    return this.http.put<ProposalTemplateSettingDto[]>(`/api/venues/${venueId}/settings/proposal-templates`, { templates });
  }

  getPlanningMilestones(venueId: string): Observable<PlanningMilestoneSettingDto[]> {
    return this.http.get<PlanningMilestoneSettingDto[]>(`/api/venues/${venueId}/settings/planning-milestones`);
  }

  upsertPlanningMilestones(venueId: string, milestones: PlanningMilestoneSettingDto[]): Observable<PlanningMilestoneSettingDto[]> {
    return this.http.put<PlanningMilestoneSettingDto[]>(`/api/venues/${venueId}/settings/planning-milestones`, { milestones });
  }

  getReportConfiguration(venueId: string): Observable<ReportConfigurationSettingDto> {
    return this.http.get<ReportConfigurationSettingDto>(`/api/venues/${venueId}/settings/report-configuration`);
  }

  upsertReportConfiguration(venueId: string, config: ReportConfigurationSettingDto): Observable<ReportConfigurationSettingDto> {
    return this.http.put<ReportConfigurationSettingDto>(`/api/venues/${venueId}/settings/report-configuration`, config);
  }

  getAutomationSettings(venueId: string): Observable<AutomationSettingsDto> {
    return this.http.get<AutomationSettingsDto>(`/api/venues/${venueId}/settings/automation`);
  }

  upsertAutomationSettings(venueId: string, config: AutomationSettingsDto): Observable<AutomationSettingsDto> {
    return this.http.put<AutomationSettingsDto>(`/api/venues/${venueId}/settings/automation`, config);
  }

  getEmailTemplates(venueId: string): Observable<VenueEmailTemplateDto[]> {
    return this.http.get<VenueEmailTemplateDto[]>(`/api/venues/${venueId}/settings/email-templates`);
  }

  upsertEmailTemplates(venueId: string, templates: VenueEmailTemplateDto[]): Observable<VenueEmailTemplateDto[]> {
    return this.http.put<VenueEmailTemplateDto[]>(`/api/venues/${venueId}/settings/email-templates`, { templates });
  }

  getWebsiteForms(venueId: string): Observable<WebsiteFormSettingDto[]> {
    return this.http.get<WebsiteFormSettingDto[]>(`/api/venues/${venueId}/settings/website-forms`);
  }

  upsertWebsiteForms(venueId: string, forms: WebsiteFormSettingDto[]): Observable<WebsiteFormSettingDto[]> {
    return this.http.put<WebsiteFormSettingDto[]>(`/api/venues/${venueId}/settings/website-forms`, { forms });
  }

  getCalendarAccounts(venueId: string): Observable<CalendarAccountSettingDto[]> {
    return this.http.get<CalendarAccountSettingDto[]>(`/api/venues/${venueId}/settings/calendar-accounts`);
  }

  upsertCalendarAccounts(venueId: string, accounts: CalendarAccountSettingDto[]): Observable<CalendarAccountSettingDto[]> {
    return this.http.put<CalendarAccountSettingDto[]>(`/api/venues/${venueId}/settings/calendar-accounts`, { accounts });
  }

  getVenueEmailAccounts(venueId: string): Observable<VenueEmailAccountDto[]> {
    return this.http.get<VenueEmailAccountDto[]>(`/api/venues/${venueId}/email-accounts`);
  }

  createVenueEmailAccount(
    venueId: string,
    payload: {
      address: string;
      provider: string;
      externalAccountReference?: string;
      isActive: boolean;
      useForOutbound: boolean;
    }
  ): Observable<VenueEmailAccountDto> {
    return this.http.post<VenueEmailAccountDto>(`/api/venues/${venueId}/email-accounts`, payload);
  }

  updateVenueEmailAccount(
    venueId: string,
    accountId: string,
    payload: {
      address: string;
      provider: string;
      externalAccountReference?: string;
      isActive: boolean;
      useForOutbound: boolean;
    }
  ): Observable<VenueEmailAccountDto> {
    return this.http.put<VenueEmailAccountDto>(`/api/venues/${venueId}/email-accounts/${accountId}`, payload);
  }

  deleteVenueEmailAccount(venueId: string, accountId: string): Observable<void> {
    return this.http.delete<void>(`/api/venues/${venueId}/email-accounts/${accountId}`);
  }

  getRecentEnquiries(): Observable<RecentlyViewedDto[]> {
    return this.http.get<RecentlyViewedDto[]>('/api/enquiries/recent');
  }

  getEnquiries(params: {
    venueId: string;
    statusTab?: string;
    period?: string;
    eventManagerUserId?: string;
    eventType?: string;
    eventStyle?: string;
    source?: string;
    quickFilter?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Observable<EnquiryListResponse> {
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

    return this.http.get<EnquiryListResponse>('/api/enquiries', { params: queryParams });
  }

  createEnquiry(payload: CreateEnquiryRequest): Observable<EnquiryDetailResponse> {
    return this.http.post<EnquiryDetailResponse>('/api/enquiries', payload);
  }

  getEnquiry(enquiryId: string): Observable<EnquiryDetailResponse> {
    return this.http.get<EnquiryDetailResponse>(`/api/enquiries/${enquiryId}`);
  }

  transitionEnquiryStatus(
    enquiryId: string,
    payload: { targetStatus: string; lostReason?: string; lostReasonDetail?: string; holdDaysOverride?: number }
  ): Observable<void> {
    return this.http.post<void>(`/api/enquiries/${enquiryId}/status-transition`, payload);
  }

  getAvailability(venueId: string, date: string): Observable<AvailabilitySidebarResponse> {
    const params = new HttpParams().set('venueId', venueId).set('date', date);
    return this.http.get<AvailabilitySidebarResponse>('/api/enquiries/availability', { params });
  }

  getDiary(params: {
    venueId: string;
    view: 'day' | 'week' | 'month' | 'list';
    startDate?: string;
  }): Observable<DiaryResponse> {
    let queryParams = new HttpParams().set('venueId', params.venueId).set('view', params.view);
    if (params.startDate) {
      queryParams = queryParams.set('startDate', params.startDate);
    }

    return this.http.get<DiaryResponse>('/api/diary', { params: queryParams });
  }

  moveDiaryEvent(payload: MoveDiaryEventRequest): Observable<void> {
    return this.http.put<void>('/api/diary/move', payload);
  }

  getOperationsOverview(venueId: string): Observable<OperationsOverviewResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<OperationsOverviewResponse>('/api/operations/overview', { params });
  }

  getProposals(params: {
    venueId: string;
    status?: string;
    eventType?: string;
    dateFrom?: string;
    dateTo?: string;
    valueMin?: number;
    valueMax?: number;
    operatorUserId?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Observable<ProposalListResponse> {
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

    return this.http.get<ProposalListResponse>('/api/proposals', { params: queryParams });
  }

  getEnquiryProposals(enquiryId: string): Observable<ProposalListItemDto[]> {
    return this.http.get<ProposalListItemDto[]>(`/api/enquiries/${enquiryId}/proposals`);
  }

  getProposal(proposalId: string): Observable<ProposalDetailResponse> {
    return this.http.get<ProposalDetailResponse>(`/api/proposals/${proposalId}`);
  }

  createProposal(enquiryId: string, payload: CreateProposalRequest): Observable<ProposalDetailResponse> {
    return this.http.post<ProposalDetailResponse>(`/api/enquiries/${enquiryId}/proposals`, payload);
  }

  updateProposal(proposalId: string, payload: CreateProposalRequest): Observable<ProposalDetailResponse> {
    return this.http.put<ProposalDetailResponse>(`/api/proposals/${proposalId}`, payload);
  }

  duplicateProposal(proposalId: string): Observable<DuplicateProposalResponse> {
    return this.http.post<DuplicateProposalResponse>(`/api/proposals/${proposalId}/duplicate`, {});
  }

  sendProposal(proposalId: string, payload: SendProposalRequest): Observable<SendProposalResponse> {
    return this.http.post<SendProposalResponse>(`/api/proposals/${proposalId}/send`, payload);
  }

  compareProposals(proposalId: string, otherProposalId: string): Observable<ProposalComparisonResponse> {
    return this.http.get<ProposalComparisonResponse>(`/api/proposals/${proposalId}/compare/${otherProposalId}`);
  }

  getProposalTemplateOptions(venueId: string, eventType?: string): Observable<ProposalTemplateOptionDto[]> {
    let params = new HttpParams().set('venueId', venueId);
    if (eventType) {
      params = params.set('eventType', eventType);
    }

    return this.http.get<ProposalTemplateOptionDto[]>('/api/proposals/template-options', { params });
  }

  getPaymentSchedule(enquiryId: string): Observable<PaymentScheduleResponse> {
    return this.http.get<PaymentScheduleResponse>(`/api/enquiries/${enquiryId}/payments`);
  }

  createPaymentLink(milestoneId: string, payload: { returnUrl?: string; cancelUrl?: string }): Observable<PaymentLinkResponse> {
    return this.http.post<PaymentLinkResponse>(`/api/payment-milestones/${milestoneId}/payment-link`, payload);
  }

  recordPayment(
    milestoneId: string,
    payload: {
      amount: number;
      currencyCode: string;
      method: string;
      reference?: string;
      receivedAtUtc?: string;
      notes?: string;
      applyOverpaymentToNextMilestone: boolean;
    }
  ): Observable<PaymentScheduleResponse> {
    return this.http.post<PaymentScheduleResponse>(`/api/payment-milestones/${milestoneId}/record`, payload);
  }

  refundPayment(transactionId: string, payload: { amount: number; reason: string }): Observable<PaymentTransactionDto> {
    return this.http.post<PaymentTransactionDto>(`/api/payment-transactions/${transactionId}/refund`, payload);
  }

  getFinancialWidgets(venueId: string): Observable<PaymentWidgetsResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<PaymentWidgetsResponse>('/api/financial/widgets', { params });
  }

  getDashboard(venueId: string, period: '7d' | '30d' | '90d' = '30d'): Observable<DashboardResponse> {
    const params = new HttpParams().set('venueId', venueId).set('period', period);
    return this.http.get<DashboardResponse>('/api/dashboard', { params });
  }

  getConnectTimeline(params: {
    venueId: string;
    enquiryId?: string;
    type?: 'all' | 'emails' | 'notes' | 'system';
    search?: string;
    page?: number;
    pageSize?: number;
  }): Observable<ConnectTimelineResponse> {
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

    return this.http.get<ConnectTimelineResponse>('/api/connect/timeline', { params: queryParams });
  }

  addInternalNote(enquiryId: string, payload: { body: string; mentionedUserIds?: string[] }): Observable<ConnectTimelineItemDto> {
    return this.http.post<ConnectTimelineItemDto>(`/api/connect/enquiries/${enquiryId}/notes`, payload);
  }

  sendConnectEmail(
    enquiryId: string,
    payload: {
      venueId: string;
      to: string;
      cc?: string;
      bcc?: string;
      subject: string;
      body: string;
      fromAddress?: string;
      attachmentDocumentIds?: string[];
    }
  ): Observable<{ communicationId: string; sentAtUtc: string; trackingStatus: string }> {
    return this.http.post<{ communicationId: string; sentAtUtc: string; trackingStatus: string }>(
      `/api/connect/enquiries/${enquiryId}/emails`,
      payload
    );
  }

  getUnmatchedInbox(venueId: string): Observable<ConnectInboxResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<ConnectInboxResponse>('/api/connect/inbox/unmatched', { params });
  }

  linkUnmatchedInboxItem(inboundEmailId: string, enquiryId: string): Observable<void> {
    return this.http.post<void>(`/api/connect/inbox/unmatched/${inboundEmailId}/link`, { enquiryId });
  }

  getChatChannels(venueId?: string): Observable<ConnectChannelListResponse> {
    let params = new HttpParams();
    if (venueId) {
      params = params.set('venueId', venueId);
    }
    return this.http.get<ConnectChannelListResponse>('/api/connect/channels', { params });
  }

  createChatChannel(payload: {
    name: string;
    venueId?: string;
    isPrivate: boolean;
    isDirectMessage: boolean;
    memberUserIds: string[];
  }): Observable<ChatChannelDto> {
    return this.http.post<ChatChannelDto>('/api/connect/channels', payload);
  }

  getChatThread(channelId: string): Observable<ChatThreadResponse> {
    return this.http.get<ChatThreadResponse>(`/api/connect/channels/${channelId}`);
  }

  sendChatMessage(channelId: string, payload: { body: string; mentionedUserIds?: string[] }): Observable<ChatMessageDto> {
    return this.http.post<ChatMessageDto>(`/api/connect/channels/${channelId}/messages`, payload);
  }

  markChatRead(channelId: string): Observable<void> {
    return this.http.post<void>(`/api/connect/channels/${channelId}/read`, {});
  }

  searchSuggest(venueId: string, query: string): Observable<GlobalSearchSuggestResponse> {
    const params = new HttpParams().set('venueId', venueId).set('q', query);
    return this.http.get<GlobalSearchSuggestResponse>('/api/search/suggest', { params });
  }

  searchResults(params: {
    venueId: string;
    query: string;
    types?: string[];
    page?: number;
    pageSize?: number;
  }): Observable<GlobalSearchResultsResponse> {
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
    return this.http.get<GlobalSearchResultsResponse>('/api/search/results', { params: queryParams });
  }

  getTasks(params: {
    venueId: string;
    enquiryId?: string;
    assignedUserId?: string;
    status?: string;
    due?: 'today' | 'overdue' | 'upcoming';
  }): Observable<TaskListResponse> {
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
    return this.http.get<TaskListResponse>('/api/tasks', { params: queryParams });
  }

  createTask(
    enquiryId: string,
    payload: { title: string; description?: string; assignedUserId?: string; dueDate?: string; priority: string; status: string }
  ): Observable<TaskItemDto> {
    return this.http.post<TaskItemDto>(`/api/enquiries/${enquiryId}/tasks`, payload);
  }

  updateTask(
    taskId: string,
    payload: { title: string; description?: string; assignedUserId?: string; dueDate?: string; priority: string; status: string }
  ): Observable<TaskItemDto> {
    return this.http.put<TaskItemDto>(`/api/tasks/${taskId}`, payload);
  }

  getTaskTemplates(venueId: string): Observable<TaskTemplateResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<TaskTemplateResponse>('/api/task-templates', { params });
  }

  upsertTaskTemplate(
    venueId: string,
    payload: {
      name: string;
      eventType: string;
      triggerStatus: string;
      assignToEventManager: boolean;
      items: { title: string; description?: string; priority: string; dueDateRule: string; dueOffsetDays: number }[];
    },
    templateId?: string
  ): Observable<TaskTemplateDto> {
    let params = new HttpParams().set('venueId', venueId);
    if (templateId) {
      params = params.set('templateId', templateId);
    }
    return this.http.post<TaskTemplateDto>('/api/task-templates', payload, { params });
  }

  deleteTaskTemplate(templateId: string): Observable<void> {
    return this.http.delete<void>(`/api/task-templates/${templateId}`);
  }

  getNotifications(venueId?: string, take = 30): Observable<NotificationListResponse> {
    let params = new HttpParams().set('take', take);
    if (venueId) {
      params = params.set('venueId', venueId);
    }
    return this.http.get<NotificationListResponse>('/api/notifications', { params });
  }

  markNotificationsRead(payload: { notificationIds?: string[]; markAll: boolean }): Observable<void> {
    return this.http.post<void>('/api/notifications/read', payload);
  }

  getNotificationPreferences(): Observable<NotificationPreferencesResponse> {
    return this.http.get<NotificationPreferencesResponse>('/api/notifications/preferences');
  }

  upsertNotificationPreference(payload: {
    triggerKey: string;
    inAppEnabled: boolean;
    emailEnabled: boolean;
  }): Observable<NotificationPreferenceDto> {
    return this.http.post<NotificationPreferenceDto>('/api/notifications/preferences', payload);
  }

  getReportsCatalog(): Observable<ReportsCatalogResponse> {
    return this.http.get<ReportsCatalogResponse>('/api/reports');
  }

  getReport(
    reportKey: string,
    params: { venueId: string; from?: string; to?: string; eventType?: string; status?: string }
  ): Observable<ReportResponse> {
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
    return this.http.get<ReportResponse>(`/api/reports/${reportKey}`, { params: queryParams });
  }

  exportReport(reportKey: string, params: { venueId: string; format: 'csv' | 'xlsx' | 'pdf'; from?: string; to?: string }): Observable<Blob> {
    let queryParams = new HttpParams().set('venueId', params.venueId).set('format', params.format);
    if (params.from) {
      queryParams = queryParams.set('from', params.from);
    }
    if (params.to) {
      queryParams = queryParams.set('to', params.to);
    }
    return this.http.get(`/api/reports/${reportKey}/export`, { params: queryParams, responseType: 'blob' });
  }

  getReportSchedules(venueId: string): Observable<ReportSchedulesResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<ReportSchedulesResponse>('/api/reports/schedules', { params });
  }

  upsertReportSchedule(
    venueId: string,
    payload: {
      name: string;
      reportKey: string;
      frequency: string;
      recipients: string[];
      isActive: boolean;
      nextRunAtUtc?: string;
      venueId?: string;
      filtersJson?: string;
    },
    scheduleId?: string
  ): Observable<ReportScheduleDto> {
    let params = new HttpParams().set('venueId', venueId);
    if (scheduleId) {
      params = params.set('scheduleId', scheduleId);
    }
    return this.http.post<ReportScheduleDto>('/api/reports/schedules', payload, { params });
  }

  deleteReportSchedule(scheduleId: string): Observable<void> {
    return this.http.delete<void>(`/api/reports/schedules/${scheduleId}`);
  }

  runPipelineSnapshot(venueId: string): Observable<SnapshotRunResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.post<SnapshotRunResponse>('/api/reports/pipeline-snapshot/run', {}, { params });
  }
}
