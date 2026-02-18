import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface HealthStatus {
  status: string;
}

export interface VenueSummaryDto {
  id: string;
  name: string;
  timeZone: string;
  currencyCode: string;
}

export interface CreateVenueRequest {
  name: string;
  timeZone?: string | null;
  currencyCode?: string | null;
  locale?: string | null;
  countryCode?: string | null;
  enquiriesEmail?: string | null;
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

export interface EventsHubMenuRequirementDto {
  menuName: string;
  quantity: number;
}

export interface EventsHubAllergenSummaryDto {
  allergen: string;
  count: number;
}

export interface EventsHubEventDto {
  id: string;
  venueId: string;
  name: string;
  type: string;
  startUtc: string;
  endUtc: string;
  description?: string | null;
  status: 'Planned' | 'Confirmed' | 'Completed' | 'Cancelled';
  capacity?: number | null;
  spaceIds: string[];
  registrationLimit?: number | null;
  listingStatus: 'Draft' | 'Published';
  isPaid: boolean;
  ticketPrice?: number | null;
  currencyCode: string;
  hasEarlyBird: boolean;
  earlyBirdPrice?: number | null;
  earlyBirdEndsOn?: string | null;
  featuredImageUrl?: string | null;
  publishState: 'NotPublished' | 'Queued' | 'Published' | 'Failed';
  publishMessage?: string | null;
  creventaListingId?: string | null;
  lastPublishAttemptUtc?: string | null;
  lastSyncAtUtc?: string | null;
  attendeeCount: number;
  checkedInCount: number;
  ticketSalesCount: number;
  ticketRevenue: number;
  leadConversions: number;
  menuRequirements: EventsHubMenuRequirementDto[];
  allergenSummary: EventsHubAllergenSummaryDto[];
}

export interface UpsertEventsHubEventRequest {
  name: string;
  type: string;
  startUtc: string;
  endUtc: string;
  description?: string | null;
  status: 'Planned' | 'Confirmed' | 'Completed' | 'Cancelled';
  capacity?: number | null;
  spaceIds: string[];
  registrationLimit?: number | null;
  listingStatus: 'Draft' | 'Published';
  isPaid: boolean;
  ticketPrice?: number | null;
  currencyCode: string;
  hasEarlyBird: boolean;
  earlyBirdPrice?: number | null;
  earlyBirdEndsOn?: string | null;
  featuredImageUrl?: string | null;
}

export interface EventsHubAttendeeDto {
  id: string;
  venueEventId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumberE164?: string | null;
  eventInterest?: string | null;
  notes?: string | null;
  followUpStatus: 'Pending' | 'Contacted' | 'Converted' | 'NotInterested' | 'NoResponse';
  convertedEnquiryId?: string | null;
  checkedIn: boolean;
  checkedInAtUtc?: string | null;
  registeredAtUtc: string;
}

export interface UpsertEventsHubAttendeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumberE164?: string | null;
  eventInterest?: string | null;
  notes?: string | null;
  followUpStatus: 'Pending' | 'Contacted' | 'Converted' | 'NotInterested' | 'NoResponse';
}

export interface BulkEventsHubAttendeeFollowUpStatusRequest {
  attendeeIds: string[];
  followUpStatus: 'Pending' | 'Contacted' | 'Converted' | 'NotInterested' | 'NoResponse';
}

export interface BulkEventsHubAttendeeFollowUpStatusResponse {
  updatedCount: number;
}

export interface ImportEventsHubAttendeesResponse {
  importedCount: number;
  skippedCount: number;
  warnings: string[];
}

export interface PublicEventsHubRegistrationEventDto {
  eventId: string;
  venueId: string;
  venueName: string;
  eventName: string;
  eventType: string;
  startUtc: string;
  endUtc: string;
  description?: string | null;
  capacity?: number | null;
  registrationLimit?: number | null;
  currentAttendeeCount: number;
}

export interface PublicEventsHubRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumberE164?: string | null;
  eventInterest?: string | null;
  notes?: string | null;
}

export interface EventsHubPublishResponse {
  eventId: string;
  published: boolean;
  queued: boolean;
  publishState: string;
  message?: string | null;
  creventaListingId?: string | null;
  attemptedAtUtc: string;
}

export interface EventsHubSyncResponse {
  eventId: string;
  success: boolean;
  message: string;
  syncedAtUtc: string;
  ticketSalesCount: number;
  ticketRevenue: number;
  preorderCount: number;
  menuRequirements: EventsHubMenuRequirementDto[];
  allergenSummary: EventsHubAllergenSummaryDto[];
}

export interface EventsHubAnalyticsDto {
  eventId: string;
  capacity: number;
  registrationLimit: number;
  attendeeCount: number;
  checkedInCount: number;
  attendanceRatePercent: number;
  ticketSalesCount: number;
  ticketRevenue: number;
  leadConversions: number;
  leadConversionRatePercent: number;
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

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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

export interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
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

export interface FinancialReferenceSettingsDto {
  invoicePrefix: string;
  creditNotePrefix: string;
  receiptPrefix: string;
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

export interface TermsAndConditionsDto {
  id: string;
  venueId: string;
  seriesId: string;
  name: string;
  contentHtml: string;
  version: number;
  eventTypes: string[];
  isActive: boolean;
  isDraft: boolean;
  createdByUserId?: string | null;
  createdByName?: string | null;
  createdAtUtc: string;
  publishedAtUtc?: string | null;
}

export interface CreateTermsAndConditionsDraftRequest {
  name: string;
  contentHtml: string;
  eventTypes: string[];
  sourceTermsAndConditionsId?: string | null;
}

export interface UpdateTermsAndConditionsDraftRequest {
  name: string;
  contentHtml: string;
  eventTypes: string[];
  isActive: boolean;
}

export interface PublishTermsAndConditionsRequest {
  isActive: boolean;
}

export interface ProposalTemplateLineItemSettingDto {
  sectionType?: string | null;
  sortOrder?: number | null;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitPriceExclVat: number;
  vatRate: number;
  discountPercent: number;
  discountAmount: number;
}

export interface ProposalTemplateSectionSettingDto {
  key: string;
  title: string;
  isEnabled: boolean;
  sortOrder: number;
}

export interface ProposalTemplateSettingDto {
  key: string;
  label: string;
  eventType: string;
  defaultSections?: ProposalTemplateSectionSettingDto[] | null;
  defaultLineItems: ProposalTemplateLineItemSettingDto[];
  defaultIntroduction?: string | null;
  defaultTermsVersion?: string | null;
  defaultValidityDays: number;
}

export interface ProposalPdfSettingsDto {
  paperSize: 'A4' | 'Letter';
}

export interface PlanningMilestoneSettingDto {
  key: string;
  label: string;
  isEnabled: boolean;
}

export interface LostReasonSettingDto {
  id: string;
  label: string;
  isActive: boolean;
  sortOrder: number;
}

export interface SustainabilityEmissionFactorDto {
  key: string;
  label: string;
  kgCo2ePerGuest: number;
}

export interface SustainabilityEnergyRatingFactorDto {
  rating: string;
  multiplier: number;
}

export interface SustainabilitySettingsDto {
  cateringEmissionFactors: SustainabilityEmissionFactorDto[];
  travelKgCo2ePerGuestKm: number;
  energyRatingMultipliers: SustainabilityEnergyRatingFactorDto[];
  carbonTargetKgPerGuest: number;
  wasteTargetKgPerGuest: number;
  diversionTargetPercent: number;
  localSourcingRadiusMiles: number;
  carbonWeightPercent: number;
  wasteWeightPercent: number;
  sourcingWeightPercent: number;
  includeInProposalByDefault: boolean;
}

export interface ReportConfigurationSettingDto {
  provisionalWeightPercent: number;
  tentativeWeightPercent: number;
  openProposalWeightPercent: number;
  responseTimeWeightPercent: number;
  leadSourceWeightPercent: number;
  eventTypeWeightPercent: number;
  engagementWeightPercent: number;
  budgetAlignmentWeightPercent: number;
  leadTimeWeightPercent: number;
  completenessWeightPercent: number;
}

export interface AutomationSettingsDto {
  proposalAcceptedTargetStatus: string;
  followUpInactiveDays: number;
  autoArchiveEnabled: boolean;
  autoArchiveDays: number;
}

export interface AutomationTriggerDto {
  type: string;
  status?: string | null;
  days?: number | null;
}

export interface AutomationConditionDto {
  type: string;
  operator?: string | null;
  value?: string | null;
  amount?: number | null;
}

export interface AutomationActionDto {
  type: string;
  targetStatus?: string | null;
  templateKey?: string | null;
  assigneeUserId?: string | null;
  taskTitle?: string | null;
  taskDueOffsetDays?: number | null;
  note?: string | null;
  notificationUserId?: string | null;
}

export interface AutomationRuleDto {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
  trigger: AutomationTriggerDto;
  conditions: AutomationConditionDto[];
  actions: AutomationActionDto[];
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface AutomationExecutionLogDto {
  id: string;
  timestampUtc: string;
  ruleId: string;
  ruleName: string;
  enquiryReference: string;
  actionTaken: string;
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
  nylasGrantId?: string | null;
  emailAddress?: string | null;
  displayName?: string | null;
  connectedAtUtc?: string | null;
  lastSyncAtUtc?: string | null;
}

export interface NylasStatusDto {
  isConfigured: boolean;
  redirectUri: string;
  defaultProvider: string;
}

export interface CreateNylasConnectUrlRequest {
  venueId: string;
  provider?: string;
  loginHint?: string;
  returnPath?: string;
}

export interface CreateNylasConnectUrlResponse {
  connectUrl: string;
  expiresAtUtc: string;
}

export interface VenueEmailTemplateDto {
  key: string;
  name: string;
  subjectTemplate: string;
  bodyHtmlTemplate: string;
  category?: string | null;
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
  formFields?: WebsiteFormFieldConfigDto[] | null;
  brandingPrimaryColor?: string | null;
  brandingLogoUrl?: string | null;
  gdprCheckboxText?: string | null;
  recaptchaSiteKey?: string | null;
  autoAcknowledgementTemplateId?: string | null;
}

export interface WebsiteFormFieldConfigDto {
  key: string;
  label: string;
  isVisible: boolean;
  isRequired: boolean;
  sortOrder: number;
}

export interface PublicWebsiteFormDto {
  id: string;
  name: string;
  slug: string;
  successMessage: string;
  redirectUrl?: string | null;
  requiredFields: string[];
  optionalFields: string[];
  styleJson?: string | null;
  formFields: WebsiteFormFieldConfigDto[];
  brandingPrimaryColor?: string | null;
  brandingLogoUrl?: string | null;
  gdprCheckboxText?: string | null;
  recaptchaSiteKey?: string | null;
  autoAcknowledgementTemplateId?: string | null;
}

export interface PublicWebsiteFormConfigResponse {
  venueId: string;
  venueName: string;
  defaultFormId?: string | null;
  forms: PublicWebsiteFormDto[];
}

export interface PublicWebsiteEnquirySubmitRequest {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumberE164?: string | null;
  eventType?: string | null;
  eventName?: string | null;
  eventStartUtc?: string | null;
  eventDate?: string | null;
  guestsExpected?: number | null;
  eventStyle?: string | null;
  budgetMinAmount?: number | null;
  budgetMaxAmount?: number | null;
  specialRequirements?: string | null;
  marketingConsent: boolean;
  dataConsent: boolean;
  recaptchaToken?: string | null;
  sourceUrl?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  formId?: string | null;
  formSlug?: string | null;
}

export interface PublicWebsiteEnquirySubmitResponse {
  enquiryId: string;
  enquiryReference: string;
  status: string;
  successMessage: string;
  redirectUrl?: string | null;
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

export interface RecentlyViewedBookingDto {
  enquiryId: string;
  enquiryRef: string;
  clientName: string;
  eventDate?: string | null;
  status?: string | null;
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
  conversionScore?: number | null;
  conversionScoreBand?: string | null;
  conversionTrendDelta?: number | null;
  conversionTrendDirection?: string | null;
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

export interface BulkActionFailureDto {
  enquiryId: string;
  reference: string;
  reason: string;
}

export interface BulkActionResultResponse {
  requested: number;
  succeeded: number;
  failed: BulkActionFailureDto[];
  undoToken?: string | null;
  undoExpiresAtUtc?: string | null;
}

export interface EnquirySelectionResponse {
  totalCount: number;
  enquiryIds: string[];
  isTruncated: boolean;
}

export interface SubEventDto {
  id: string;
  name: string;
  type: string;
  status: string;
  startUtc: string;
  endUtc: string;
  guestCount: number;
  setupStyle?: string | null;
  specialRequirements?: string | null;
  priceAmount?: number | null;
  currencyCode: string;
  spaceIds: string[];
}

export interface UpsertSubEventRequest {
  name: string;
  type: string;
  status?: string | null;
  startUtc: string;
  endUtc: string;
  guestCount: number;
  setupStyle?: string | null;
  specialRequirements?: string | null;
  priceAmount?: number | null;
  currencyCode: string;
  spaceIds: string[];
  allowConflictOverride?: boolean;
}

export interface SubEventConflictDto {
  type: string;
  id: string;
  label: string;
  startUtc: string;
  endUtc: string;
  status?: string | null;
  turnaroundMinutes: number;
}

export interface SubEventAvailabilityCheckResponse {
  isAvailable: boolean;
  conflicts: SubEventConflictDto[];
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

export interface AppointmentLinkedEnquiryDto {
  enquiryId: string;
  reference: string;
  contactName: string;
  eventName?: string | null;
  eventStartUtc: string;
  status: string;
}

export interface AppointmentDetailDto {
  id: string;
  venueId: string;
  title: string;
  type: string;
  startUtc: string;
  endUtc: string;
  durationMinutes: number;
  spaceId?: string | null;
  spaceName?: string | null;
  attendees?: string | null;
  assignedToUserId?: string | null;
  assignedToName?: string | null;
  status: string;
  notes?: string | null;
  relatedEnquiries: AppointmentLinkedEnquiryDto[];
}

export interface AppointmentListResponse {
  items: AppointmentDetailDto[];
}

export interface UpsertAppointmentRequest {
  venueId: string;
  title: string;
  type: string;
  startUtc: string;
  durationMinutes: number;
  spaceId?: string | null;
  attendees?: string | null;
  relatedEnquiryIds: string[];
  assignedToUserId?: string | null;
  notes?: string | null;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow';
  allowConflictOverride?: boolean;
}

export interface UpdateAppointmentRequest {
  title: string;
  type: string;
  startUtc: string;
  durationMinutes: number;
  spaceId?: string | null;
  attendees?: string | null;
  relatedEnquiryIds: string[];
  assignedToUserId?: string | null;
  notes?: string | null;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow';
  allowConflictOverride?: boolean;
}

export interface UpcomingAppointmentDto {
  id: string;
  venueId: string;
  title: string;
  type: string;
  startUtc: string;
  endUtc: string;
  durationMinutes: number;
  spaceId?: string | null;
  spaceName?: string | null;
  assignedToName?: string | null;
  status: string;
  relatedEnquiryCount: number;
}

export interface UpcomingAppointmentsResponse {
  items: UpcomingAppointmentDto[];
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

export interface ActivityFeedEntryDto {
  id: string;
  createdAtUtc: string;
  actionType: string;
  actionLabel: string;
  actionCategory: string;
  entityType: string;
  entityId: string;
  enquiryId?: string | null;
  enquiryReference?: string | null;
  changeSummaryJson?: string | null;
  details?: string | null;
  userId?: string | null;
  userName?: string | null;
  userAvatarUrl?: string | null;
  ipAddress?: string | null;
}

export interface ActivityFeedResponse {
  items: ActivityFeedEntryDto[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  totalCount: number;
}

export interface AuditRetentionSettingsDto {
  retentionDays: number;
}

export interface UpdateAuditRetentionSettingsRequest {
  venueId: string;
  retentionDays: number;
}

export interface AvailabilityEventDto {
  recordId: string;
  recordType: string;
  label: string;
  enquiryStatus?: string | null;
  enquiryReference?: string | null;
  clientName?: string | null;
  covers?: number | null;
  eventType?: string | null;
  eventStyle?: string | null;
  spaceBooked?: boolean;
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

export interface DuplicateEnquiryMatchDto {
  enquiryId: string;
  reference: string;
  contactName: string;
  eventName: string;
  eventStartUtc: string;
  status: string;
  matchedOnEmail: boolean;
  matchedOnPhone: boolean;
  matchedOnNameAndDate: boolean;
}

export interface SameDateEnquiryConflictDto {
  enquiryId: string;
  reference: string;
  contactName: string;
  eventName: string;
  eventStartUtc: string;
  status: string;
}

export interface EnquiryDuplicateCheckResponse {
  duplicateMatches: DuplicateEnquiryMatchDto[];
  sameDateConflicts: SameDateEnquiryConflictDto[];
}

export interface MergeEnquiriesRequest {
  primaryEnquiryId: string;
  secondaryEnquiryId: string;
  fieldSources?: Record<string, 'primary' | 'secondary'>;
  archiveSecondary?: boolean;
}

export interface MergeEnquiriesResponse {
  primaryEnquiryId: string;
  secondaryEnquiryId: string;
  primaryReference: string;
  secondaryReference: string;
  movedSubEvents: number;
  movedProposals: number;
  movedPaymentSchedules: number;
  movedCommunications: number;
  movedTasks: number;
  movedDocuments: number;
  movedAppointments: number;
}

export interface EnquiryDeduplicationCandidateDto {
  primaryEnquiryId: string;
  primaryReference: string;
  primaryContactName: string;
  primaryEventName: string;
  primaryEventStartUtc: string;
  primaryStatus: string;
  secondaryEnquiryId: string;
  secondaryReference: string;
  secondaryContactName: string;
  secondaryEventName: string;
  secondaryEventStartUtc: string;
  secondaryStatus: string;
  matchedOnEmail: boolean;
  matchedOnPhone: boolean;
  matchedOnNameAndDate: boolean;
  confidenceScore: number;
}

export interface EnquiryDeduplicationReportResponse {
  generatedAtUtc: string;
  candidates: EnquiryDeduplicationCandidateDto[];
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
  conversionScore?: number | null;
  conversionScoreBand?: string | null;
  conversionTrendDelta?: number | null;
  conversionTrendDirection?: string | null;
  holdExpiresAtUtc?: string | null;
  lostReason?: string | null;
  lostReasonDetail?: string | null;
  lostAtUtc?: string | null;
  returningGuestInsight?: ReturningGuestInsightDto | null;
  subEvents: SubEventDto[];
  appointments: AppointmentDto[];
  activityLog: ActivityLogEntryDto[];
  recent: RecentlyViewedDto[];
  sameDateAvailability?: AvailabilitySidebarResponse | null;
}

export interface ReturningGuestInsightDto {
  isReturningGuest: boolean;
  previousEnquiryCount: number;
  previousConfirmedEventCount: number;
  lastEventDateUtc?: string | null;
  lastEventName?: string | null;
  lifetimeValue: number;
  averageEventValue: number;
  bookingFrequencyPerYear: number;
  preferredEventStyle?: string | null;
  preferredSetupStyle?: string | null;
  dietaryPreferences?: string | null;
}

export interface ContactCustomFieldDefinitionDto {
  id: string;
  key: string;
  label: string;
  type: string;
  isRequired: boolean;
  isActive: boolean;
  sortOrder: number;
  placeholder?: string | null;
  options: string[];
}

export interface ContactPreferencesDto {
  dietaryPreferences?: string | null;
  allergenFlags: string[];
  seatingPreference?: string | null;
  preferredSetupStyle?: string | null;
  preferredEventStyle?: string | null;
}

export interface ContactListItemDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumberE164: string;
  companyName?: string | null;
  jobTitle?: string | null;
  tags: string[];
  isVip: boolean;
  preferredCommunicationChannel?: string | null;
  preferences: ContactPreferencesDto;
  returningGuestInsight: ReturningGuestInsightDto;
  totalEnquiries: number;
  confirmedEvents: number;
  lastEventDateUtc?: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface ContactListResponse {
  page: PagedResult<ContactListItemDto>;
  totalGuests: number;
  returningGuests: number;
  repeatBookingRatePercent: number;
  availableTags: string[];
  companyNames: string[];
}

export interface ContactPreviousEventDto {
  enquiryId: string;
  enquiryReference: string;
  eventType: string;
  eventName?: string | null;
  eventStartUtc: string;
  status: string;
  proposalValue?: number | null;
  currencyCode: string;
}

export interface ContactCompanySummaryDto {
  companyName: string;
  contactCount: number;
  activeEnquiryCount: number;
  confirmedEvents: number;
  lifetimeValue: number;
  averageBookingValue: number;
}

export interface ContactDetailResponse {
  id: string;
  venueId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumberE164: string;
  companyName?: string | null;
  jobTitle?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  region?: string | null;
  postcode?: string | null;
  countryCode?: string | null;
  tags: string[];
  isVip: boolean;
  vipNotes?: string | null;
  birthday?: string | null;
  anniversary?: string | null;
  preferredCommunicationChannel?: string | null;
  preferences: ContactPreferencesDto;
  customFields: Record<string, string>;
  returningGuestInsight: ReturningGuestInsightDto;
  previousEvents: ContactPreviousEventDto[];
  companySummary?: ContactCompanySummaryDto | null;
  createdAtUtc: string;
  updatedAtUtc: string;
  lastCreventaSyncAtUtc?: string | null;
  externalLifetimePaymentValue?: number | null;
  externalOrderCount?: number | null;
  externalLastOrderAtUtc?: string | null;
}

export interface ContactTimelineItemDto {
  id: string;
  occurredAtUtc: string;
  type: string;
  title: string;
  summary?: string | null;
  enquiryId?: string | null;
  enquiryReference?: string | null;
  proposalId?: string | null;
  communicationId?: string | null;
  paymentTransactionId?: string | null;
  amount?: number | null;
  currencyCode?: string | null;
  actorName?: string | null;
}

export interface ContactTimelineResponse {
  page: PagedResult<ContactTimelineItemDto>;
}

export interface ContactExternalProfileDto {
  dietaryPreferences?: string | null;
  allergens: string[];
  lifetimePaymentValue?: number | null;
  totalOrders?: number | null;
  lastOrderAtUtc?: string | null;
  preferredSeatingStyle?: string | null;
  preferredSetupStyle?: string | null;
  preferredEventStyle?: string | null;
}

export interface ContactSyncResultDto {
  success: boolean;
  isStub: boolean;
  message: string;
  syncedAtUtc: string;
  externalProfile?: ContactExternalProfileDto | null;
}

export interface ContactTopGuestMetricDto {
  contactId: string;
  contactName: string;
  companyName?: string | null;
  lifetimeValue: number;
  bookingCount: number;
  averageBookingValue: number;
}

export interface ContactAcquisitionSourceMetricDto {
  source: string;
  count: number;
  percentage: number;
}

export interface ContactAnalyticsResponse {
  totalGuests: number;
  returningGuests: number;
  repeatBookingRatePercent: number;
  averageBookingsPerReturningGuest: number;
  topGuestsByLifetimeValue: ContactTopGuestMetricDto[];
  acquisitionBySource: ContactAcquisitionSourceMetricDto[];
}

export interface ContactCompanyDetailResponse {
  summary: ContactCompanySummaryDto;
  contacts: ContactListItemDto[];
}

export interface UpdateContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumberE164: string;
  companyName?: string | null;
  jobTitle?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  region?: string | null;
  postcode?: string | null;
  countryCode?: string | null;
  tags?: string[] | null;
  isVip: boolean;
  vipNotes?: string | null;
  birthday?: string | null;
  anniversary?: string | null;
  preferredCommunicationChannel?: string | null;
  dietaryPreferences?: string | null;
  allergenFlags?: string[] | null;
  seatingPreference?: string | null;
  preferredSetupStyle?: string | null;
  preferredEventStyle?: string | null;
  customFields?: Record<string, string> | null;
}

export interface UpsertContactCustomFieldsRequest {
  fields: ContactCustomFieldDefinitionDto[];
}

export interface EnquiryDocumentDto {
  id: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  category: string;
  uploadedAtUtc: string;
  uploadedByUserId?: string | null;
  uploadedByName?: string | null;
  versionGroupKey: string;
  versionNumber: number;
  isLatestVersion: boolean;
  downloadUrl: string;
  canPreview: boolean;
}

export interface UploadEnquiryDocumentRequest {
  fileName: string;
  mimeType: string;
  category: string;
  base64Content: string;
}

export interface UpdateEnquiryDocumentRequest {
  fileName?: string | null;
  category?: string | null;
  renameAllVersions?: boolean;
}

export interface CreateEnquiryDocumentShareLinkRequest {
  expiresInMinutes?: number | null;
}

export interface EnquiryDocumentShareLinkResponse {
  shareUrl: string;
  expiresAtUtc: string;
}

export interface GenerateBeoResponse {
  documentId: string;
  fileName: string;
  downloadUrl: string;
  generatedAtUtc: string;
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

export interface GenerateTestEnquiriesRequest {
  venueId: string;
  count?: number;
}

export interface GenerateTestEnquiriesResponse {
  requested: number;
  created: number;
  enquiryIds: string[];
  references: string[];
}

export interface UpdateEnquiryRequest {
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
  sourceType: string;
  sourceDetail?: string | null;
  leadQuality: number;
  specialRequirements?: string | null;
  internalNotes?: string | null;
  eventManagerUserId?: string | null;
  contactFirstName?: string | null;
  contactLastName?: string | null;
  contactEmail?: string | null;
  contactPhoneNumberE164?: string | null;
  companyName?: string | null;
  marketingConsent?: boolean | null;
}

export interface EnquirySustainabilityRequest {
  cateringType: string;
  venueEnergyRating: string;
  guestCountOverride?: number | null;
  estimatedTravelKmPerGuest: number;
  foodWasteKg: number;
  generalWasteKg: number;
  recyclablesKg: number;
  compostablesKg: number;
  localSourcingPercent: number;
  localSupplierSharePercent: number;
  regionalSupplierSharePercent: number;
  nationalSupplierSharePercent: number;
  internationalSupplierSharePercent: number;
  includeInProposal: boolean;
  notes?: string | null;
}

export interface EnquirySustainabilityResponse {
  id: string;
  enquiryId: string;
  cateringType: string;
  venueEnergyRating: string;
  guestCountUsed: number;
  guestCountOverride?: number | null;
  estimatedTravelKmPerGuest: number;
  carbonKgCo2e: number;
  carbonKgPerGuest: number;
  foodWasteKg: number;
  generalWasteKg: number;
  recyclablesKg: number;
  compostablesKg: number;
  totalWasteKg: number;
  wastePerGuestKg: number;
  wasteDiversionPercent: number;
  localSourcingPercent: number;
  localSupplierSharePercent: number;
  regionalSupplierSharePercent: number;
  nationalSupplierSharePercent: number;
  internationalSupplierSharePercent: number;
  sustainabilityScore: number;
  sustainabilityGrade: string;
  venueAverageWastePerGuestKg: number;
  wasteVsVenueAveragePercent: number;
  localSourcingRadiusMiles: number;
  carbonTargetKgPerGuest: number;
  wasteTargetKgPerGuest: number;
  diversionTargetPercent: number;
  scoreMethodology: string;
  includeInProposal: boolean;
  postEventCapturedAtUtc?: string | null;
  notes?: string | null;
  updatedAtUtc: string;
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
  isSubEvent?: boolean;
  subEventName?: string | null;
  parentEventLabel?: string | null;
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
  allowSoftConflicts?: boolean;
}

export interface DiaryMoveConflictDto {
  type: string;
  id: string;
  label: string;
  startUtc: string;
  endUtc: string;
  statusKey?: string | null;
  severity: 'Hard' | 'Soft' | string;
  spaceName?: string | null;
  turnaroundMinutes?: number | null;
  description?: string | null;
}

export interface DiaryMoveAlternativeDto {
  spaceId: string;
  spaceName: string;
  startUtc: string;
  endUtc: string;
  reason: string;
}

export interface DiaryMoveConflictCheckResponse {
  hasConflicts: boolean;
  hasHardConflicts: boolean;
  hasSoftConflicts: boolean;
  message: string;
  conflicts: DiaryMoveConflictDto[];
  alternatives: DiaryMoveAlternativeDto[];
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
  versionNumber?: number;
  totalExclVat?: number;
  totalVat?: number;
  totalInclVat?: number;
  validityDate?: string | null;
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
  sectionType: string;
  sortOrder: number;
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
  discountType?: string | null;
  discountValue?: number | null;
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

export interface ProposalSectionDto {
  key: string;
  title: string;
  isEnabled: boolean;
  sortOrder: number;
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
  termsAndConditionsId?: string | null;
  introduction?: string | null;
  subtotalExclVat: number;
  serviceChargeAmount: number;
  totalVat: number;
  totalAmount: number;
  currencyCode: string;
  sections: ProposalSectionDto[];
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
  versionNumber?: number;
  totalExclVat?: number;
  totalInclVat?: number;
  validityDate?: string | null;
}

export interface CreateProposalLineItemRequest {
  sectionType?: string;
  sortOrder?: number;
  category: string;
  description: string;
  quantity: number;
  unit?: string;
  unitPriceExclVat: number;
  vatRate: number;
  discountPercent?: number;
  discountAmount?: number;
  discountType?: string;
  discountValue?: number;
}

export interface CreateProposalRequest {
  title?: string;
  validUntilDate?: string;
  introduction?: string;
  termsVersion?: string;
  termsAndConditionsId?: string;
  currencyCode: string;
  serviceChargePercent?: number;
  sections?: ProposalSectionDto[];
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

export interface GenerateProposalPdfResponse {
  proposalId: string;
  documentId: string;
  fileName: string;
  generatedAtUtc: string;
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
  defaultSections?: ProposalSectionDto[] | null;
}

export interface CreateProposalFromEnquiryRequest extends CreateProposalRequest {
  enquiryId: string;
}

export interface UpdateProposalSectionsRequest {
  sections: ProposalSectionDto[];
}

export interface AcceptProposalRequest {
  fullLegalName?: string | null;
  email?: string | null;
  acceptTerms?: boolean | null;
  company?: string | null;
  notes?: string | null;
  signatureType?: string | null;
  signatureData?: string | null;
}

export interface AcceptProposalResponse {
  proposalId: string;
  version: string;
  versionNumber: number;
  status: string;
  acceptedAtUtc: string;
  acceptedByName: string;
  acceptedByEmail: string;
  signedDocumentId?: string | null;
}

export interface DeclineProposalRequest {
  reason?: string | null;
}

export interface DeclineProposalResponse {
  proposalId: string;
  version: string;
  versionNumber: number;
  status: string;
  declinedAtUtc: string;
  reason?: string | null;
}

export interface ProposalSignatureFieldMappingDto {
  sectionKey: string;
  requirementType: string;
}

export interface ProposalSignatureAuditEventDto {
  timestampUtc: string;
  eventType: string;
  actor: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  notes?: string | null;
}

export interface ProposalSignatureEnvelopeDto {
  id: string;
  proposalId: string;
  provider: string;
  status: string;
  requiresCounterSignature: boolean;
  clientEmail: string;
  clientName?: string | null;
  clientCompany?: string | null;
  signingUrl?: string | null;
  sentAtUtc?: string | null;
  publicTokenExpiresAtUtc: string;
  firstViewedAtUtc?: string | null;
  clientSignedAtUtc?: string | null;
  counterSignedAtUtc?: string | null;
  clientSignedName?: string | null;
  clientSignedCompany?: string | null;
  counterSignedName?: string | null;
  counterSignedCompany?: string | null;
  signedDocumentId?: string | null;
  fieldMappings: ProposalSignatureFieldMappingDto[];
  auditTrail: ProposalSignatureAuditEventDto[];
}

export interface SendProposalForSignatureRequest {
  clientEmail: string;
  clientName?: string | null;
  clientCompany?: string | null;
  provider?: string | null;
  message?: string | null;
  publicSigningBaseUrl?: string | null;
  fieldMappings?: ProposalSignatureFieldMappingDto[] | null;
  requireCounterSignature: boolean;
}

export interface SendProposalForSignatureResponse {
  proposalId: string;
  envelopeId: string;
  provider: string;
  status: string;
  signingUrl: string;
  sentAtUtc: string;
  expiresAtUtc: string;
}

export interface CounterSignProposalRequest {
  fullLegalName: string;
  company?: string | null;
  notes?: string | null;
}

export interface MarkProposalSignedRequest {
  fullLegalName: string;
  email: string;
  company?: string | null;
  fileName: string;
  mimeType: string;
  base64Content: string;
  notes?: string | null;
}

export interface PublicSignatureViewResponse {
  envelopeId: string;
  provider: string;
  status: string;
  expiresAtUtc: string;
  venueName: string;
  proposalReference: string;
  proposalVersion: string;
  clientName: string;
  eventName?: string | null;
  eventDateUtc: string;
  totalAmount: number;
  currencyCode: string;
  requiresCounterSignature: boolean;
  fieldMappings: ProposalSignatureFieldMappingDto[];
}

export interface PublicSignProposalRequest {
  fullLegalName: string;
  company?: string | null;
  signatureType: 'typed' | 'drawn';
  signatureData?: string | null;
  browserUserAgent?: string | null;
}

export interface PublicSignProposalResponse {
  envelopeId: string;
  status: string;
  awaitingCounterSignature: boolean;
  signedAtUtc: string;
}

export interface PortalBrandingDto {
  venueName: string;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  websiteUrl?: string | null;
}

export interface PortalProposalVersionDto {
  proposalId: string;
  version: string;
  status: string;
  createdAtUtc: string;
}

export interface PortalProposalLineDto {
  category: string;
  description: string;
  quantity: number;
  unitPriceExclVat: number;
  vatRate: number;
  totalInclVat: number;
}

export interface PortalVatBreakdownDto {
  vatRate: number;
  vatAmount: number;
}

export interface PortalProposalDto {
  proposalId: string;
  version: string;
  status: string;
  title?: string | null;
  clientName: string;
  eventDateUtc: string;
  totalAmount: number;
  currencyCode: string;
  validUntilDate?: string | null;
  hasUpdatedVersion: boolean;
  termsVersion: string;
  termsContent?: string | null;
  pdfDownloadUrl?: string | null;
  signedPdfDownloadUrl?: string | null;
  versions: PortalProposalVersionDto[];
  lines: PortalProposalLineDto[];
  vatBreakdown: PortalVatBreakdownDto[];
}

export interface PortalPaymentMilestoneDto {
  id: string;
  label: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  balanceRemaining: number;
  currencyCode: string;
  status: string;
  payNowUrl?: string | null;
}

export interface PortalPaymentScheduleDto {
  totalPaid: number;
  totalOutstanding: number;
  milestones: PortalPaymentMilestoneDto[];
}

export interface PortalReceiptDto {
  transactionId: string;
  fileName: string;
  createdAtUtc: string;
  amount: number;
  currencyCode: string;
}

export interface PortalMessageDto {
  id: string;
  author: string;
  body: string;
  createdAtUtc: string;
  isFromClient: boolean;
}

export interface PortalSubEventDto {
  name: string;
  startUtc: string;
  endUtc: string;
  guestCount: number;
  setupStyle?: string | null;
  spaceNames?: string | null;
}

export interface PortalEventSummaryDto {
  reference: string;
  eventType: string;
  eventName?: string | null;
  eventStartUtc: string;
  eventEndUtc?: string | null;
  guestsExpected: number;
  guestsConfirmed?: number | null;
  eventStyle?: string | null;
  setupStyle?: string | null;
  specialRequirements?: string | null;
  subEvents: PortalSubEventDto[];
}

export interface PortalDocumentDto {
  id: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  createdAtUtc: string;
}

export interface PortalViewResponse {
  token: string;
  tokenExpiresAtUtc: string;
  refreshedToken?: string | null;
  refreshedTokenExpiresAtUtc?: string | null;
  branding: PortalBrandingDto;
  proposal: PortalProposalDto;
  payments: PortalPaymentScheduleDto;
  receipts: PortalReceiptDto[];
  messages: PortalMessageDto[];
  eventSummary: PortalEventSummaryDto;
  documents: PortalDocumentDto[];
}

export interface PortalAcceptRequest {
  acceptTerms: boolean;
  fullLegalName: string;
  signatureType?: 'typed' | 'drawn';
  signatureData?: string | null;
  browserUserAgent?: string | null;
}

export interface PortalDeclineRequest {
  reason?: string | null;
}

export interface PortalRequestChangesRequest {
  comment: string;
}

export interface PortalGenerateLinkRequest {
  enquiryId: string;
  contactEmail?: string | null;
  portalBaseUrl?: string | null;
}

export interface PortalGenerateLinkResponse {
  token: string;
  expiresAtUtc: string;
  portalLink: string;
}

export interface PortalCreatePaymentLinkRequest {
  returnUrl?: string | null;
  cancelUrl?: string | null;
}

export interface PortalCreatePaymentLinkResponse {
  milestoneId: string;
  url: string;
  expiresAtUtc: string;
  providerReference: string;
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

export interface PaymentReminderResponse {
  milestoneId: string;
  recipientEmail: string;
  amountDue: number;
  currencyCode: string;
  dueDate: string;
  paymentUrl?: string | null;
  sentAtUtc: string;
}

export interface UpsertPaymentMilestoneRequest {
  id?: string | null;
  label: string;
  dueDate: string;
  amount: number;
  currencyCode: string;
  acceptedMethods?: string | null;
  autoReminder: boolean;
  autoReminderDaysBefore?: number | null;
  lateReminder: boolean;
  lateReminderDaysAfter?: number | null;
}

export interface UpsertPaymentScheduleRequest {
  name: string;
  milestones: UpsertPaymentMilestoneRequest[];
}

export interface InvoiceGenerationResponse {
  documentId: string;
  invoiceNumber: string;
  fileName: string;
  downloadUrl: string;
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
  dueTime?: string | null;
  assigneeName?: string | null;
  isOverdue: boolean;
}

export interface TaskSummaryWidgetDto {
  openCount: number;
  overdueCount: number;
  dueTodayCount: number;
}

export interface ActionRequiredWidgetDto {
  inactiveEnquiries: number;
  unassignedEnquiries: number;
  expiringHolds: number;
  total: number;
  priorityEnquiries: ActionRequiredEnquiryDto[];
}

export interface ActionRequiredEnquiryDto {
  enquiryId: string;
  enquiryReference: string;
  contactName: string;
  status: string;
  conversionScore: number;
  conversionScoreBand: string;
  weeklyTrendDelta: number;
  weeklyTrendDirection: string;
  daysSinceActivity: number;
  reason: string;
}

export interface DashboardResponse {
  kpis: DashboardKpiCardDto[];
  pipeline: PipelineWidgetDto;
  upcomingPayments: UpcomingPaymentsWidgetDto;
  recentActivity: ActivityFeedItemDto[];
  upcomingEvents: UpcomingEventDto[];
  taskSummary: TaskSummaryWidgetDto;
  tasksDueToday: TaskDueDto[];
  overdueTasks: TaskDueDto[];
  myTasks: TaskDueDto[];
  actionRequired: ActionRequiredWidgetDto;
  degradedMode: boolean;
  warnings: string[];
}

export interface AiPricingRecommendationResponse {
  venueId: string;
  spaceId: string;
  eventDate: string;
  eventType: string;
  currencyCode: string;
  minRecommendedPrice: number;
  suggestedPrice: number;
  maxRecommendedPrice: number;
  demandScore: number;
  demandIntensity: 'low' | 'medium' | 'high' | 'peak' | string;
  confidenceScore: number;
  hasSufficientData: boolean;
  message?: string | null;
  signals: string[];
}

export interface AiPricingInsightDto {
  spaceId: string;
  spaceName: string;
  eventDate: string;
  eventType: string;
  minRecommendedPrice: number;
  suggestedPrice: number;
  maxRecommendedPrice: number;
  demandScore: number;
  demandIntensity: 'low' | 'medium' | 'high' | 'peak' | string;
  confidenceScore: number;
  opportunityType: string;
  suggestedAdjustmentPercent: number;
  currencyCode: string;
  signals: string[];
}

export interface AiPricingInsightsResponse {
  generatedAtUtc: string;
  hasSufficientData: boolean;
  message?: string | null;
  items: AiPricingInsightDto[];
}

export interface AiDemandHeatmapCellDto {
  date: string;
  enquiryCount: number;
  confirmedCount: number;
  demandScore: number;
  intensity: 'low' | 'medium' | 'high' | 'peak' | string;
}

export interface AiDemandHeatmapResponse {
  fromDate: string;
  toDate: string;
  hasSufficientData: boolean;
  message?: string | null;
  cells: AiDemandHeatmapCellDto[];
}

export interface AiRevenueForecastPointDto {
  month: string;
  actualRevenue: number;
  predictedRevenue: number;
  budgetTarget: number;
  currencyCode: string;
}

export interface AiRevenueForecastResponse {
  generatedAtUtc: string;
  fromDate: string;
  toDate: string;
  hasSufficientData: boolean;
  message?: string | null;
  points: AiRevenueForecastPointDto[];
}

export interface AiConversionScoreSignalDto {
  key: string;
  label: string;
  weightPercent: number;
  signalScore: number;
  weightedContribution: number;
  insight?: string | null;
}

export interface AiConversionScoreDto {
  enquiryId: string;
  enquiryReference: string;
  venueId: string;
  score: number;
  scoreBand: 'hot' | 'warm' | 'watch' | 'cold' | string;
  weeklyTrendDelta: number;
  weeklyTrendDirection: 'warming' | 'cooling' | 'stable' | string;
  signals: AiConversionScoreSignalDto[];
}

export interface AiConversionScoresResponse {
  generatedAtUtc: string;
  items: AiConversionScoreDto[];
}

export interface AiFollowUpRecommendationDto {
  enquiryId: string;
  key: string;
  title: string;
  reason: string;
  priority: 'urgent' | 'high' | 'medium' | 'low' | string;
  recommendedChannel: 'email' | 'portal' | 'task' | string;
  suggestedTemplateKey?: string | null;
  suggestedSubject: string;
  suggestedBody: string;
  optimalSendAtUtc: string;
  routeHint?: string | null;
  isAutomatable: boolean;
}

export interface AiFollowUpRecommendationsResponse {
  enquiryId: string;
  generatedAtUtc: string;
  hasSufficientData: boolean;
  message?: string | null;
  items: AiFollowUpRecommendationDto[];
}

export interface AiExecuteFollowUpRecommendationRequest {
  sendImmediately?: boolean;
  customMessage?: string | null;
  templateKey?: string | null;
}

export interface AiExecuteFollowUpRecommendationResponse {
  executed: boolean;
  actionType: string;
  message: string;
  taskId?: string | null;
  communicationId?: string | null;
}

export interface AiAssistantActionDto {
  key: string;
  label: string;
  type: string;
  route?: string | null;
  description?: string | null;
  payload?: string | null;
}

export interface AiAssistantQueryRequest {
  query: string;
  enquiryId?: string | null;
  tone?: string | null;
}

export interface AiAssistantMessageResponse {
  query: string;
  intent: string;
  answer: string;
  generatedAtUtc: string;
  fallbackUsed: boolean;
  actions: AiAssistantActionDto[];
  suggestedPrompts: string[];
}

export interface AiAssistantSummaryResponse {
  title: string;
  summary: string;
  generatedAtUtc: string;
  actions: AiAssistantActionDto[];
}

export interface AiAssistantMeetingPrepItemDto {
  appointmentId: string;
  enquiryId?: string | null;
  title: string;
  startUtc: string;
  endUtc: string;
  clientName: string;
  eventName: string;
  spaceName?: string | null;
  guests: number;
  briefing: string;
}

export interface AiAssistantMeetingPrepResponse {
  fromDate: string;
  toDate: string;
  generatedAtUtc: string;
  summary: string;
  items: AiAssistantMeetingPrepItemDto[];
}

export interface AiAssistantEmailDraftRequest {
  enquiryId: string;
  purpose: string;
  tone?: string | null;
  additionalContext?: string | null;
}

export interface AiAssistantEmailDraftResponse {
  enquiryId: string;
  tone: string;
  subject: string;
  body: string;
  generatedAtUtc: string;
  suggestedTweaks: string[];
}

export interface AiAssistantTemplateEnhancementRequest {
  subject: string;
  body: string;
  tone?: string | null;
}

export interface AiAssistantTemplateEnhancementResponse {
  subject: string;
  body: string;
  tone: string;
  generatedAtUtc: string;
  suggestions: string[];
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
  bodyHtml?: string | null;
  fromAddress?: string | null;
  toAddresses?: string | null;
  ccAddresses?: string | null;
  bccAddresses?: string | null;
  occurredAtUtc: string;
  attachmentCount: number;
  trackingStatus: string;
  deliveredAtUtc?: string | null;
  openedAtUtc?: string | null;
  threadId?: string | null;
  nylasMessageId?: string | null;
  createdByUserId?: string | null;
  createdByName?: string | null;
}

export interface ConnectTimelineResponse {
  page: PagedResult<ConnectTimelineItemDto>;
  unmatchedEmailCount: number;
  unreadMentionCount: number;
}

export interface ConnectEmailTemplateDto {
  key: string;
  name: string;
  subjectTemplate: string;
  bodyHtmlTemplate: string;
  category?: string | null;
  isActive: boolean;
}

export interface ConnectInlineAttachmentDto {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  contentBase64: string;
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
  intent?: GlobalSearchIntentDto | null;
}

export interface GlobalSearchResultsResponse {
  page: PagedResult<GlobalSearchResultDto>;
  appliedTypes: string[];
  intent?: GlobalSearchIntentDto | null;
}

export interface GlobalSearchIntentDto {
  isNaturalLanguage: boolean;
  intentLabel?: string | null;
  appliedFilters: Record<string, string>;
  suggestedRoute?: string | null;
}

export interface TaskItemDto {
  id: string;
  venueId: string;
  enquiryId: string;
  enquiryReference: string;
  enquiryName: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  category: string;
  assigneeId?: string | null;
  assigneeName?: string | null;
  createdById?: string | null;
  createdByName?: string | null;
  dueDate?: string | null;
  dueTime?: string | null;
  isOverdue: boolean;
  templateId?: string | null;
  sortOrder: number;
  notes?: string | null;
  createdAtUtc: string;
  completedAtUtc?: string | null;
  completedById?: string | null;
  completedByName?: string | null;
  updatedAtUtc: string;
}

export interface TaskSummaryDto {
  total: number;
  open: number;
  todo: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  completedLast30Days: number;
  unassigned: number;
}

export interface TaskListResponse {
  items: TaskItemDto[];
  summary: TaskSummaryDto;
}

export interface TaskTemplateItemDto {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  priority: string;
  defaultAssigneeRole: string;
  dueDateRule: string;
  dueDateOffset: number;
  sortOrder: number;
}

export interface TaskTemplateDto {
  id: string;
  venueId: string;
  name: string;
  eventType: string;
  eventTypes: string[];
  description?: string | null;
  isActive: boolean;
  autoApplyOnStatus: string;
  triggerStatus: string;
  tasks: TaskTemplateItemDto[];
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface TaskTemplateResponse {
  templates: TaskTemplateDto[];
}

export interface TaskTemplateCreateItemRequest {
  title: string;
  description?: string | null;
  category: string;
  priority: string;
  defaultAssigneeRole: string;
  dueDateRule: string;
  dueDateOffset: number;
  sortOrder: number;
}

export interface TaskTemplateCreateRequest {
  venueId: string;
  name: string;
  eventType: string;
  eventTypes?: string[] | null;
  description?: string | null;
  isActive: boolean;
  autoApplyOnStatus: string;
  tasks: TaskTemplateCreateItemRequest[];
}

export interface TaskTemplateUpdateRequest {
  name: string;
  eventType: string;
  eventTypes?: string[] | null;
  description?: string | null;
  isActive: boolean;
  autoApplyOnStatus: string;
  tasks: TaskTemplateCreateItemRequest[];
}

export interface TransitionEnquiryStatusResponse {
  id: string;
  status: string;
  holdExpiresAtUtc?: string | null;
  lostReason?: string | null;
  lostReasonDetail?: string | null;
  lostAtUtc?: string | null;
  allowedTransitions: string[];
  generatedTaskCount: number;
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
  emailClientEnabled: boolean;
  channel: 'InApp' | 'Email' | 'Both' | 'None' | string;
}

export interface NotificationPreferencesResponse {
  preferences: NotificationPreferenceDto[];
}

export interface NotificationPreferenceMatrixRowDto {
  triggerKey: string;
  label: string;
  description: string;
  inAppEnabled: boolean;
  emailOperatorEnabled: boolean;
  emailClientEnabled: boolean;
  channel: 'InApp' | 'Email' | 'Both' | 'None' | string;
}

export interface NotificationPreferenceMatrixResponse {
  rows: NotificationPreferenceMatrixRowDto[];
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

export interface PortfolioAggregateMetricsDto {
  totalActiveEnquiries: number;
  totalConfirmedEvents: number;
  totalPipelineValue: number;
  totalMonthlyRevenue: number;
  currencyCode: string;
}

export interface PortfolioVenueMetricsDto {
  venueId: string;
  venueName: string;
  currencyCode: string;
  activeEnquiries: number;
  confirmedEvents: number;
  pipelineValue: number;
  monthlyRevenue: number;
  conversionRatePercent: number;
  averageBookingValue: number;
  averageResponseTimeHours: number;
  conversionRateRank: number;
  averageBookingValueRank: number;
  responseTimeRank: number;
}

export interface PortfolioDashboardResponse {
  generatedAtUtc: string;
  aggregate: PortfolioAggregateMetricsDto;
  venues: PortfolioVenueMetricsDto[];
}

export interface PortfolioVenueReportDto {
  venueId: string;
  venueName: string;
  report: ReportResponse;
}

export interface PortfolioReportResponse {
  reportKey: string;
  generatedAtUtc: string;
  aggregate: ReportResponse;
  venues: PortfolioVenueReportDto[];
}

export interface PortfolioRoutingSpaceOptionDto {
  spaceId: string;
  spaceName: string;
  isAvailable: boolean;
  capacity: number;
  sameDateConflictCount: number;
}

export interface PortfolioRoutingVenueOptionDto {
  venueId: string;
  venueName: string;
  availableSpaceCount: number;
  totalSpaceCount: number;
  sameDateEnquiryCount: number;
  spaces: PortfolioRoutingSpaceOptionDto[];
}

export interface PortfolioRoutingOptionsResponse {
  enquiryId: string;
  sourceVenueId: string;
  eventDate: string;
  guestsExpected: number;
  venueOptions: PortfolioRoutingVenueOptionDto[];
}

export interface PortfolioSharedAvailabilityResponse {
  eventDate: string;
  guestsExpected: number;
  venueOptions: PortfolioRoutingVenueOptionDto[];
}

export interface TransferEnquiryVenueRequest {
  targetVenueId: string;
  reason?: string | null;
  keepCopy?: boolean;
}

export interface TransferEnquiryVenueResponse {
  enquiryId: string;
  enquiryReference: string;
  sourceEnquiryId?: string;
  sourceEnquiryReference?: string;
  targetEnquiryId?: string;
  targetEnquiryReference?: string;
  sourceVenueId: string;
  sourceVenueName: string;
  targetVenueId: string;
  targetVenueName: string;
  keepCopy?: boolean;
  sourceArchived?: boolean;
  copiedSubEvents?: number;
  copiedCommunications?: number;
  copiedTasks?: number;
  copiedDocuments?: number;
  copiedActivityEntries?: number;
  clearedSubEventSpaceLinks?: number;
  clearedSubEventMenuLinks?: number;
  transferredAtUtc: string;
}

export interface GroupSettingsCascadeRequest {
  sourceVenueId: string;
  targetVenueIds?: string[] | null;
  includeVenueProfileBranding: boolean;
  includePaymentSchedules: boolean;
  includeTermsDocuments: boolean;
  includeProposalTemplates: boolean;
  includeProposalPdfSettings: boolean;
  includePlanningMilestones: boolean;
  includeReportConfiguration: boolean;
}

export interface GroupSettingsCascadeResponse {
  sourceVenueId: string;
  targetVenueIds: string[];
  appliedSettingKeys: string[];
  appliedVenueProfileBranding: boolean;
  appliedAtUtc: string;
}

export interface ReportFilterParams {
  venueId: string;
  from?: string;
  to?: string;
  compareFrom?: string;
  compareTo?: string;
  eventType?: string;
  status?: string;
}

export interface TicketDashboardVenueDto {
  id: string;
  name: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
}

export interface TicketDashboardRecordDto {
  id: string;
  transactionId: string;
  transactionType: string;
  venueId: string;
  eventKey: string;
  eventId?: string | null;
  eventShortId?: string | null;
  eventName: string;
  guestKey: string;
  eventGuestId?: string | null;
  joinerId?: string | null;
  guestName: string;
  guestEmail?: string | null;
  createdUtc?: string | null;
  dueDateUtc?: string | null;
  status: string;
  currency: string;
  totalTickets: number;
  unitPrice: number;
  totalAmount: number;
  paidToDate: number;
  amountDue: number;
}

export interface TicketDashboardDatasetResponse {
  generatedAtUtc: string;
  venues: TicketDashboardVenueDto[];
  records: TicketDashboardRecordDto[];
}

export interface SeedTicketDashboardTestDataRequest {
  venueId?: string | null;
}

export interface SeedTicketDashboardTestDataResponse {
  venueId: string;
  venueName: string;
  eventsInserted: number;
  purchasesInserted: number;
  seededAtUtc: string;
}

export interface FeedbackInsightsVenueDto {
  id: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  timeZone: string;
}

export interface FeedbackInsightsQuestionnaireDto {
  id: string;
  venueId: string;
  title: string;
  description?: string | null;
  status: string;
  locale: string;
  publishedAtUtc?: string | null;
}

export interface FeedbackInsightsMenuRatingDto {
  courseName?: string | null;
  menuItemName?: string | null;
  score?: number | null;
  furtherFeedbackValue?: string | null;
}

export interface FeedbackInsightsResponseDto {
  questionId: string;
  contributesTo?: string | null;
  responseScore?: number | null;
  responseValue?: string | null;
  furtherFeedbackValue?: string | null;
  completed?: boolean | null;
  menuRatings: FeedbackInsightsMenuRatingDto[];
}

export interface FeedbackInsightsResultDto {
  id: string;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
  questionnaireId: string;
  title: string;
  venueId: string;
  eventId?: string | null;
  eventGuestId?: string | null;
  eventGuestName: string;
  mailingList: boolean;
  responses: FeedbackInsightsResponseDto[];
}

export interface FeedbackInsightsDatasetResponse {
  generatedAtUtc: string;
  venues: FeedbackInsightsVenueDto[];
  questionnaires: FeedbackInsightsQuestionnaireDto[];
  results: FeedbackInsightsResultDto[];
}

export interface ReportScheduleDto {
  id: string;
  name: string;
  reportKeys: string[];
  frequency: string;
  dayOfWeek?: number | null;
  dayOfMonth?: number | null;
  timeOfDay: string;
  format: 'csv' | 'pdf' | 'both';
  recipients: string[];
  isActive: boolean;
  lastRunAtUtc?: string | null;
  nextRunAtUtc?: string | null;
  venueId?: string | null;
  eventType?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface ReportSchedulesResponse {
  items: ReportScheduleDto[];
}

export interface ReportScheduleExecutionLogDto {
  id: string;
  runAtUtc: string;
  status: 'Sent' | 'Failed' | string;
  recipientCount: number;
  attachmentCount: number;
  message: string;
  trigger: 'manual' | 'scheduled' | string;
}

export interface ReportScheduleExecutionLogsResponse {
  items: ReportScheduleExecutionLogDto[];
}

export interface ReportScheduleRunResponse {
  scheduleId: string;
  isSuccess: boolean;
  status: 'Sent' | 'Failed' | string;
  recipientCount: number;
  attachmentCount: number;
  message: string;
  executedAtUtc: string;
}

export interface SnapshotRunResponse {
  snapshotDate: string;
  rowsInserted: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  private getWithApiPathFallback<T>(primaryPath: string, fallbackPath: string, options?: { params?: HttpParams }): Observable<T> {
    return this.http.get<T>(primaryPath, options).pipe(
      catchError((error) => {
        if (error?.status === 404 || error?.status === 405) {
          return this.http.get<T>(fallbackPath, options);
        }

        return throwError(() => error);
      })
    );
  }

  private postWithApiPathFallback<T>(
    primaryPath: string,
    fallbackPath: string,
    body: unknown,
    options?: { params?: HttpParams }
  ): Observable<T> {
    return this.http.post<T>(primaryPath, body, options).pipe(
      catchError((error) => {
        if (error?.status === 404 || error?.status === 405) {
          return this.http.post<T>(fallbackPath, body, options);
        }

        return throwError(() => error);
      })
    );
  }

  private putWithApiPathFallback<T>(
    primaryPath: string,
    fallbackPath: string,
    body: unknown,
    options?: { params?: HttpParams }
  ): Observable<T> {
    return this.http.put<T>(primaryPath, body, options).pipe(
      catchError((error) => {
        if (error?.status === 404 || error?.status === 405) {
          return this.http.put<T>(fallbackPath, body, options);
        }

        return throwError(() => error);
      })
    );
  }

  private patchWithApiPathFallback<T>(
    primaryPath: string,
    fallbackPath: string,
    body: unknown,
    options?: { params?: HttpParams }
  ): Observable<T> {
    return this.http.patch<T>(primaryPath, body, options).pipe(
      catchError((error) => {
        if (error?.status === 404 || error?.status === 405) {
          return this.http.patch<T>(fallbackPath, body, options);
        }

        return throwError(() => error);
      })
    );
  }

  private deleteWithApiPathFallback(
    primaryPath: string,
    fallbackPath: string,
    options?: { params?: HttpParams }
  ): Observable<void> {
    return this.http.delete<void>(primaryPath, options).pipe(
      catchError((error) => {
        if (error?.status === 404 || error?.status === 405) {
          return this.http.delete<void>(fallbackPath, options);
        }

        return throwError(() => error);
      })
    );
  }

  getHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>('/api/health');
  }

  getVenues(): Observable<VenueSummaryDto[]> {
    return this.http.get<VenueSummaryDto[]>('/api/venues');
  }

  createVenue(payload: CreateVenueRequest): Observable<VenueSummaryDto> {
    return this.postWithApiPathFallback<VenueSummaryDto>(
      '/api/v1/venues',
      '/api/venues',
      payload
    );
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

  getEventsHubEvents(venueId: string, fromUtc?: string, toUtc?: string): Observable<EventsHubEventDto[]> {
    let params = new HttpParams();
    if (fromUtc) {
      params = params.set('fromUtc', fromUtc);
    }
    if (toUtc) {
      params = params.set('toUtc', toUtc);
    }

    return this.getWithApiPathFallback<EventsHubEventDto[]>(
      `/api/v1/events-hub/venues/${venueId}/events`,
      `/api/events-hub/venues/${venueId}/events`,
      { params }
    );
  }

  getEventsHubEvent(venueId: string, eventId: string): Observable<EventsHubEventDto> {
    return this.getWithApiPathFallback<EventsHubEventDto>(
      `/api/v1/events-hub/venues/${venueId}/events/${eventId}`,
      `/api/events-hub/venues/${venueId}/events/${eventId}`
    );
  }

  createEventsHubEvent(venueId: string, payload: UpsertEventsHubEventRequest): Observable<EventsHubEventDto> {
    return this.postWithApiPathFallback<EventsHubEventDto>(
      `/api/v1/events-hub/venues/${venueId}/events`,
      `/api/events-hub/venues/${venueId}/events`,
      payload
    );
  }

  updateEventsHubEvent(venueId: string, eventId: string, payload: UpsertEventsHubEventRequest): Observable<EventsHubEventDto> {
    return this.putWithApiPathFallback<EventsHubEventDto>(
      `/api/v1/events-hub/venues/${venueId}/events/${eventId}`,
      `/api/events-hub/venues/${venueId}/events/${eventId}`,
      payload
    );
  }

  deleteEventsHubEvent(venueId: string, eventId: string): Observable<void> {
    return this.deleteWithApiPathFallback(
      `/api/v1/events-hub/venues/${venueId}/events/${eventId}`,
      `/api/events-hub/venues/${venueId}/events/${eventId}`
    );
  }

  publishEventsHubEvent(venueId: string, eventId: string): Observable<EventsHubPublishResponse> {
    return this.postWithApiPathFallback<EventsHubPublishResponse>(
      `/api/v1/events-hub/venues/${venueId}/events/${eventId}/publish`,
      `/api/events-hub/venues/${venueId}/events/${eventId}/publish`,
      {}
    );
  }

  syncEventsHubEvent(venueId: string, eventId: string): Observable<EventsHubSyncResponse> {
    return this.postWithApiPathFallback<EventsHubSyncResponse>(
      `/api/v1/events-hub/venues/${venueId}/events/${eventId}/sync`,
      `/api/events-hub/venues/${venueId}/events/${eventId}/sync`,
      {}
    );
  }

  getEventsHubAnalytics(venueId: string, eventId: string): Observable<EventsHubAnalyticsDto> {
    return this.getWithApiPathFallback<EventsHubAnalyticsDto>(
      `/api/v1/events-hub/venues/${venueId}/events/${eventId}/analytics`,
      `/api/events-hub/venues/${venueId}/events/${eventId}/analytics`
    );
  }

  getEventsHubAttendees(venueId: string, eventId: string): Observable<EventsHubAttendeeDto[]> {
    return this.getWithApiPathFallback<EventsHubAttendeeDto[]>(
      `/api/v1/events-hub/venues/${venueId}/events/${eventId}/attendees`,
      `/api/events-hub/venues/${venueId}/events/${eventId}/attendees`
    );
  }

  addEventsHubAttendee(venueId: string, eventId: string, payload: UpsertEventsHubAttendeeRequest): Observable<EventsHubAttendeeDto> {
    return this.postWithApiPathFallback<EventsHubAttendeeDto>(
      `/api/v1/events-hub/venues/${venueId}/events/${eventId}/attendees`,
      `/api/events-hub/venues/${venueId}/events/${eventId}/attendees`,
      payload
    );
  }

  importEventsHubAttendeesCsv(
    venueId: string,
    eventId: string,
    file: File,
    mapping?: {
      firstNameColumn?: string | null;
      lastNameColumn?: string | null;
      emailColumn?: string | null;
      phoneColumn?: string | null;
      eventInterestColumn?: string | null;
      notesColumn?: string | null;
      followUpStatusColumn?: string | null;
    }
  ): Observable<ImportEventsHubAttendeesResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (mapping?.firstNameColumn) {
      formData.append('firstNameColumn', mapping.firstNameColumn);
    }
    if (mapping?.lastNameColumn) {
      formData.append('lastNameColumn', mapping.lastNameColumn);
    }
    if (mapping?.emailColumn) {
      formData.append('emailColumn', mapping.emailColumn);
    }
    if (mapping?.phoneColumn) {
      formData.append('phoneColumn', mapping.phoneColumn);
    }
    if (mapping?.eventInterestColumn) {
      formData.append('eventInterestColumn', mapping.eventInterestColumn);
    }
    if (mapping?.notesColumn) {
      formData.append('notesColumn', mapping.notesColumn);
    }
    if (mapping?.followUpStatusColumn) {
      formData.append('followUpStatusColumn', mapping.followUpStatusColumn);
    }

    return this.postWithApiPathFallback<ImportEventsHubAttendeesResponse>(
      `/api/v1/events-hub/venues/${venueId}/events/${eventId}/attendees/import`,
      `/api/events-hub/venues/${venueId}/events/${eventId}/attendees/import`,
      formData
    );
  }

  setEventsHubAttendeeCheckIn(
    venueId: string,
    eventId: string,
    attendeeId: string,
    checkedIn: boolean
  ): Observable<EventsHubAttendeeDto> {
    return this.patchWithApiPathFallback<EventsHubAttendeeDto>(
      `/api/v1/events-hub/venues/${venueId}/events/${eventId}/attendees/${attendeeId}/check-in`,
      `/api/events-hub/venues/${venueId}/events/${eventId}/attendees/${attendeeId}/check-in`,
      { checkedIn });
  }

  setEventsHubAttendeeFollowUpStatus(
    venueId: string,
    eventId: string,
    attendeeId: string,
    followUpStatus: 'Pending' | 'Contacted' | 'Converted' | 'NotInterested' | 'NoResponse'
  ): Observable<EventsHubAttendeeDto> {
    return this.patchWithApiPathFallback<EventsHubAttendeeDto>(
      `/api/v1/events-hub/venues/${venueId}/events/${eventId}/attendees/${attendeeId}/follow-up-status`,
      `/api/events-hub/venues/${venueId}/events/${eventId}/attendees/${attendeeId}/follow-up-status`,
      { followUpStatus }
    );
  }

  bulkSetEventsHubAttendeeFollowUpStatus(
    venueId: string,
    eventId: string,
    payload: BulkEventsHubAttendeeFollowUpStatusRequest
  ): Observable<BulkEventsHubAttendeeFollowUpStatusResponse> {
    return this.patchWithApiPathFallback<BulkEventsHubAttendeeFollowUpStatusResponse>(
      `/api/v1/events-hub/venues/${venueId}/events/${eventId}/attendees/follow-up-status`,
      `/api/events-hub/venues/${venueId}/events/${eventId}/attendees/follow-up-status`,
      payload
    );
  }

  convertVenueEventAttendeeToEnquiry(
    venueId: string,
    eventId: string,
    attendeeId: string,
    payload: {
      eventType: string;
      eventStartUtc: string;
      eventEndUtc?: string | null;
      guestsExpected: number;
      eventStyle?: string | null;
      eventManagerUserId?: string | null;
      spaceId?: string | null;
    }
  ): Observable<{ id: string; reference: string }> {
    return this.postWithApiPathFallback<{ id: string; reference: string }>(
      `/api/v1/events-hub/venues/${venueId}/events/${eventId}/attendees/${attendeeId}/convert`,
      `/api/events-hub/venues/${venueId}/events/${eventId}/attendees/${attendeeId}/convert`,
      payload
    );
  }

  getPublicEventsHubRegistrationEvent(eventId: string): Observable<PublicEventsHubRegistrationEventDto> {
    return this.getWithApiPathFallback<PublicEventsHubRegistrationEventDto>(
      `/api/v1/public/venue-events/${eventId}`,
      `/api/public/venue-events/${eventId}`
    );
  }

  registerPublicEventsHubAttendee(
    eventId: string,
    payload: PublicEventsHubRegistrationRequest
  ): Observable<EventsHubAttendeeDto> {
    return this.postWithApiPathFallback<EventsHubAttendeeDto>(
      `/api/v1/public/venue-events/${eventId}/register`,
      `/api/public/venue-events/${eventId}/register`,
      payload
    );
  }

  getUsers(venueId?: string): Observable<UserSummaryDto[]> {
    let params = new HttpParams();
    if (venueId) {
      params = params.set('venueId', venueId);
    }
    return this.http.get<UserSummaryDto[]>('/api/users', { params });
  }

  getContacts(params: {
    venueId: string;
    search?: string;
    company?: string;
    tag?: string;
    vipOnly?: boolean;
    page?: number;
    pageSize?: number;
  }): Observable<ContactListResponse> {
    let queryParams = new HttpParams().set('venueId', params.venueId);
    if (params.search) {
      queryParams = queryParams.set('search', params.search);
    }
    if (params.company) {
      queryParams = queryParams.set('company', params.company);
    }
    if (params.tag) {
      queryParams = queryParams.set('tag', params.tag);
    }
    if (typeof params.vipOnly === 'boolean') {
      queryParams = queryParams.set('vipOnly', String(params.vipOnly));
    }
    if (params.page) {
      queryParams = queryParams.set('page', params.page);
    }
    if (params.pageSize) {
      queryParams = queryParams.set('pageSize', params.pageSize);
    }

    return this.getWithApiPathFallback<ContactListResponse>(
      '/api/v1/contacts',
      '/api/contacts',
      { params: queryParams }
    );
  }

  getContact(venueId: string, contactId: string): Observable<ContactDetailResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.getWithApiPathFallback<ContactDetailResponse>(
      `/api/v1/contacts/${contactId}`,
      `/api/contacts/${contactId}`,
      { params }
    );
  }

  updateContact(venueId: string, contactId: string, payload: UpdateContactRequest): Observable<ContactDetailResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.put<ContactDetailResponse>(`/api/contacts/${contactId}`, payload, { params });
  }

  getContactTimeline(
    venueId: string,
    contactId: string,
    params?: { page?: number; pageSize?: number }
  ): Observable<ContactTimelineResponse> {
    let queryParams = new HttpParams().set('venueId', venueId);
    if (params?.page) {
      queryParams = queryParams.set('page', params.page);
    }
    if (params?.pageSize) {
      queryParams = queryParams.set('pageSize', params.pageSize);
    }

    return this.getWithApiPathFallback<ContactTimelineResponse>(
      `/api/v1/contacts/${contactId}/timeline`,
      `/api/contacts/${contactId}/timeline`,
      { params: queryParams }
    );
  }

  getContactCompanies(venueId: string, search?: string): Observable<ContactCompanySummaryDto[]> {
    let params = new HttpParams().set('venueId', venueId);
    if (search) {
      params = params.set('search', search);
    }

    return this.getWithApiPathFallback<ContactCompanySummaryDto[]>(
      '/api/v1/contacts/companies',
      '/api/contacts/companies',
      { params }
    );
  }

  getContactCompanyDetail(venueId: string, companyName: string): Observable<ContactCompanyDetailResponse> {
    const params = new HttpParams()
      .set('venueId', venueId)
      .set('companyName', companyName);

    return this.getWithApiPathFallback<ContactCompanyDetailResponse>(
      '/api/v1/contacts/companies/detail',
      '/api/contacts/companies/detail',
      { params }
    );
  }

  getContactAnalytics(venueId: string): Observable<ContactAnalyticsResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.getWithApiPathFallback<ContactAnalyticsResponse>(
      '/api/v1/contacts/analytics',
      '/api/contacts/analytics',
      { params }
    );
  }

  pullContactFromCreventa(venueId: string, contactId: string): Observable<ContactSyncResultDto> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.post<ContactSyncResultDto>(`/api/contacts/${contactId}/sync/pull`, {}, { params });
  }

  pushContactToCreventa(venueId: string, contactId: string): Observable<ContactSyncResultDto> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.post<ContactSyncResultDto>(`/api/contacts/${contactId}/sync/push`, {}, { params });
  }

  getContactCustomFields(venueId: string): Observable<ContactCustomFieldDefinitionDto[]> {
    const params = new HttpParams().set('venueId', venueId);
    return this.getWithApiPathFallback<ContactCustomFieldDefinitionDto[]>(
      '/api/v1/contacts/settings/custom-fields',
      '/api/contacts/settings/custom-fields',
      { params }
    );
  }

  upsertContactCustomFields(
    venueId: string,
    payload: UpsertContactCustomFieldsRequest
  ): Observable<ContactCustomFieldDefinitionDto[]> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.put<ContactCustomFieldDefinitionDto[]>('/api/contacts/settings/custom-fields', payload, { params });
  }

  inviteUser(payload: InviteUserRequest): Observable<InviteUserResponse> {
    return this.http.post<InviteUserResponse>('/api/users/invite', payload);
  }

  createUser(payload: CreateUserRequest): Observable<UserSummaryDto> {
    return this.http.post<UserSummaryDto>('/api/users', payload);
  }

  updateUserStatus(userId: string, isActive: boolean): Observable<void> {
    return this.http.patch<void>(`/api/users/${userId}/status`, { isActive });
  }

  updateUserProfile(userId: string, payload: UpdateUserProfileRequest): Observable<void> {
    return this.http.patch<void>(`/api/users/${userId}/profile`, payload);
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

  getFinancialReferenceSettings(venueId: string): Observable<FinancialReferenceSettingsDto> {
    return this.http.get<FinancialReferenceSettingsDto>(`/api/venues/${venueId}/settings/financial-reference`);
  }

  upsertFinancialReferenceSettings(
    venueId: string,
    payload: FinancialReferenceSettingsDto
  ): Observable<FinancialReferenceSettingsDto> {
    return this.http.put<FinancialReferenceSettingsDto>(`/api/venues/${venueId}/settings/financial-reference`, payload);
  }

  getTermsDocuments(venueId: string): Observable<TermsDocumentSettingDto[]> {
    return this.http.get<TermsDocumentSettingDto[]>(`/api/venues/${venueId}/settings/terms-documents`);
  }

  upsertTermsDocuments(venueId: string, documents: TermsDocumentSettingDto[]): Observable<TermsDocumentSettingDto[]> {
    return this.http.put<TermsDocumentSettingDto[]>(`/api/venues/${venueId}/settings/terms-documents`, { documents });
  }

  getVenueTerms(venueId: string): Observable<TermsAndConditionsDto[]> {
    return this.http.get<TermsAndConditionsDto[]>(`/api/venues/${venueId}/terms`);
  }

  getVenueTermsVersions(venueId: string, termsId: string): Observable<TermsAndConditionsDto[]> {
    return this.http.get<TermsAndConditionsDto[]>(`/api/venues/${venueId}/terms/${termsId}/versions`);
  }

  createVenueTermsDraft(venueId: string, payload: CreateTermsAndConditionsDraftRequest): Observable<TermsAndConditionsDto> {
    return this.http.post<TermsAndConditionsDto>(`/api/venues/${venueId}/terms`, payload);
  }

  updateVenueTermsDraft(
    venueId: string,
    termsId: string,
    payload: UpdateTermsAndConditionsDraftRequest
  ): Observable<TermsAndConditionsDto> {
    return this.http.put<TermsAndConditionsDto>(`/api/venues/${venueId}/terms/${termsId}`, payload);
  }

  publishVenueTerms(venueId: string, termsId: string, payload: PublishTermsAndConditionsRequest): Observable<TermsAndConditionsDto> {
    return this.http.post<TermsAndConditionsDto>(`/api/venues/${venueId}/terms/${termsId}/publish`, payload);
  }

  getVenueProposalTemplates(venueId: string): Observable<ProposalTemplateSettingDto[]> {
    return this.http.get<ProposalTemplateSettingDto[]>(`/api/venues/${venueId}/settings/proposal-templates`);
  }

  upsertVenueProposalTemplates(venueId: string, templates: ProposalTemplateSettingDto[]): Observable<ProposalTemplateSettingDto[]> {
    return this.http.put<ProposalTemplateSettingDto[]>(`/api/venues/${venueId}/settings/proposal-templates`, { templates });
  }

  getProposalPdfSettings(venueId: string): Observable<ProposalPdfSettingsDto> {
    return this.http.get<ProposalPdfSettingsDto>(`/api/venues/${venueId}/settings/proposal-pdf`);
  }

  upsertProposalPdfSettings(venueId: string, settings: ProposalPdfSettingsDto): Observable<ProposalPdfSettingsDto> {
    return this.http.put<ProposalPdfSettingsDto>(`/api/venues/${venueId}/settings/proposal-pdf`, settings);
  }

  getPlanningMilestones(venueId: string): Observable<PlanningMilestoneSettingDto[]> {
    return this.http.get<PlanningMilestoneSettingDto[]>(`/api/venues/${venueId}/settings/planning-milestones`);
  }

  upsertPlanningMilestones(venueId: string, milestones: PlanningMilestoneSettingDto[]): Observable<PlanningMilestoneSettingDto[]> {
    return this.http.put<PlanningMilestoneSettingDto[]>(`/api/venues/${venueId}/settings/planning-milestones`, { milestones });
  }

  getLostReasons(venueId: string): Observable<LostReasonSettingDto[]> {
    return this.http.get<LostReasonSettingDto[]>(`/api/venues/${venueId}/settings/lost-reasons`);
  }

  upsertLostReasons(venueId: string, reasons: LostReasonSettingDto[]): Observable<LostReasonSettingDto[]> {
    return this.http.put<LostReasonSettingDto[]>(`/api/venues/${venueId}/settings/lost-reasons`, { reasons });
  }

  getSustainabilitySettings(venueId: string): Observable<SustainabilitySettingsDto> {
    return this.http.get<SustainabilitySettingsDto>(`/api/venues/${venueId}/settings/sustainability`);
  }

  upsertSustainabilitySettings(venueId: string, settings: SustainabilitySettingsDto): Observable<SustainabilitySettingsDto> {
    return this.http.put<SustainabilitySettingsDto>(`/api/venues/${venueId}/settings/sustainability`, settings);
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

  getAutomationRules(venueId: string): Observable<AutomationRuleDto[]> {
    return this.http.get<AutomationRuleDto[]>(`/api/venues/${venueId}/settings/automation/rules`);
  }

  upsertAutomationRules(venueId: string, rules: AutomationRuleDto[]): Observable<AutomationRuleDto[]> {
    return this.http.put<AutomationRuleDto[]>(`/api/venues/${venueId}/settings/automation/rules`, { rules });
  }

  updateAutomationRuleState(venueId: string, ruleId: string, isActive: boolean): Observable<AutomationRuleDto> {
    return this.http.patch<AutomationRuleDto>(`/api/venues/${venueId}/settings/automation/rules/${ruleId}`, { isActive });
  }

  getAutomationExecutionLog(venueId: string): Observable<AutomationExecutionLogDto[]> {
    return this.http.get<AutomationExecutionLogDto[]>(`/api/venues/${venueId}/settings/automation/execution-log`);
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

  getPublicWebsiteFormConfig(venueId: string, formId?: string | null, formSlug?: string | null): Observable<PublicWebsiteFormConfigResponse> {
    let params = new HttpParams();
    if (formId?.trim()) {
      params = params.set('formId', formId.trim());
    }
    if (formSlug?.trim()) {
      params = params.set('formSlug', formSlug.trim());
    }
    return this.http.get<PublicWebsiteFormConfigResponse>(`/api/public/enquiry-form/${venueId}/config`, { params });
  }

  submitPublicWebsiteEnquiry(venueId: string, payload: PublicWebsiteEnquirySubmitRequest, formId?: string | null, formSlug?: string | null): Observable<PublicWebsiteEnquirySubmitResponse> {
    let params = new HttpParams();
    if (formId?.trim()) {
      params = params.set('formId', formId.trim());
    }
    if (formSlug?.trim()) {
      params = params.set('formSlug', formSlug.trim());
    }
    return this.http.post<PublicWebsiteEnquirySubmitResponse>(`/api/public/enquiry-form/${venueId}`, payload, { params });
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

  getNylasStatus(): Observable<NylasStatusDto> {
    return this.http.get<NylasStatusDto>('/api/integrations/nylas/status');
  }

  createNylasConnectUrl(payload: CreateNylasConnectUrlRequest): Observable<CreateNylasConnectUrlResponse> {
    return this.http.post<CreateNylasConnectUrlResponse>('/api/integrations/nylas/connect-url', payload);
  }

  disconnectNylasAccount(venueId: string, emailAccountId: string): Observable<void> {
    return this.http.post<void>('/api/integrations/nylas/disconnect', { venueId, emailAccountId });
  }

  getRecentEnquiries(): Observable<RecentlyViewedDto[]> {
    return this.http.get<RecentlyViewedDto[]>('/api/enquiries/recent');
  }

  getMyRecentlyViewedBookings(): Observable<RecentlyViewedBookingDto[]> {
    return this.http.get<RecentlyViewedBookingDto[]>('/api/users/me/recently-viewed');
  }

  getEnquiries(params: {
    venueId: string;
    statusTab?: string;
    period?: string;
    eventManagerUserId?: string;
    eventType?: string;
    eventStyle?: string;
    source?: string;
    conversionScoreMin?: number;
    conversionScoreMax?: number;
    quickFilter?: string;
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
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
    if (typeof params.conversionScoreMin === 'number' && Number.isFinite(params.conversionScoreMin)) {
      queryParams = queryParams.set('conversionScoreMin', params.conversionScoreMin);
    }
    if (typeof params.conversionScoreMax === 'number' && Number.isFinite(params.conversionScoreMax)) {
      queryParams = queryParams.set('conversionScoreMax', params.conversionScoreMax);
    }
    if (params.quickFilter) {
      queryParams = queryParams.set('quickFilter', params.quickFilter);
    }
    if (params.search) {
      queryParams = queryParams.set('search', params.search);
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

    return this.http.get<EnquiryListResponse>('/api/enquiries', { params: queryParams });
  }

  getEnquirySelection(params: {
    venueId: string;
    statusTab?: string;
    eventManagerUserId?: string;
    eventType?: string;
    eventStyle?: string;
    dateFrom?: string;
    dateTo?: string;
    source?: string;
    spaceId?: string;
    valueMin?: number;
    valueMax?: number;
    quickFilter?: string;
    search?: string;
  }): Observable<EnquirySelectionResponse> {
    let queryParams = new HttpParams().set('venueId', params.venueId);

    if (params.statusTab) {
      queryParams = queryParams.set('statusTab', params.statusTab);
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
    if (params.dateFrom) {
      queryParams = queryParams.set('dateFrom', params.dateFrom);
    }
    if (params.dateTo) {
      queryParams = queryParams.set('dateTo', params.dateTo);
    }
    if (params.source) {
      queryParams = queryParams.set('source', params.source);
    }
    if (params.spaceId) {
      queryParams = queryParams.set('spaceId', params.spaceId);
    }
    if (params.valueMin !== undefined && params.valueMin !== null) {
      queryParams = queryParams.set('valueMin', params.valueMin);
    }
    if (params.valueMax !== undefined && params.valueMax !== null) {
      queryParams = queryParams.set('valueMax', params.valueMax);
    }
    if (params.quickFilter) {
      queryParams = queryParams.set('quickFilter', params.quickFilter);
    }
    if (params.search) {
      queryParams = queryParams.set('search', params.search);
    }

    return this.http.get<EnquirySelectionResponse>('/api/enquiries/selection', { params: queryParams });
  }

  createEnquiry(payload: CreateEnquiryRequest): Observable<EnquiryDetailResponse> {
    return this.http.post<EnquiryDetailResponse>('/api/enquiries', payload);
  }

  generateTestEnquiries(payload: GenerateTestEnquiriesRequest): Observable<GenerateTestEnquiriesResponse> {
    return this.http.post<GenerateTestEnquiriesResponse>('/api/enquiries/generate-test-enquiries', payload);
  }

  getEnquiry(enquiryId: string): Observable<EnquiryDetailResponse> {
    return this.http.get<EnquiryDetailResponse>(`/api/enquiries/${enquiryId}`);
  }

  getEnquiryActivity(
    enquiryId: string,
    params?: {
      actionCategory?: string;
      userId?: string;
      fromDate?: string;
      toDate?: string;
      page?: number;
      pageSize?: number;
    }
  ): Observable<ActivityFeedResponse> {
    let queryParams = new HttpParams();
    if (params?.actionCategory) {
      queryParams = queryParams.set('actionCategory', params.actionCategory);
    }
    if (params?.userId) {
      queryParams = queryParams.set('userId', params.userId);
    }
    if (params?.fromDate) {
      queryParams = queryParams.set('fromDate', params.fromDate);
    }
    if (params?.toDate) {
      queryParams = queryParams.set('toDate', params.toDate);
    }
    if (params?.page) {
      queryParams = queryParams.set('page', params.page);
    }
    if (params?.pageSize) {
      queryParams = queryParams.set('pageSize', params.pageSize);
    }

    return this.http.get<ActivityFeedResponse>(`/api/v1/enquiries/${enquiryId}/activity`, { params: queryParams });
  }

  getAuditLogs(params?: {
    search?: string;
    enquiryRef?: string;
    userId?: string;
    actionType?: string;
    entityType?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
  }): Observable<ActivityFeedResponse> {
    let queryParams = new HttpParams();
    if (params?.search) {
      queryParams = queryParams.set('search', params.search);
    }
    if (params?.enquiryRef) {
      queryParams = queryParams.set('enquiryRef', params.enquiryRef);
    }
    if (params?.userId) {
      queryParams = queryParams.set('userId', params.userId);
    }
    if (params?.actionType) {
      queryParams = queryParams.set('actionType', params.actionType);
    }
    if (params?.entityType) {
      queryParams = queryParams.set('entityType', params.entityType);
    }
    if (params?.fromDate) {
      queryParams = queryParams.set('fromDate', params.fromDate);
    }
    if (params?.toDate) {
      queryParams = queryParams.set('toDate', params.toDate);
    }
    if (params?.page) {
      queryParams = queryParams.set('page', params.page);
    }
    if (params?.pageSize) {
      queryParams = queryParams.set('pageSize', params.pageSize);
    }

    return this.http.get<ActivityFeedResponse>('/api/v1/admin/audit-logs', { params: queryParams });
  }

  exportAuditLogsCsv(params?: {
    search?: string;
    enquiryRef?: string;
    userId?: string;
    actionType?: string;
    entityType?: string;
    fromDate?: string;
    toDate?: string;
  }): Observable<Blob> {
    let queryParams = new HttpParams();
    if (params?.search) {
      queryParams = queryParams.set('search', params.search);
    }
    if (params?.enquiryRef) {
      queryParams = queryParams.set('enquiryRef', params.enquiryRef);
    }
    if (params?.userId) {
      queryParams = queryParams.set('userId', params.userId);
    }
    if (params?.actionType) {
      queryParams = queryParams.set('actionType', params.actionType);
    }
    if (params?.entityType) {
      queryParams = queryParams.set('entityType', params.entityType);
    }
    if (params?.fromDate) {
      queryParams = queryParams.set('fromDate', params.fromDate);
    }
    if (params?.toDate) {
      queryParams = queryParams.set('toDate', params.toDate);
    }

    return this.http.get('/api/v1/admin/audit-logs/export', {
      params: queryParams,
      responseType: 'blob'
    });
  }

  getAuditRetentionSettings(venueId: string): Observable<AuditRetentionSettingsDto> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<AuditRetentionSettingsDto>('/api/v1/admin/audit-logs/retention', { params });
  }

  updateAuditRetentionSettings(payload: UpdateAuditRetentionSettingsRequest): Observable<AuditRetentionSettingsDto> {
    return this.http.put<AuditRetentionSettingsDto>('/api/v1/admin/audit-logs/retention', payload);
  }

  getEnquiryDocuments(enquiryId: string, category?: string, search?: string): Observable<EnquiryDocumentDto[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<EnquiryDocumentDto[]>(`/api/enquiries/${enquiryId}/documents`, { params });
  }

  uploadEnquiryDocument(enquiryId: string, payload: UploadEnquiryDocumentRequest): Observable<EnquiryDocumentDto> {
    return this.http.post<EnquiryDocumentDto>(`/api/enquiries/${enquiryId}/documents`, payload);
  }

  uploadEnquiryDocumentWithProgress(enquiryId: string, payload: UploadEnquiryDocumentRequest): Observable<HttpEvent<EnquiryDocumentDto>> {
    const request = new HttpRequest<UploadEnquiryDocumentRequest>(
      'POST',
      `/api/enquiries/${enquiryId}/documents`,
      payload,
      {
        reportProgress: true,
        responseType: 'json'
      }
    );

    return this.http.request<EnquiryDocumentDto>(request);
  }

  deleteEnquiryDocument(enquiryId: string, documentId: string): Observable<void> {
    return this.http.delete<void>(`/api/enquiries/${enquiryId}/documents/${documentId}`);
  }

  updateEnquiryDocument(enquiryId: string, documentId: string, payload: UpdateEnquiryDocumentRequest): Observable<EnquiryDocumentDto> {
    return this.http.patch<EnquiryDocumentDto>(`/api/enquiries/${enquiryId}/documents/${documentId}`, payload);
  }

  getEnquiryDocumentVersions(enquiryId: string, documentId: string): Observable<EnquiryDocumentDto[]> {
    return this.http.get<EnquiryDocumentDto[]>(`/api/enquiries/${enquiryId}/documents/${documentId}/versions`);
  }

  createEnquiryDocumentShareLink(
    enquiryId: string,
    documentId: string,
    payload: CreateEnquiryDocumentShareLinkRequest
  ): Observable<EnquiryDocumentShareLinkResponse> {
    return this.http.post<EnquiryDocumentShareLinkResponse>(
      `/api/enquiries/${enquiryId}/documents/${documentId}/share`,
      payload
    );
  }

  generateEnquiryBeo(enquiryId: string): Observable<GenerateBeoResponse> {
    return this.http.post<GenerateBeoResponse>(`/api/enquiries/${enquiryId}/documents/generate-beo`, {});
  }

  updateEnquiry(enquiryId: string, payload: UpdateEnquiryRequest): Observable<void> {
    return this.http.put<void>(`/api/enquiries/${enquiryId}`, payload);
  }

  getEnquirySustainability(enquiryId: string): Observable<EnquirySustainabilityResponse> {
    return this.http.get<EnquirySustainabilityResponse>(`/api/enquiries/${enquiryId}/sustainability`);
  }

  upsertEnquirySustainability(
    enquiryId: string,
    payload: EnquirySustainabilityRequest
  ): Observable<EnquirySustainabilityResponse> {
    return this.http.put<EnquirySustainabilityResponse>(`/api/enquiries/${enquiryId}/sustainability`, payload);
  }

  createSubEvent(enquiryId: string, payload: UpsertSubEventRequest): Observable<SubEventDto> {
    return this.http.post<SubEventDto>(`/api/enquiries/${enquiryId}/sub-events`, payload);
  }

  updateSubEvent(enquiryId: string, subEventId: string, payload: UpsertSubEventRequest): Observable<SubEventDto> {
    return this.http.put<SubEventDto>(`/api/enquiries/${enquiryId}/sub-events/${subEventId}`, payload);
  }

  deleteSubEvent(enquiryId: string, subEventId: string): Observable<void> {
    return this.http.delete<void>(`/api/enquiries/${enquiryId}/sub-events/${subEventId}`);
  }

  checkSubEventAvailability(enquiryId: string, payload: {
    startUtc: string;
    endUtc: string;
    spaceIds: string[];
    excludeSubEventId?: string | null;
  }): Observable<SubEventAvailabilityCheckResponse> {
    return this.http.post<SubEventAvailabilityCheckResponse>(`/api/enquiries/${enquiryId}/sub-events/check-availability`, payload);
  }

  getAppointments(params: {
    venueId: string;
    fromUtc?: string;
    toUtc?: string;
    enquiryId?: string;
    assignedToUserId?: string;
    status?: string;
  }): Observable<AppointmentListResponse> {
    let queryParams = new HttpParams().set('venueId', params.venueId);
    if (params.fromUtc) {
      queryParams = queryParams.set('fromUtc', params.fromUtc);
    }
    if (params.toUtc) {
      queryParams = queryParams.set('toUtc', params.toUtc);
    }
    if (params.enquiryId) {
      queryParams = queryParams.set('enquiryId', params.enquiryId);
    }
    if (params.assignedToUserId) {
      queryParams = queryParams.set('assignedToUserId', params.assignedToUserId);
    }
    if (params.status) {
      queryParams = queryParams.set('status', params.status);
    }

    return this.getWithApiPathFallback<AppointmentListResponse>(
      '/api/v1/appointments',
      '/api/appointments',
      { params: queryParams }
    );
  }

  getAppointment(appointmentId: string, venueId?: string): Observable<AppointmentDetailDto> {
    let queryParams = new HttpParams();
    if (venueId) {
      queryParams = queryParams.set('venueId', venueId);
    }

    return this.getWithApiPathFallback<AppointmentDetailDto>(
      `/api/v1/appointments/${appointmentId}`,
      `/api/appointments/${appointmentId}`,
      queryParams.keys().length ? { params: queryParams } : undefined
    );
  }

  createAppointment(payload: UpsertAppointmentRequest): Observable<AppointmentDetailDto> {
    return this.postWithApiPathFallback<AppointmentDetailDto>(
      '/api/v1/appointments',
      '/api/appointments',
      payload
    );
  }

  updateAppointment(appointmentId: string, payload: UpdateAppointmentRequest): Observable<AppointmentDetailDto> {
    return this.putWithApiPathFallback<AppointmentDetailDto>(
      `/api/v1/appointments/${appointmentId}`,
      `/api/appointments/${appointmentId}`,
      payload
    );
  }

  deleteAppointment(appointmentId: string, venueId?: string): Observable<void> {
    let queryParams = new HttpParams();
    if (venueId) {
      queryParams = queryParams.set('venueId', venueId);
    }

    return this.deleteWithApiPathFallback(
      `/api/v1/appointments/${appointmentId}${queryParams.keys().length ? `?${queryParams.toString()}` : ''}`,
      `/api/appointments/${appointmentId}${queryParams.keys().length ? `?${queryParams.toString()}` : ''}`
    );
  }

  getUpcomingAppointments(venueId: string, days = 14): Observable<UpcomingAppointmentsResponse> {
    const params = new HttpParams()
      .set('venueId', venueId)
      .set('days', Math.max(1, Math.min(90, Math.floor(days) || 14)));

    return this.getWithApiPathFallback<UpcomingAppointmentsResponse>(
      '/api/v1/appointments/upcoming',
      '/api/appointments/upcoming',
      { params }
    );
  }

  transitionEnquiryStatus(
    enquiryId: string,
    payload: { targetStatus: string; lostReason?: string; lostReasonDetail?: string; holdDaysOverride?: number; lostAtUtc?: string }
  ): Observable<TransitionEnquiryStatusResponse> {
    return this.http.post<TransitionEnquiryStatusResponse>(`/api/enquiries/${enquiryId}/status-transition`, payload);
  }

  bulkAssignEnquiries(payload: {
    enquiryIds: string[];
    eventManagerUserId?: string | null;
  }): Observable<BulkActionResultResponse> {
    return this.http.post<BulkActionResultResponse>('/api/enquiries/bulk-assign', payload);
  }

  bulkTransitionEnquiries(payload: {
    enquiryIds: string[];
    targetStatus: string;
    lostReason?: string;
    lostReasonDetail?: string;
    holdDaysOverride?: number;
    lostAtUtc?: string;
  }): Observable<BulkActionResultResponse> {
    return this.http.post<BulkActionResultResponse>('/api/enquiries/bulk-status-transition', payload);
  }

  bulkArchiveEnquiries(payload: {
    enquiryIds: string[];
  }): Observable<BulkActionResultResponse> {
    return this.http.post<BulkActionResultResponse>('/api/enquiries/bulk-archive', payload);
  }

  bulkUndoEnquiries(payload: {
    undoToken: string;
  }): Observable<BulkActionResultResponse> {
    return this.http.post<BulkActionResultResponse>('/api/enquiries/bulk-undo', payload);
  }

  getAvailability(venueId: string, date: string): Observable<AvailabilitySidebarResponse> {
    const params = new HttpParams().set('date', date);

    return this.getWithApiPathFallback<AvailabilitySidebarResponse>(
      `/api/v1/venues/${venueId}/availability`,
      `/api/venues/${venueId}/availability`,
      { params }
    ).pipe(
      catchError((error) => {
        if (error?.status === 404 || error?.status === 405) {
          const legacyParams = new HttpParams().set('venueId', venueId).set('date', date);
          return this.http.get<AvailabilitySidebarResponse>('/api/enquiries/availability', { params: legacyParams });
        }

        return throwError(() => error);
      })
    );
  }

  assignEnquirySpace(enquiryId: string, spaceId: string): Observable<void> {
    return this.http.post<void>(`/api/enquiries/${enquiryId}/spaces/${spaceId}`, {});
  }

  unassignEnquirySpace(enquiryId: string, spaceId: string): Observable<void> {
    return this.http.delete<void>(`/api/enquiries/${enquiryId}/spaces/${spaceId}`);
  }

  getEnquiryDuplicateCheck(params: {
    venueId: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    eventDate?: string;
  }): Observable<EnquiryDuplicateCheckResponse> {
    let queryParams = new HttpParams().set('venueId', params.venueId);
    if (params.email) {
      queryParams = queryParams.set('email', params.email);
    }
    if (params.phone) {
      queryParams = queryParams.set('phone', params.phone);
    }
    if (params.firstName) {
      queryParams = queryParams.set('firstName', params.firstName);
    }
    if (params.lastName) {
      queryParams = queryParams.set('lastName', params.lastName);
    }
    if (params.eventDate) {
      queryParams = queryParams.set('eventDate', params.eventDate);
    }

    return this.http.get<EnquiryDuplicateCheckResponse>('/api/enquiries/duplicate-check', { params: queryParams });
  }

  mergeEnquiries(payload: MergeEnquiriesRequest): Observable<MergeEnquiriesResponse> {
    return this.http.post<MergeEnquiriesResponse>('/api/enquiries/merge', payload);
  }

  getEnquiryDedupeReport(venueId: string, forceRefresh = false): Observable<EnquiryDeduplicationReportResponse> {
    let params = new HttpParams().set('venueId', venueId);
    if (forceRefresh) {
      params = params.set('forceRefresh', true);
    }
    return this.http.get<EnquiryDeduplicationReportResponse>('/api/enquiries/dedupe-report', { params });
  }

  runEnquiryDedupeReport(venueId: string): Observable<EnquiryDeduplicationReportResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.post<EnquiryDeduplicationReportResponse>('/api/enquiries/dedupe-report/run', null, { params });
  }

  getDiary(params: {
    venueId: string;
    view: 'day' | 'week' | 'month' | 'list' | 'timeline' | 'operations';
    startDate?: string;
    spaceIds?: string[];
  }): Observable<DiaryResponse> {
    let queryParams = new HttpParams().set('venueId', params.venueId).set('view', params.view);
    if (params.startDate) {
      queryParams = queryParams.set('startDate', params.startDate);
    }
    if (params.spaceIds && params.spaceIds.length > 0) {
      for (const spaceId of params.spaceIds) {
        queryParams = queryParams.append('spaceIds', spaceId);
      }
    }

    return this.http.get<DiaryResponse>('/api/diary', { params: queryParams });
  }

  exportDiary(params: {
    venueId: string;
    view: 'day' | 'week' | 'month' | 'timeline' | 'operations';
    format: 'xlsx' | 'pdf';
    startDate?: string;
    spaceIds?: string[];
  }): Observable<Blob> {
    let queryParams = new HttpParams()
      .set('venueId', params.venueId)
      .set('view', params.view)
      .set('format', params.format);
    if (params.startDate) {
      queryParams = queryParams.set('startDate', params.startDate);
    }
    if (params.spaceIds && params.spaceIds.length > 0) {
      for (const spaceId of params.spaceIds) {
        queryParams = queryParams.append('spaceIds', spaceId);
      }
    }

    return this.http.get('/api/diary/export', { params: queryParams, responseType: 'blob' });
  }

  moveDiaryEvent(payload: MoveDiaryEventRequest): Observable<void> {
    return this.http.put<void>('/api/diary/move', payload);
  }

  checkDiaryMoveConflicts(payload: MoveDiaryEventRequest): Observable<DiaryMoveConflictCheckResponse> {
    return this.http.post<DiaryMoveConflictCheckResponse>('/api/diary/move/conflicts', payload);
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

  createProposalFromEnquiry(payload: CreateProposalFromEnquiryRequest): Observable<ProposalDetailResponse> {
    return this.http.post<ProposalDetailResponse>('/api/proposals', payload);
  }

  updateProposal(proposalId: string, payload: CreateProposalRequest): Observable<ProposalDetailResponse> {
    return this.http.put<ProposalDetailResponse>(`/api/proposals/${proposalId}`, payload);
  }

  updateProposalSections(proposalId: string, payload: UpdateProposalSectionsRequest): Observable<ProposalDetailResponse> {
    return this.http.put<ProposalDetailResponse>(`/api/proposals/${proposalId}/sections`, payload);
  }

  acceptProposal(proposalId: string, payload: AcceptProposalRequest): Observable<AcceptProposalResponse> {
    return this.http.post<AcceptProposalResponse>(`/api/proposals/${proposalId}/accept`, payload);
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

  generateProposalPdf(proposalId: string): Observable<GenerateProposalPdfResponse> {
    return this.http.post<GenerateProposalPdfResponse>(`/api/proposals/${proposalId}/generate-pdf`, {});
  }

  declineProposal(proposalId: string, payload: DeclineProposalRequest): Observable<DeclineProposalResponse> {
    return this.http.post<DeclineProposalResponse>(`/api/proposals/${proposalId}/decline`, payload);
  }

  downloadDocument(documentId: string): Observable<Blob> {
    return this.http.get(`/api/documents/${documentId}`, { responseType: 'blob' });
  }

  getProposalSignatureEnvelope(proposalId: string): Observable<ProposalSignatureEnvelopeDto> {
    return this.http.get<ProposalSignatureEnvelopeDto>(`/api/proposals/${proposalId}/signature`);
  }

  sendProposalForSignature(
    proposalId: string,
    payload: SendProposalForSignatureRequest
  ): Observable<SendProposalForSignatureResponse> {
    return this.http.post<SendProposalForSignatureResponse>(`/api/proposals/${proposalId}/signature/send`, payload);
  }

  counterSignProposal(
    proposalId: string,
    envelopeId: string,
    payload: CounterSignProposalRequest
  ): Observable<ProposalSignatureEnvelopeDto> {
    return this.http.post<ProposalSignatureEnvelopeDto>(`/api/proposals/${proposalId}/signature/${envelopeId}/counter-sign`, payload);
  }

  markProposalSigned(
    proposalId: string,
    payload: MarkProposalSignedRequest
  ): Observable<ProposalSignatureEnvelopeDto> {
    return this.http.post<ProposalSignatureEnvelopeDto>(`/api/proposals/${proposalId}/signature/mark-signed`, payload);
  }

  getPublicSignatureView(token: string): Observable<PublicSignatureViewResponse> {
    return this.http.get<PublicSignatureViewResponse>(`/api/signatures/e/${encodeURIComponent(token)}`);
  }

  signPublicProposal(token: string, payload: PublicSignProposalRequest): Observable<PublicSignProposalResponse> {
    return this.http.post<PublicSignProposalResponse>(`/api/signatures/e/${encodeURIComponent(token)}/sign`, payload);
  }

  generatePortalLink(payload: PortalGenerateLinkRequest): Observable<PortalGenerateLinkResponse> {
    return this.http.post<PortalGenerateLinkResponse>('/api/portal/generate-link', payload);
  }

  private portalHeaders(token: string): { headers: HttpHeaders } {
    return { headers: new HttpHeaders({ 'X-Portal-Token': token }) };
  }

  getPortalProposal(token: string): Observable<PortalProposalDto> {
    return this.http.get<PortalProposalDto>('/api/portal/proposal', this.portalHeaders(token));
  }

  acceptPortalProposalByToken(token: string, payload: PortalAcceptRequest): Observable<PortalViewResponse> {
    return this.http.post<PortalViewResponse>('/api/portal/proposal/accept', payload, this.portalHeaders(token));
  }

  declinePortalProposalByToken(token: string, payload: PortalDeclineRequest): Observable<void> {
    return this.http.post<void>('/api/portal/proposal/decline', payload, this.portalHeaders(token));
  }

  getPortalPayments(token: string): Observable<PortalPaymentScheduleDto> {
    return this.http.get<PortalPaymentScheduleDto>('/api/portal/payments', this.portalHeaders(token));
  }

  createPortalPaymentLink(
    token: string,
    milestoneId: string,
    payload: PortalCreatePaymentLinkRequest
  ): Observable<PortalCreatePaymentLinkResponse> {
    return this.http.post<PortalCreatePaymentLinkResponse>(`/api/portal/payments/${milestoneId}/pay`, payload, this.portalHeaders(token));
  }

  getPortalDocuments(token: string): Observable<PortalDocumentDto[]> {
    return this.http.get<PortalDocumentDto[]>('/api/portal/documents', this.portalHeaders(token));
  }

  uploadPortalDocument(token: string, file: File, category?: string): Observable<PortalDocumentDto> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (category) {
      formData.append('category', category);
    }

    return this.http.post<PortalDocumentDto>('/api/portal/documents/upload', formData, this.portalHeaders(token));
  }

  getPortalMessages(token: string): Observable<PortalMessageDto[]> {
    return this.http.get<PortalMessageDto[]>('/api/portal/messages', this.portalHeaders(token));
  }

  postPortalMessage(token: string, payload: { message: string }): Observable<PortalMessageDto> {
    return this.http.post<PortalMessageDto>('/api/portal/messages', payload, this.portalHeaders(token));
  }

  getPortalEventSummary(token: string): Observable<PortalEventSummaryDto> {
    return this.http.get<PortalEventSummaryDto>('/api/portal/event-summary', this.portalHeaders(token));
  }

  getPortalView(token: string): Observable<PortalViewResponse> {
    return this.http.get<PortalViewResponse>(`/api/portal/e/${encodeURIComponent(token)}`);
  }

  acceptPortalProposal(token: string, payload: PortalAcceptRequest): Observable<PortalViewResponse> {
    return this.acceptPortalProposalByToken(token, payload);
  }

  declinePortalProposal(token: string, payload: PortalDeclineRequest): Observable<void> {
    return this.declinePortalProposalByToken(token, payload);
  }

  requestPortalProposalChanges(token: string, payload: PortalRequestChangesRequest): Observable<void> {
    return this.http.post<void>(`/api/portal/e/${encodeURIComponent(token)}/request-changes`, payload);
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

  upsertPaymentSchedule(enquiryId: string, payload: UpsertPaymentScheduleRequest): Observable<PaymentScheduleResponse> {
    return this.http.put<PaymentScheduleResponse>(`/api/enquiries/${enquiryId}/payments/schedule`, payload);
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

  generateMilestoneInvoice(milestoneId: string): Observable<InvoiceGenerationResponse> {
    return this.http.post<InvoiceGenerationResponse>(`/api/payment-milestones/${milestoneId}/invoice`, {});
  }

  sendPaymentReminder(milestoneId: string): Observable<PaymentReminderResponse> {
    return this.http.post<PaymentReminderResponse>(`/api/payment-milestones/${milestoneId}/send-reminder`, {});
  }

  getFinancialWidgets(venueId: string): Observable<PaymentWidgetsResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<PaymentWidgetsResponse>('/api/financial/widgets', { params });
  }

  getDashboard(venueId: string, period: '7d' | '30d' | '90d' = '30d'): Observable<DashboardResponse> {
    const params = new HttpParams().set('venueId', venueId).set('period', period);
    return this.http.get<DashboardResponse>('/api/dashboard', { params });
  }

  getPortfolioDashboard(venueId?: string): Observable<PortfolioDashboardResponse> {
    let params = new HttpParams();
    if (venueId) {
      params = params.set('venueId', venueId);
    }
    return this.getWithApiPathFallback<PortfolioDashboardResponse>(
      '/api/v1/portfolio/dashboard',
      '/api/portfolio/dashboard',
      { params }
    );
  }

  getPortfolioReport(
    reportKey: string,
    params?: {
      from?: string;
      to?: string;
      eventType?: string;
    }
  ): Observable<PortfolioReportResponse> {
    let queryParams = new HttpParams();
    if (params?.from) {
      queryParams = queryParams.set('from', params.from);
    }
    if (params?.to) {
      queryParams = queryParams.set('to', params.to);
    }
    if (params?.eventType) {
      queryParams = queryParams.set('eventType', params.eventType);
    }

    const encodedKey = encodeURIComponent(reportKey);
    return this.getWithApiPathFallback<PortfolioReportResponse>(
      `/api/v1/portfolio/reports/${encodedKey}`,
      `/api/portfolio/reports/${encodedKey}`,
      { params: queryParams }
    );
  }

  getPortfolioSharedAvailability(params: {
    date: string;
    guestsExpected?: number;
    sourceVenueId?: string;
  }): Observable<PortfolioSharedAvailabilityResponse> {
    let queryParams = new HttpParams().set('date', params.date);
    if (typeof params.guestsExpected === 'number') {
      queryParams = queryParams.set('guestsExpected', Math.max(1, Math.round(params.guestsExpected)));
    }
    if (params.sourceVenueId) {
      queryParams = queryParams.set('sourceVenueId', params.sourceVenueId);
    }

    return this.getWithApiPathFallback<PortfolioSharedAvailabilityResponse>(
      '/api/v1/portfolio/availability',
      '/api/portfolio/availability',
      { params: queryParams }
    );
  }

  getEnquiryRoutingOptions(enquiryId: string): Observable<PortfolioRoutingOptionsResponse> {
    return this.getWithApiPathFallback<PortfolioRoutingOptionsResponse>(
      `/api/v1/portfolio/enquiries/${enquiryId}/routing-options`,
      `/api/portfolio/enquiries/${enquiryId}/routing-options`
    );
  }

  transferEnquiryToVenue(enquiryId: string, payload: TransferEnquiryVenueRequest): Observable<TransferEnquiryVenueResponse> {
    return this.postWithApiPathFallback<TransferEnquiryVenueResponse>(
      `/api/v1/enquiries/${enquiryId}/transfer`,
      `/api/portfolio/enquiries/${enquiryId}/transfer`,
      payload
    );
  }

  cascadeGroupSettings(payload: GroupSettingsCascadeRequest): Observable<GroupSettingsCascadeResponse> {
    return this.http.post<GroupSettingsCascadeResponse>('/api/venues/group/settings/cascade', payload);
  }

  getAiPricingRecommendation(params: {
    venueId: string;
    spaceId: string;
    date: string;
    eventType: string;
  }): Observable<AiPricingRecommendationResponse> {
    const queryParams = new HttpParams()
      .set('venueId', params.venueId)
      .set('spaceId', params.spaceId)
      .set('date', params.date)
      .set('eventType', params.eventType);
    return this.http.get<AiPricingRecommendationResponse>('/api/v1/ai/pricing', { params: queryParams });
  }

  getAiPricingInsights(venueId: string, top = 5): Observable<AiPricingInsightsResponse> {
    const params = new HttpParams()
      .set('venueId', venueId)
      .set('top', String(Math.max(1, top)));
    return this.http.get<AiPricingInsightsResponse>('/api/v1/ai/pricing-insights', { params });
  }

  getAiDemandHeatmap(params: {
    venueId: string;
    fromDate: string;
    toDate: string;
    spaceIds?: string[];
  }): Observable<AiDemandHeatmapResponse> {
    let queryParams = new HttpParams()
      .set('venueId', params.venueId)
      .set('fromDate', params.fromDate)
      .set('toDate', params.toDate);

    if (params.spaceIds && params.spaceIds.length > 0) {
      for (const spaceId of params.spaceIds) {
        queryParams = queryParams.append('spaceIds', spaceId);
      }
    }

    return this.http.get<AiDemandHeatmapResponse>('/api/v1/ai/demand-heatmap', { params: queryParams });
  }

  getAiRevenueForecast(params: {
    venueId: string;
    fromDate: string;
    toDate: string;
  }): Observable<AiRevenueForecastResponse> {
    const queryParams = new HttpParams()
      .set('venueId', params.venueId)
      .set('fromDate', params.fromDate)
      .set('toDate', params.toDate);
    return this.http.get<AiRevenueForecastResponse>('/api/v1/ai/revenue-forecast', { params: queryParams });
  }

  getAiConversionScores(venueId: string, take = 200): Observable<AiConversionScoresResponse> {
    const params = new HttpParams()
      .set('venueId', venueId)
      .set('take', String(Math.max(1, take)));
    return this.http.get<AiConversionScoresResponse>('/api/v1/ai/conversion-scores', { params });
  }

  getAiConversionScoreForEnquiry(venueId: string, enquiryId: string): Observable<AiConversionScoreDto> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<AiConversionScoreDto>(`/api/v1/ai/conversion-scores/${enquiryId}`, { params });
  }

  getAiFollowUpRecommendations(venueId: string, enquiryId: string, top = 3): Observable<AiFollowUpRecommendationsResponse> {
    const params = new HttpParams()
      .set('venueId', venueId)
      .set('top', String(Math.max(1, top)));
    return this.http.get<AiFollowUpRecommendationsResponse>(`/api/v1/ai/follow-up-recommendations/${enquiryId}`, { params });
  }

  executeAiFollowUpRecommendation(
    venueId: string,
    enquiryId: string,
    recommendationKey: string,
    payload: AiExecuteFollowUpRecommendationRequest
  ): Observable<AiExecuteFollowUpRecommendationResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.post<AiExecuteFollowUpRecommendationResponse>(
      `/api/v1/ai/follow-up-recommendations/${enquiryId}/${encodeURIComponent(recommendationKey)}/execute`,
      payload,
      { params }
    );
  }

  queryAiAssistant(
    venueId: string,
    payload: AiAssistantQueryRequest
  ): Observable<AiAssistantMessageResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.post<AiAssistantMessageResponse>('/api/v1/ai/assistant/query', payload, { params });
  }

  getAiDailyBriefing(venueId: string): Observable<AiAssistantSummaryResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<AiAssistantSummaryResponse>('/api/v1/ai/assistant/daily-briefing', { params });
  }

  getAiEnquirySummary(venueId: string, enquiryId: string): Observable<AiAssistantSummaryResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<AiAssistantSummaryResponse>(`/api/v1/ai/assistant/enquiry-summary/${enquiryId}`, { params });
  }

  getAiMeetingPrep(params: {
    venueId: string;
    fromDate?: string;
    toDate?: string;
  }): Observable<AiAssistantMeetingPrepResponse> {
    let queryParams = new HttpParams().set('venueId', params.venueId);
    if (params.fromDate) {
      queryParams = queryParams.set('fromDate', params.fromDate);
    }
    if (params.toDate) {
      queryParams = queryParams.set('toDate', params.toDate);
    }
    return this.http.get<AiAssistantMeetingPrepResponse>('/api/v1/ai/assistant/meeting-prep', { params: queryParams });
  }

  generateAiEmailDraft(
    venueId: string,
    payload: AiAssistantEmailDraftRequest
  ): Observable<AiAssistantEmailDraftResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.post<AiAssistantEmailDraftResponse>('/api/v1/ai/assistant/email-draft', payload, { params });
  }

  enhanceAiTemplate(
    venueId: string,
    payload: AiAssistantTemplateEnhancementRequest
  ): Observable<AiAssistantTemplateEnhancementResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.post<AiAssistantTemplateEnhancementResponse>('/api/v1/ai/assistant/template-enhance', payload, { params });
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
      attachments?: ConnectInlineAttachmentDto[];
    }
  ): Observable<{ communicationId: string; sentAtUtc: string; trackingStatus: string }> {
    return this.http.post<{ communicationId: string; sentAtUtc: string; trackingStatus: string }>(
      `/api/connect/enquiries/${enquiryId}/emails`,
      payload
    );
  }

  sendConnectPortalMessage(
    enquiryId: string,
    payload: { venueId: string; body: string; subject?: string }
  ): Observable<{ communicationId: string; sentAtUtc: string }> {
    return this.http.post<{ communicationId: string; sentAtUtc: string }>(`/api/connect/enquiries/${enquiryId}/portal-messages`, payload);
  }

  getConnectTemplates(venueId: string): Observable<ConnectEmailTemplateDto[]> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<ConnectEmailTemplateDto[]>('/api/connect/templates', { params });
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
    assigneeId?: string;
    status?: string;
    category?: string;
    priority?: string;
    due?: 'today' | 'overdue' | 'upcoming' | 'week' | 'open';
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
  }): Observable<TaskListResponse> {
    let queryParams = new HttpParams().set('venueId', params.venueId);
    if (params.enquiryId) {
      queryParams = queryParams.set('enquiryId', params.enquiryId);
    }
    if (params.assigneeId) {
      queryParams = queryParams.set('assigneeId', params.assigneeId);
    }
    if (params.status) {
      queryParams = queryParams.set('status', params.status);
    }
    if (params.category) {
      queryParams = queryParams.set('category', params.category);
    }
    if (params.priority) {
      queryParams = queryParams.set('priority', params.priority);
    }
    if (params.due) {
      queryParams = queryParams.set('due', params.due);
    }
    if (params.dateFrom) {
      queryParams = queryParams.set('dateFrom', params.dateFrom);
    }
    if (params.dateTo) {
      queryParams = queryParams.set('dateTo', params.dateTo);
    }
    if (params.sort) {
      queryParams = queryParams.set('sort', params.sort);
    }
    return this.http.get<TaskListResponse>('/api/tasks', { params: queryParams });
  }

  getEnquiryTasks(
    enquiryId: string,
    params?: {
      assigneeId?: string;
      status?: string;
      category?: string;
      priority?: string;
      sort?: string;
    }
  ): Observable<TaskListResponse> {
    let queryParams = new HttpParams();
    if (params?.assigneeId) {
      queryParams = queryParams.set('assigneeId', params.assigneeId);
    }
    if (params?.status) {
      queryParams = queryParams.set('status', params.status);
    }
    if (params?.category) {
      queryParams = queryParams.set('category', params.category);
    }
    if (params?.priority) {
      queryParams = queryParams.set('priority', params.priority);
    }
    if (params?.sort) {
      queryParams = queryParams.set('sort', params.sort);
    }

    return this.http.get<TaskListResponse>(`/api/enquiries/${enquiryId}/tasks`, { params: queryParams });
  }

  getMyTasks(venueId: string, params?: { status?: string; category?: string; priority?: string }): Observable<TaskListResponse> {
    let queryParams = new HttpParams().set('venueId', venueId);
    if (params?.status) {
      queryParams = queryParams.set('status', params.status);
    }
    if (params?.category) {
      queryParams = queryParams.set('category', params.category);
    }
    if (params?.priority) {
      queryParams = queryParams.set('priority', params.priority);
    }
    return this.http.get<TaskListResponse>('/api/tasks/my', { params: queryParams });
  }

  getDueTodayTasks(venueId: string): Observable<TaskListResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<TaskListResponse>('/api/tasks/due-today', { params });
  }

  getOverdueTasks(venueId: string): Observable<TaskListResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<TaskListResponse>('/api/tasks/overdue', { params });
  }

  getTask(enquiryId: string, taskId: string): Observable<TaskItemDto> {
    return this.http.get<TaskItemDto>(`/api/enquiries/${enquiryId}/tasks/${taskId}`);
  }

  createTask(
    enquiryId: string,
    payload: {
      title: string;
      description?: string | null;
      status: string;
      priority: string;
      category: string;
      assigneeId?: string | null;
      dueDate?: string | null;
      dueTime?: string | null;
      notes?: string | null;
    }
  ): Observable<TaskItemDto> {
    return this.http.post<TaskItemDto>(`/api/enquiries/${enquiryId}/tasks`, payload);
  }

  updateTask(
    enquiryId: string,
    taskId: string,
    payload: {
      title: string;
      description?: string | null;
      status: string;
      priority: string;
      category: string;
      assigneeId?: string | null;
      dueDate?: string | null;
      dueTime?: string | null;
      notes?: string | null;
    }
  ): Observable<TaskItemDto> {
    return this.http.put<TaskItemDto>(`/api/enquiries/${enquiryId}/tasks/${taskId}`, payload);
  }

  completeTask(enquiryId: string, taskId: string, notes?: string | null): Observable<TaskItemDto> {
    return this.http.patch<TaskItemDto>(`/api/enquiries/${enquiryId}/tasks/${taskId}/complete`, {
      notes: notes ?? null
    });
  }

  reopenTask(enquiryId: string, taskId: string): Observable<TaskItemDto> {
    return this.http.patch<TaskItemDto>(`/api/enquiries/${enquiryId}/tasks/${taskId}/reopen`, {});
  }

  deleteTask(enquiryId: string, taskId: string): Observable<void> {
    return this.http.delete<void>(`/api/enquiries/${enquiryId}/tasks/${taskId}`);
  }

  reorderEnquiryTasks(enquiryId: string, taskIds: string[]): Observable<TaskListResponse> {
    return this.http.patch<TaskListResponse>(`/api/enquiries/${enquiryId}/tasks/reorder`, { taskIds });
  }

  applyTaskTemplate(enquiryId: string, templateId: string, force = false): Observable<{
    templateId: string;
    templateName: string;
    createdTaskCount: number;
    alreadyApplied: boolean;
  }> {
    return this.http.post<{
      templateId: string;
      templateName: string;
      createdTaskCount: number;
      alreadyApplied: boolean;
    }>(`/api/enquiries/${enquiryId}/tasks/apply-template`, { templateId, force });
  }

  getTaskTemplates(venueId: string): Observable<TaskTemplateResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.get<TaskTemplateResponse>('/api/task-templates', { params });
  }

  getTaskTemplate(templateId: string): Observable<TaskTemplateDto> {
    return this.http.get<TaskTemplateDto>(`/api/task-templates/${templateId}`);
  }

  createTaskTemplate(payload: TaskTemplateCreateRequest): Observable<TaskTemplateDto> {
    return this.http.post<TaskTemplateDto>('/api/task-templates', payload);
  }

  updateTaskTemplate(templateId: string, payload: TaskTemplateUpdateRequest): Observable<TaskTemplateDto> {
    return this.http.put<TaskTemplateDto>(`/api/task-templates/${templateId}`, payload);
  }

  deleteTaskTemplate(templateId: string): Observable<void> {
    return this.http.delete<void>(`/api/task-templates/${templateId}`);
  }

  duplicateTaskTemplate(templateId: string): Observable<TaskTemplateDto> {
    return this.http.post<TaskTemplateDto>(`/api/task-templates/${templateId}/duplicate`, {});
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

  getNotificationPreferenceMatrix(venueId?: string): Observable<NotificationPreferenceMatrixResponse> {
    let params = new HttpParams();
    if (venueId) {
      params = params.set('venueId', venueId);
    }

    return this.http.get<NotificationPreferenceMatrixResponse>('/api/notifications/preferences/matrix', { params });
  }

  upsertNotificationPreferenceMatrix(
    rows: Array<{
      triggerKey: string;
      inAppEnabled: boolean;
      emailOperatorEnabled: boolean;
      emailClientEnabled: boolean;
    }>,
    venueId?: string
  ): Observable<NotificationPreferenceMatrixResponse> {
    let params = new HttpParams();
    if (venueId) {
      params = params.set('venueId', venueId);
    }

    return this.http.put<NotificationPreferenceMatrixResponse>(
      '/api/notifications/preferences/matrix',
      { rows },
      { params });
  }

  getReportsCatalog(): Observable<ReportsCatalogResponse> {
    return this.http.get<ReportsCatalogResponse>('/api/reports');
  }

  getTicketDashboardDataset(): Observable<TicketDashboardDatasetResponse> {
    return this.http.get<TicketDashboardDatasetResponse>('/api/reports/ticket-dashboard');
  }

  seedTicketDashboardTestData(
    request: SeedTicketDashboardTestDataRequest
  ): Observable<SeedTicketDashboardTestDataResponse> {
    return this.http.post<SeedTicketDashboardTestDataResponse>(
      '/api/reports/ticket-dashboard/seed-test-data',
      request
    );
  }

  getFeedbackInsightsDataset(): Observable<FeedbackInsightsDatasetResponse> {
    return this.http.get<FeedbackInsightsDatasetResponse>('/api/v1/reports/feedback-insights');
  }

  getReport(reportKey: string, params: ReportFilterParams): Observable<ReportResponse> {
    let queryParams = new HttpParams().set('venueId', params.venueId);
    if (params.from) {
      queryParams = queryParams.set('from', params.from);
    }
    if (params.to) {
      queryParams = queryParams.set('to', params.to);
    }
    if (params.compareFrom) {
      queryParams = queryParams.set('compareFrom', params.compareFrom);
    }
    if (params.compareTo) {
      queryParams = queryParams.set('compareTo', params.compareTo);
    }
    if (params.eventType) {
      queryParams = queryParams.set('eventType', params.eventType);
    }
    if (params.status) {
      queryParams = queryParams.set('status', params.status);
    }
    return this.http.get<ReportResponse>(`/api/reports/${reportKey}`, { params: queryParams });
  }

  getSalesPerformanceReport(params: ReportFilterParams): Observable<ReportResponse> {
    return this.getReport('sales-performance', params);
  }

  getPipelineConversionReport(params: ReportFilterParams): Observable<ReportResponse> {
    return this.getReport('pipeline-conversion', params);
  }

  getRevenueForecastReport(params: ReportFilterParams): Observable<ReportResponse> {
    return this.getReport('revenue-forecast', params);
  }

  getSourceAnalysisReport(params: ReportFilterParams): Observable<ReportResponse> {
    return this.getReport('source-analysis', params);
  }

  getLostReasonAnalysisReport(params: ReportFilterParams): Observable<ReportResponse> {
    return this.getReport('lost-reason-analysis', params);
  }

  getSustainabilityReport(params: ReportFilterParams): Observable<ReportResponse> {
    return this.getReport('sustainability', params);
  }

  getRevenueBySpaceReport(params: ReportFilterParams): Observable<ReportResponse> {
    return this.getReport('revenue-space', params);
  }

  getRevenueByEventTypeReport(params: ReportFilterParams): Observable<ReportResponse> {
    return this.getReport('revenue-event-type', params);
  }

  getSalesTeamPerformanceReport(params: ReportFilterParams): Observable<ReportResponse> {
    return this.getReport('sales-team-performance', params);
  }

  getForecastReport(params: ReportFilterParams): Observable<ReportResponse> {
    return this.getReport('forecast', params);
  }

  getBudgetPaceByEventTypeReport(params: ReportFilterParams): Observable<ReportResponse> {
    return this.getReport('budget-pace-event-type', params);
  }

  exportReport(
    reportKey: string,
    params: { venueId: string; format: 'csv' | 'xlsx' | 'pdf'; from?: string; to?: string; compareFrom?: string; compareTo?: string; eventType?: string }
  ): Observable<Blob> {
    let queryParams = new HttpParams().set('venueId', params.venueId).set('format', params.format);
    if (params.from) {
      queryParams = queryParams.set('from', params.from);
    }
    if (params.to) {
      queryParams = queryParams.set('to', params.to);
    }
    if (params.compareFrom) {
      queryParams = queryParams.set('compareFrom', params.compareFrom);
    }
    if (params.compareTo) {
      queryParams = queryParams.set('compareTo', params.compareTo);
    }
    if (params.eventType) {
      queryParams = queryParams.set('eventType', params.eventType);
    }
    return this.http.get(`/api/reports/${reportKey}/export`, { params: queryParams, responseType: 'blob' });
  }

  getReportSchedules(venueId: string): Observable<ReportSchedulesResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.getWithApiPathFallback<ReportSchedulesResponse>('/api/report-schedules', '/api/reports/schedules', { params });
  }

  upsertReportSchedule(
    venueId: string,
    payload: {
      name: string;
      reportKeys: string[];
      frequency: string;
      dayOfWeek?: number;
      dayOfMonth?: number;
      timeOfDay?: string;
      format: 'csv' | 'pdf' | 'both';
      recipients: string[];
      isActive: boolean;
      nextRunAtUtc?: string;
      venueId?: string;
      eventType?: string;
      fromDate?: string;
      toDate?: string;
    },
    scheduleId?: string
  ): Observable<ReportScheduleDto> {
    let params = new HttpParams().set('venueId', venueId);
    if (scheduleId) {
      params = params.set('scheduleId', scheduleId);
    }
    return this.postWithApiPathFallback<ReportScheduleDto>('/api/report-schedules', '/api/reports/schedules', payload, { params });
  }

  deleteReportSchedule(scheduleId: string): Observable<void> {
    return this.http.delete<void>(`/api/report-schedules/${scheduleId}`).pipe(
      catchError((error) => {
        if (error?.status === 404 || error?.status === 405) {
          return this.http.delete<void>(`/api/reports/schedules/${scheduleId}`);
        }

        return throwError(() => error);
      })
    );
  }

  sendReportScheduleNow(scheduleId: string): Observable<ReportScheduleRunResponse> {
    return this.postWithApiPathFallback<ReportScheduleRunResponse>(
      `/api/report-schedules/${scheduleId}/send-now`,
      `/api/reports/schedules/${scheduleId}/send-now`,
      {}
    );
  }

  getReportScheduleExecutions(scheduleId: string): Observable<ReportScheduleExecutionLogsResponse> {
    return this.getWithApiPathFallback<ReportScheduleExecutionLogsResponse>(
      `/api/report-schedules/${scheduleId}/executions`,
      `/api/reports/schedules/${scheduleId}/executions`
    );
  }

  runPipelineSnapshot(venueId: string): Observable<SnapshotRunResponse> {
    const params = new HttpParams().set('venueId', venueId);
    return this.http.post<SnapshotRunResponse>('/api/reports/pipeline-snapshot/run', {}, { params });
  }
}
