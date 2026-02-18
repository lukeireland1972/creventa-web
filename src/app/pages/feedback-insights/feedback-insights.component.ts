import { Component, DestroyRef, ElementRef, ViewChild, inject } from '@angular/core';
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart as ChartJs, registerables } from 'chart.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ApiService,
  FeedbackInsightsDatasetResponse,
  FeedbackInsightsMenuRatingDto,
  FeedbackInsightsResponseDto,
  FeedbackInsightsResultDto
} from '../../services/api.service';

ChartJs.register(...registerables);

interface RawDocumentReference {
  $oid?: string;
}

interface RawDateValue {
  $date?: string;
}

interface RawMenuRating {
  courseName?: string | null;
  menuItemName?: string | null;
  score?: number | null;
  furtherFeedbackValue?: string | null;
}

interface RawQuestionResponse {
  questionId?: string | null;
  contributesTo?: string | null;
  responseScore?: number | null;
  responseValue?: string | null;
  furtherFeedbackValue?: string | null;
  completed?: boolean | null;
  menuRatings?: RawMenuRating[] | null;
}

interface RawFeedbackRecord {
  _id?: RawDocumentReference | string | null;
  created?: RawDateValue | string | null;
  updated?: RawDateValue | string | null;
  questionnaireId?: string | null;
  title?: string | null;
  venueId?: RawDocumentReference | string | null;
  eventId?: RawDocumentReference | string | null;
  eventGuestId?: RawDocumentReference | string | null;
  eventGuestName?: string | null;
  mailingList?: boolean | null;
  responses?: RawQuestionResponse[] | null;
}

interface NormalizedMenuRating {
  courseName: string;
  menuItemName: string;
  score: number | null;
  feedbackTexts: string[];
}

interface NormalizedQuestionResponse {
  questionId: string;
  category: string;
  score: number | null;
  feedbackTexts: string[];
  menuRatings: NormalizedMenuRating[];
}

interface NormalizedFeedbackSubmission {
  id: string;
  createdAt: number;
  createdIso: string;
  questionnaireId: string;
  title: string;
  venueId: string;
  eventId: string;
  guestId: string;
  guestName: string;
  mailingList: boolean;
  averageScore: number | null;
  responses: NormalizedQuestionResponse[];
  searchIndex: string;
}

interface SummaryCardData {
  submissions: number;
  uniqueEvents: number;
  uniqueGuests: number;
  averageScore: number;
  scoredResponses: number;
  mailingListRate: number;
  lowScoreShare: number;
  feedbackComments: number;
}

interface MonthlyTrendPoint {
  monthKey: string;
  monthLabel: string;
  submissions: number;
  averageScore: number | null;
}

interface CategoryScoreRow {
  category: string;
  averageScore: number;
  responseCount: number;
}

interface QuestionPerformanceRow {
  questionId: string;
  category: string;
  averageScore: number;
  responseCount: number;
  lowScoreShare: number;
  commentCount: number;
}

interface MenuPerformanceRow {
  courseName: string;
  menuItemName: string;
  averageScore: number;
  ratingCount: number;
  commentCount: number;
}

interface KeywordRow {
  term: string;
  count: number;
}

interface LowCommentRow {
  text: string;
  score: number;
  questionId: string;
  category: string;
  title: string;
  guestName: string;
  venueId: string;
  questionnaireId: string;
  createdAt: number;
}

interface SubmissionAlertRow {
  title: string;
  venueId: string;
  questionnaireId: string;
  averageScore: number;
  createdAt: number;
}

type CommentSourceType = 'question' | 'menu';
type CommentScoreFilter = 'all' | 'low' | 'high' | 'unscored';

interface CommentDrilldownRow {
  text: string;
  score: number | null;
  questionId: string;
  category: string;
  sourceType: CommentSourceType;
  courseName: string | null;
  menuItemName: string | null;
  title: string;
  venueId: string;
  questionnaireId: string;
  eventId: string;
  guestId: string;
  guestName: string;
  createdAt: number;
}

interface MenuItemCommentExportRow {
  comment: string;
  score: number | null;
  guestName: string;
  eventTitle: string;
  questionnaireId: string;
  createdAt: number;
}

@Component({
  selector: 'app-feedback-insights',
  imports: [FormsModule, DecimalPipe, DatePipe, TitleCasePipe],
  templateUrl: './feedback-insights.component.html',
  styleUrl: './feedback-insights.component.scss'
})
export class FeedbackInsightsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly api = inject(ApiService);

  @ViewChild('trendCanvas')
  private trendCanvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('categoryCanvas')
  private categoryCanvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('distributionCanvas')
  private distributionCanvas?: ElementRef<HTMLCanvasElement>;

  isLoading = false;
  isProcessing = false;
  isVenueMapProcessing = false;
  loadError = '';
  venueMapError = '';
  sourceFileName = '';
  venueMapFileName = '';

  allSubmissions: NormalizedFeedbackSubmission[] = [];
  filteredSubmissions: NormalizedFeedbackSubmission[] = [];

  venueOptions: string[] = [];
  questionnaireOptions: string[] = [];
  categoryOptions: string[] = [];

  selectedVenue = 'all';
  selectedQuestionnaire = 'all';
  selectedCategory = 'all';
  fromDate = '';
  toDate = '';
  searchText = '';
  questionSort: 'lowest' | 'highest' = 'lowest';
  minQuestionSampleSize = 30;
  minMenuSampleSize = 20;

  summary: SummaryCardData = {
    submissions: 0,
    uniqueEvents: 0,
    uniqueGuests: 0,
    averageScore: 0,
    scoredResponses: 0,
    mailingListRate: 0,
    lowScoreShare: 0,
    feedbackComments: 0
  };

  monthlyTrend: MonthlyTrendPoint[] = [];
  categoryScores: CategoryScoreRow[] = [];
  questionRows: QuestionPerformanceRow[] = [];
  menuRows: MenuPerformanceRow[] = [];
  keywordRows: KeywordRow[] = [];
  lowCommentRows: LowCommentRow[] = [];
  submissionAlerts: SubmissionAlertRow[] = [];
  strengthQuestions: QuestionPerformanceRow[] = [];
  improvementQuestions: QuestionPerformanceRow[] = [];
  allCommentRows: CommentDrilldownRow[] = [];
  filteredCommentRows: CommentDrilldownRow[] = [];
  pagedCommentRows: CommentDrilldownRow[] = [];
  commentSearchText = '';
  commentSourceFilter: 'all' | CommentSourceType = 'all';
  commentScoreFilter: CommentScoreFilter = 'all';
  commentPage = 1;
  commentPageSize = 25;
  menuExportNotice = '';

  totalLoadedSubmissions = 0;

  private minDataTimestamp = 0;
  private maxDataTimestamp = 0;

  private trendChart: ChartJs | null = null;
  private categoryChart: ChartJs | null = null;
  private distributionChart: ChartJs | null = null;
  private venueNameById = new Map<string, string>();

  private readonly scoreDistribution = [0, 0, 0, 0, 0];
  private readonly scoreDistributionLabels = ['0.0-0.9', '1.0-1.9', '2.0-2.9', '3.0-3.9', '4.0-5.0'];
  private readonly stopWords = new Set([
    'the', 'and', 'for', 'that', 'with', 'this', 'from', 'were', 'have', 'had', 'you', 'your', 'our',
    'was', 'are', 'but', 'not', 'all', 'very', 'they', 'them', 'just', 'more', 'would', 'there', 'their',
    'about', 'could', 'into', 'than', 'when', 'what', 'which', 'been', 'will', 'did', 'too', 'out', 'can',
    'staff', 'food', 'service', 'menu', 'event', 'venue', 'room', 'really', 'also', 'some', 'time'
  ]);

  constructor() {
    this.destroyRef.onDestroy(() => this.destroyCharts());
    this.loadFromApi();
  }

  get hasData(): boolean {
    return this.allSubmissions.length > 0;
  }

  reloadFromApi(): void {
    this.loadFromApi();
  }

  resetFilters(): void {
    if (!this.hasData) {
      return;
    }

    this.selectedVenue = 'all';
    this.selectedQuestionnaire = 'all';
    this.selectedCategory = 'all';
    this.searchText = '';
    this.questionSort = 'lowest';
    this.minQuestionSampleSize = 30;
    this.minMenuSampleSize = 20;
    this.commentSearchText = '';
    this.commentSourceFilter = 'all';
    this.commentScoreFilter = 'all';
    this.commentPage = 1;
    this.commentPageSize = 25;
    this.menuExportNotice = '';
    this.fromDate = this.toInputDate(this.minDataTimestamp);
    this.toDate = this.toInputDate(this.maxDataTimestamp);
    this.applyFilters();
  }

  applyFilters(): void {
    if (!this.hasData) {
      return;
    }

    const fromTs = this.fromDate
      ? Date.parse(`${this.fromDate}T00:00:00.000Z`)
      : Number.NEGATIVE_INFINITY;
    const toTs = this.toDate
      ? Date.parse(`${this.toDate}T23:59:59.999Z`)
      : Number.POSITIVE_INFINITY;
    const rangeStart = Math.min(fromTs, toTs);
    const rangeEnd = Math.max(fromTs, toTs);
    const query = this.searchText.trim().toLowerCase();
    this.menuExportNotice = '';

    this.filteredSubmissions = this.allSubmissions.filter((submission) => {
      if (submission.createdAt < rangeStart || submission.createdAt > rangeEnd) {
        return false;
      }

      if (this.selectedVenue !== 'all' && submission.venueId !== this.selectedVenue) {
        return false;
      }

      if (this.selectedQuestionnaire !== 'all' && submission.questionnaireId !== this.selectedQuestionnaire) {
        return false;
      }

      if (query && !submission.searchIndex.includes(query)) {
        return false;
      }

      if (this.selectedCategory !== 'all' && !submission.responses.some((response) => response.category === this.selectedCategory)) {
        return false;
      }

      return true;
    });

    this.rebuildInsights();
  }

  scoreClass(score: number): string {
    if (score < 3) {
      return 'danger';
    }

    if (score < 4) {
      return 'warning';
    }

    return 'good';
  }

  venueLabel(venueId: string): string {
    const mappedName = this.venueNameById.get(this.normalizeVenueIdLookupKey(venueId));
    return mappedName ?? venueId;
  }

  get commentPageCount(): number {
    const count = Math.ceil(this.filteredCommentRows.length / this.commentPageSize);
    return Math.max(count, 1);
  }

  get commentRangeStart(): number {
    if (this.filteredCommentRows.length === 0) {
      return 0;
    }

    return (this.commentPage - 1) * this.commentPageSize + 1;
  }

  get commentRangeEnd(): number {
    if (this.filteredCommentRows.length === 0) {
      return 0;
    }

    return Math.min(this.commentPage * this.commentPageSize, this.filteredCommentRows.length);
  }

  onCommentDrilldownFiltersChange(): void {
    this.commentPage = 1;
    this.refreshCommentDrilldown();
  }

  setCommentPageSize(pageSize: number | string): void {
    const parsedSize = typeof pageSize === 'number' ? pageSize : Number(pageSize);
    if (!Number.isFinite(parsedSize) || parsedSize < 1) {
      return;
    }

    this.commentPageSize = Math.floor(parsedSize);
    this.commentPage = 1;
    this.refreshCommentDrilldown();
  }

  changeCommentPage(delta: number): void {
    const targetPage = this.commentPage + delta;
    if (targetPage < 1 || targetPage > this.commentPageCount) {
      return;
    }

    this.commentPage = targetPage;
    this.refreshCommentDrilldown();
  }

  commentSourceLabel(row: CommentDrilldownRow): string {
    if (row.sourceType === 'menu') {
      if (row.courseName && row.menuItemName) {
        return `Menu (${row.courseName} / ${row.menuItemName})`;
      }

      if (row.menuItemName) {
        return `Menu (${row.menuItemName})`;
      }

      return 'Menu Item';
    }

    return 'Question';
  }

  downloadAllCommentsCsv(): void {
    if (this.allCommentRows.length === 0) {
      return;
    }

    const headers = [
      'Date',
      'Guest Name',
      'Event Title',
      'Venue',
      'Questionnaire',
      'Category',
      'Question ID',
      'Source',
      'Course',
      'Menu Item',
      'Rating',
      'Comment',
      'Event ID',
      'Guest ID',
      'Venue ID'
    ];

    const rows = this.allCommentRows.map((row) => {
      const scoreText = row.score === null ? 'Unscored' : row.score.toFixed(1);
      const dateText = new Date(row.createdAt).toISOString();
      return [
        dateText,
        row.guestName,
        row.title,
        this.venueLabel(row.venueId),
        row.questionnaireId,
        row.category,
        row.questionId,
        this.commentSourceLabel(row),
        row.courseName ?? '',
        row.menuItemName ?? '',
        scoreText,
        row.text,
        row.eventId,
        row.guestId,
        row.venueId
      ];
    });

    const csvLines = [headers, ...rows].map((line) => line.map((value) => this.csvCell(value)).join(','));
    const csvText = `\uFEFF${csvLines.join('\r\n')}`;
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    const stamp = new Date().toISOString().replace(/[:]/g, '-').slice(0, 19);
    link.download = `feedback-comments-ratings-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
  }

  downloadVenueMenuFeedbackCsv(): void {
    const menuMap = new Map<string, {
      venueId: string;
      courseName: string;
      menuItemName: string;
      scoreSum: number;
      scoreCount: number;
      comments: MenuItemCommentExportRow[];
    }>();

    for (const submission of this.filteredSubmissions) {
      for (const response of submission.responses) {
        for (const menuRating of response.menuRatings) {
          const key = `${submission.venueId}||${menuRating.courseName}||${menuRating.menuItemName}`;
          const aggregate = menuMap.get(key) ?? {
            venueId: submission.venueId,
            courseName: menuRating.courseName,
            menuItemName: menuRating.menuItemName,
            scoreSum: 0,
            scoreCount: 0,
            comments: []
          };

          if (menuRating.score !== null) {
            aggregate.scoreSum += menuRating.score;
            aggregate.scoreCount += 1;
          }

          for (const feedbackText of menuRating.feedbackTexts) {
            aggregate.comments.push({
              comment: feedbackText,
              score: menuRating.score,
              guestName: submission.guestName,
              eventTitle: submission.title,
              questionnaireId: submission.questionnaireId,
              createdAt: submission.createdAt
            });
          }

          menuMap.set(key, aggregate);
        }
      }
    }

    if (menuMap.size === 0) {
      this.menuExportNotice = 'No menu ratings/comments are available for the current filters.';
      return;
    }

    const headers = [
      'Venue',
      'Course',
      'Menu Item',
      'Average Rating',
      'Rating Count',
      'Comment Count',
      'Comment Rating',
      'Customer Comment',
      'Guest Name',
      'Event',
      'Questionnaire',
      'Comment Date'
    ];

    const rows: Array<Array<string | number>> = [];
    const sortedAggregates = [...menuMap.values()].sort((left, right) => {
      const venueCompare = this.venueLabel(left.venueId).localeCompare(this.venueLabel(right.venueId), undefined, { sensitivity: 'base' });
      if (venueCompare !== 0) {
        return venueCompare;
      }

      const courseCompare = left.courseName.localeCompare(right.courseName, undefined, { sensitivity: 'base' });
      if (courseCompare !== 0) {
        return courseCompare;
      }

      return left.menuItemName.localeCompare(right.menuItemName, undefined, { sensitivity: 'base' });
    });

    for (const aggregate of sortedAggregates) {
      const average = aggregate.scoreCount > 0 ? (aggregate.scoreSum / aggregate.scoreCount).toFixed(2) : 'Unscored';
      const sortedComments = [...aggregate.comments].sort((left, right) => right.createdAt - left.createdAt);

      if (sortedComments.length === 0) {
        rows.push([
          this.venueLabel(aggregate.venueId),
          aggregate.courseName,
          aggregate.menuItemName,
          average,
          aggregate.scoreCount,
          0,
          '',
          '',
          '',
          '',
          '',
          ''
        ]);
        continue;
      }

      for (const comment of sortedComments) {
        rows.push([
          this.venueLabel(aggregate.venueId),
          aggregate.courseName,
          aggregate.menuItemName,
          average,
          aggregate.scoreCount,
          sortedComments.length,
          comment.score === null ? 'Unscored' : comment.score.toFixed(1),
          comment.comment,
          comment.guestName,
          comment.eventTitle,
          comment.questionnaireId,
          new Date(comment.createdAt).toISOString()
        ]);
      }
    }

    const csvLines = [headers, ...rows].map((line) => line.map((value) => this.csvCell(value)).join(','));
    const csvText = `\uFEFF${csvLines.join('\r\n')}`;
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    const venueNamePart = this.selectedVenue === 'all'
      ? 'all-venues'
      : this.toFileSafeSegment(this.venueLabel(this.selectedVenue));
    const stamp = new Date().toISOString().replace(/[:]/g, '-').slice(0, 19);
    link.download = `venue-menu-ratings-comments-${venueNamePart}-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
    const totalComments = rows.filter((row) => String(row[7]).trim().length > 0).length;
    this.menuExportNotice = `Downloaded ${sortedAggregates.length} menu items with ${totalComments} comments.`;
  }

  private async loadFromFile(file: File): Promise<void> {
    this.isProcessing = true;
    this.loadError = '';

    try {
      const contents = await file.text();
      const parsed = JSON.parse(contents) as unknown;
      if (!Array.isArray(parsed)) {
        throw new Error('Expected a JSON array exported from questionnaire_results.');
      }

      const submissions = this.normalizeSubmissions(parsed as RawFeedbackRecord[]);
      if (submissions.length === 0) {
        throw new Error('The file did not contain any usable feedback records.');
      }

      this.sourceFileName = file.name;
      this.allSubmissions = submissions;
      this.totalLoadedSubmissions = submissions.length;
      this.initializeFiltersFromData();
      this.applyFilters();
    } catch (error) {
      this.resetDataState();
      this.loadError = this.resolveErrorMessage(error);
    } finally {
      this.isProcessing = false;
    }
  }

  private loadFromApi(): void {
    this.isLoading = true;
    this.loadError = '';

    this.api.getFeedbackInsightsDataset()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dataset) => {
          this.isLoading = false;
          this.hydrateFromApiDataset(dataset);
        },
        error: () => {
          this.isLoading = false;
          this.resetDataState();
          this.loadError = 'Unable to load feedback data from API.';
        }
      });
  }

  private hydrateFromApiDataset(dataset: FeedbackInsightsDatasetResponse): void {
    const rawRecords = this.mapApiResultsToRawRecords(dataset.results);
    const submissions = this.normalizeSubmissions(rawRecords);
    if (submissions.length === 0) {
      this.resetDataState();
      this.loadError = 'No feedback records were returned by the API.';
      return;
    }

    this.venueNameById = new Map(
      dataset.venues.map((venue) => [this.normalizeVenueIdLookupKey(venue.id), venue.name])
    );
    this.venueMapFileName = '';
    this.sourceFileName = `API dataset generated ${new Date(dataset.generatedAtUtc).toLocaleString()}`;
    this.allSubmissions = submissions;
    this.totalLoadedSubmissions = submissions.length;
    this.initializeFiltersFromData();
    this.applyFilters();
  }

  private mapApiResultsToRawRecords(results: FeedbackInsightsResultDto[]): RawFeedbackRecord[] {
    return results.map((result) => ({
      _id: result.id,
      created: result.createdAtUtc,
      updated: result.updatedAtUtc ?? null,
      questionnaireId: result.questionnaireId,
      title: result.title,
      venueId: result.venueId,
      eventId: result.eventId ?? null,
      eventGuestId: result.eventGuestId ?? null,
      eventGuestName: result.eventGuestName,
      mailingList: result.mailingList,
      responses: (result.responses ?? []).map((response: FeedbackInsightsResponseDto) => ({
        questionId: response.questionId,
        contributesTo: response.contributesTo ?? null,
        responseScore: response.responseScore ?? null,
        responseValue: response.responseValue ?? null,
        furtherFeedbackValue: response.furtherFeedbackValue ?? null,
        completed: response.completed ?? null,
        menuRatings: (response.menuRatings ?? []).map((menu: FeedbackInsightsMenuRatingDto) => ({
          courseName: menu.courseName ?? null,
          menuItemName: menu.menuItemName ?? null,
          score: menu.score ?? null,
          furtherFeedbackValue: menu.furtherFeedbackValue ?? null
        }))
      }))
    }));
  }

  private async loadVenueMapFromFile(file: File): Promise<void> {
    this.isVenueMapProcessing = true;
    this.venueMapError = '';

    try {
      const contents = await file.text();
      const venueMap = this.parseVenueMapCsv(contents);
      if (venueMap.size === 0) {
        throw new Error('The venue CSV had no valid rows. Include `_id` and `name` values.');
      }

      this.venueNameById = venueMap;
      this.venueMapFileName = file.name;
      this.sortVenueOptionsByLabel();
    } catch (error) {
      this.venueMapError = this.resolveVenueMapErrorMessage(error);
    } finally {
      this.isVenueMapProcessing = false;
    }
  }

  private initializeFiltersFromData(): void {
    const venues = new Set<string>();
    const questionnaires = new Set<string>();
    const categories = new Set<string>();

    this.minDataTimestamp = Number.POSITIVE_INFINITY;
    this.maxDataTimestamp = Number.NEGATIVE_INFINITY;

    for (const submission of this.allSubmissions) {
      venues.add(submission.venueId);
      questionnaires.add(submission.questionnaireId);
      this.minDataTimestamp = Math.min(this.minDataTimestamp, submission.createdAt);
      this.maxDataTimestamp = Math.max(this.maxDataTimestamp, submission.createdAt);

      for (const response of submission.responses) {
        categories.add(response.category);
      }
    }

    this.venueOptions = [...venues];
    this.sortVenueOptionsByLabel();
    this.questionnaireOptions = [...questionnaires].sort((left, right) => left.localeCompare(right));
    this.categoryOptions = [...categories].sort((left, right) => left.localeCompare(right));

    this.selectedVenue = 'all';
    this.selectedQuestionnaire = 'all';
    this.selectedCategory = 'all';
    this.searchText = '';
    this.questionSort = 'lowest';
    this.minQuestionSampleSize = 30;
    this.minMenuSampleSize = 20;
    this.fromDate = this.toInputDate(this.minDataTimestamp);
    this.toDate = this.toInputDate(this.maxDataTimestamp);
  }

  private normalizeSubmissions(records: RawFeedbackRecord[]): NormalizedFeedbackSubmission[] {
    const normalized: NormalizedFeedbackSubmission[] = [];

    for (const record of records) {
      const createdAt = this.extractTimestamp(record.created) ?? this.extractTimestamp(record.updated);
      if (createdAt === null) {
        continue;
      }

      const submissionId = this.extractOid(record._id) ?? this.buildSyntheticId(record, createdAt);
      const questionnaireId = this.normalizeIdentifier(record.questionnaireId, 'unspecified');
      const title = this.normalizeIdentifier(record.title, 'Untitled Event');
      const venueId = this.extractOid(record.venueId) ?? 'unknown';
      const eventId = this.extractOid(record.eventId) ?? 'unknown';
      const guestId = this.extractOid(record.eventGuestId) ?? 'unknown';
      const guestName = this.normalizeIdentifier(record.eventGuestName, 'Anonymous');
      const mailingList = record.mailingList === true;

      const responses: NormalizedQuestionResponse[] = [];
      const searchParts: string[] = [questionnaireId, title, venueId, eventId, guestName];

      let scoreSum = 0;
      let scoreCount = 0;

      for (const rawResponse of record.responses ?? []) {
        const questionId = this.normalizeIdentifier(rawResponse.questionId, 'unknown-question');
        const category = this.normalizeCategory(rawResponse.contributesTo);
        const score = this.toFiniteNumber(rawResponse.responseScore);
        const feedbackTexts = this.normalizeFeedbackTexts([rawResponse.furtherFeedbackValue, rawResponse.responseValue]);
        const menuRatings: NormalizedMenuRating[] = [];

        for (const rawMenu of rawResponse.menuRatings ?? []) {
          const menuRating: NormalizedMenuRating = {
            courseName: this.normalizeIdentifier(rawMenu.courseName, 'Unspecified Course'),
            menuItemName: this.normalizeIdentifier(rawMenu.menuItemName, 'Unspecified Item'),
            score: this.toFiniteNumber(rawMenu.score),
            feedbackTexts: this.normalizeFeedbackTexts([rawMenu.furtherFeedbackValue])
          };

          menuRatings.push(menuRating);
          searchParts.push(menuRating.courseName, menuRating.menuItemName, ...menuRating.feedbackTexts);
        }

        const hasSignal = score !== null
          || feedbackTexts.length > 0
          || menuRatings.some((menuRating) => menuRating.score !== null || menuRating.feedbackTexts.length > 0);
        if (rawResponse.completed === false && !hasSignal) {
          continue;
        }

        const normalizedResponse: NormalizedQuestionResponse = {
          questionId,
          category,
          score,
          feedbackTexts,
          menuRatings
        };

        responses.push(normalizedResponse);
        searchParts.push(questionId, category, ...feedbackTexts);

        if (score !== null) {
          scoreSum += score;
          scoreCount += 1;
        }
      }

      const averageScore = scoreCount > 0 ? scoreSum / scoreCount : null;
      const searchIndex = searchParts.join(' ').toLowerCase();

      normalized.push({
        id: submissionId,
        createdAt,
        createdIso: new Date(createdAt).toISOString(),
        questionnaireId,
        title,
        venueId,
        eventId,
        guestId,
        guestName,
        mailingList,
        averageScore,
        responses,
        searchIndex
      });
    }

    return normalized.sort((left, right) => left.createdAt - right.createdAt);
  }

  private rebuildInsights(): void {
    this.scoreDistribution.fill(0);

    if (this.filteredSubmissions.length === 0) {
      this.summary = {
        submissions: 0,
        uniqueEvents: 0,
        uniqueGuests: 0,
        averageScore: 0,
        scoredResponses: 0,
        mailingListRate: 0,
        lowScoreShare: 0,
        feedbackComments: 0
      };
      this.monthlyTrend = [];
      this.categoryScores = [];
      this.questionRows = [];
      this.menuRows = [];
      this.keywordRows = [];
      this.lowCommentRows = [];
      this.submissionAlerts = [];
      this.strengthQuestions = [];
      this.improvementQuestions = [];
      this.allCommentRows = [];
      this.filteredCommentRows = [];
      this.pagedCommentRows = [];
      this.commentPage = 1;
      this.destroyCharts();
      return;
    }

    const eventIds = new Set<string>();
    const guestIds = new Set<string>();
    const monthlyMap = new Map<string, { submissions: number; scoreSum: number; scoreCount: number }>();
    const categoryMap = new Map<string, { scoreSum: number; scoreCount: number }>();
    const questionMap = new Map<string, {
      scoreSum: number;
      scoreCount: number;
      lowCount: number;
      commentCount: number;
      categories: Map<string, number>;
    }>();
    const menuMap = new Map<string, {
      courseName: string;
      menuItemName: string;
      scoreSum: number;
      scoreCount: number;
      commentCount: number;
    }>();
    const keywordMap = new Map<string, number>();
    const lowComments: LowCommentRow[] = [];
    const commentRows: CommentDrilldownRow[] = [];

    let mailingListOptInCount = 0;
    let overallScoreSum = 0;
    let overallScoreCount = 0;
    let lowScoreCount = 0;
    let feedbackCommentCount = 0;

    for (const submission of this.filteredSubmissions) {
      if (submission.eventId !== 'unknown') {
        eventIds.add(submission.eventId);
      }

      if (submission.guestId !== 'unknown') {
        guestIds.add(submission.guestId);
      }

      if (submission.mailingList) {
        mailingListOptInCount += 1;
      }

      const monthKey = this.toMonthKey(submission.createdAt);
      const monthAggregate = monthlyMap.get(monthKey) ?? { submissions: 0, scoreSum: 0, scoreCount: 0 };
      monthAggregate.submissions += 1;

      const submissionAverageScore = this.resolveSubmissionAverage(submission);
      if (submissionAverageScore !== null) {
        monthAggregate.scoreSum += submissionAverageScore;
        monthAggregate.scoreCount += 1;
      }
      monthlyMap.set(monthKey, monthAggregate);

      for (const response of submission.responses) {
        if (this.selectedCategory !== 'all' && response.category !== this.selectedCategory) {
          continue;
        }

        const questionAggregate = questionMap.get(response.questionId) ?? {
          scoreSum: 0,
          scoreCount: 0,
          lowCount: 0,
          commentCount: 0,
          categories: new Map<string, number>()
        };

        questionAggregate.categories.set(
          response.category,
          (questionAggregate.categories.get(response.category) ?? 0) + 1
        );

        if (response.score !== null) {
          questionAggregate.scoreSum += response.score;
          questionAggregate.scoreCount += 1;
          overallScoreSum += response.score;
          overallScoreCount += 1;

          const distributionIndex = this.scoreToBucket(response.score);
          this.scoreDistribution[distributionIndex] += 1;

          if (response.score <= 3) {
            questionAggregate.lowCount += 1;
            lowScoreCount += 1;
          }

          const categoryAggregate = categoryMap.get(response.category) ?? { scoreSum: 0, scoreCount: 0 };
          categoryAggregate.scoreSum += response.score;
          categoryAggregate.scoreCount += 1;
          categoryMap.set(response.category, categoryAggregate);
        }

        for (const text of response.feedbackTexts) {
          feedbackCommentCount += 1;
          questionAggregate.commentCount += 1;
          this.addKeywords(keywordMap, text);
          commentRows.push({
            text,
            score: response.score,
            questionId: response.questionId,
            category: response.category,
            sourceType: 'question',
            courseName: null,
            menuItemName: null,
            title: submission.title,
            venueId: submission.venueId,
            questionnaireId: submission.questionnaireId,
            eventId: submission.eventId,
            guestId: submission.guestId,
            guestName: submission.guestName,
            createdAt: submission.createdAt
          });

          if ((response.score ?? 5) <= 3) {
            lowComments.push({
              text,
              score: response.score ?? 0,
              questionId: response.questionId,
              category: response.category,
              title: submission.title,
              guestName: submission.guestName,
              venueId: submission.venueId,
              questionnaireId: submission.questionnaireId,
              createdAt: submission.createdAt
            });
          }
        }

        for (const menuRating of response.menuRatings) {
          if (this.selectedCategory !== 'all' && this.selectedCategory !== 'food') {
            continue;
          }

          if (menuRating.score !== null) {
            const menuKey = `${menuRating.courseName}||${menuRating.menuItemName}`;
            const menuAggregate = menuMap.get(menuKey) ?? {
              courseName: menuRating.courseName,
              menuItemName: menuRating.menuItemName,
              scoreSum: 0,
              scoreCount: 0,
              commentCount: 0
            };

            menuAggregate.scoreSum += menuRating.score;
            menuAggregate.scoreCount += 1;
            menuAggregate.commentCount += menuRating.feedbackTexts.length;
            menuMap.set(menuKey, menuAggregate);
          }

          for (const text of menuRating.feedbackTexts) {
            feedbackCommentCount += 1;
            this.addKeywords(keywordMap, text);
            commentRows.push({
              text,
              score: menuRating.score,
              questionId: response.questionId,
              category: 'food',
              sourceType: 'menu',
              courseName: menuRating.courseName,
              menuItemName: menuRating.menuItemName,
              title: submission.title,
              venueId: submission.venueId,
              questionnaireId: submission.questionnaireId,
              eventId: submission.eventId,
              guestId: submission.guestId,
              guestName: submission.guestName,
              createdAt: submission.createdAt
            });
            if ((menuRating.score ?? 5) <= 3) {
              lowComments.push({
                text,
                score: menuRating.score ?? 0,
                questionId: response.questionId,
                category: 'food',
                title: submission.title,
                guestName: submission.guestName,
                venueId: submission.venueId,
                questionnaireId: submission.questionnaireId,
                createdAt: submission.createdAt
              });
            }
          }
        }

        questionMap.set(response.questionId, questionAggregate);
      }
    }

    this.summary = {
      submissions: this.filteredSubmissions.length,
      uniqueEvents: eventIds.size,
      uniqueGuests: guestIds.size,
      averageScore: overallScoreCount > 0 ? overallScoreSum / overallScoreCount : 0,
      scoredResponses: overallScoreCount,
      mailingListRate: this.filteredSubmissions.length > 0
        ? (mailingListOptInCount / this.filteredSubmissions.length) * 100
        : 0,
      lowScoreShare: overallScoreCount > 0 ? (lowScoreCount / overallScoreCount) * 100 : 0,
      feedbackComments: feedbackCommentCount
    };

    this.monthlyTrend = [...monthlyMap.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([monthKey, aggregate]) => ({
        monthKey,
        monthLabel: this.formatMonthKey(monthKey),
        submissions: aggregate.submissions,
        averageScore: aggregate.scoreCount > 0 ? aggregate.scoreSum / aggregate.scoreCount : null
      }));

    this.categoryScores = [...categoryMap.entries()]
      .map(([category, aggregate]) => ({
        category,
        averageScore: aggregate.scoreCount > 0 ? aggregate.scoreSum / aggregate.scoreCount : 0,
        responseCount: aggregate.scoreCount
      }))
      .sort((left, right) => right.averageScore - left.averageScore);

    const unsortedQuestions: QuestionPerformanceRow[] = [...questionMap.entries()]
      .map(([questionId, aggregate]) => ({
        questionId,
        category: this.resolveDominantCategory(aggregate.categories),
        averageScore: aggregate.scoreCount > 0 ? aggregate.scoreSum / aggregate.scoreCount : 0,
        responseCount: aggregate.scoreCount,
        lowScoreShare: aggregate.scoreCount > 0 ? (aggregate.lowCount / aggregate.scoreCount) * 100 : 0,
        commentCount: aggregate.commentCount
      }))
      .filter((row) => row.responseCount >= this.minQuestionSampleSize);

    this.questionRows = [...unsortedQuestions].sort((left, right) => {
      if (this.questionSort === 'highest') {
        return right.averageScore - left.averageScore || right.responseCount - left.responseCount;
      }

      return left.averageScore - right.averageScore || right.responseCount - left.responseCount;
    });

    this.strengthQuestions = [...unsortedQuestions]
      .sort((left, right) => right.averageScore - left.averageScore || right.responseCount - left.responseCount)
      .slice(0, 5);

    this.improvementQuestions = [...unsortedQuestions]
      .sort((left, right) => left.averageScore - right.averageScore || right.responseCount - left.responseCount)
      .slice(0, 5);

    this.menuRows = [...menuMap.values()]
      .map((aggregate) => ({
        courseName: aggregate.courseName,
        menuItemName: aggregate.menuItemName,
        averageScore: aggregate.scoreCount > 0 ? aggregate.scoreSum / aggregate.scoreCount : 0,
        ratingCount: aggregate.scoreCount,
        commentCount: aggregate.commentCount
      }))
      .filter((row) => row.ratingCount >= this.minMenuSampleSize)
      .sort((left, right) => left.averageScore - right.averageScore);

    this.keywordRows = [...keywordMap.entries()]
      .map(([term, count]) => ({ term, count }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 20);

    this.lowCommentRows = lowComments
      .sort((left, right) => left.score - right.score || right.createdAt - left.createdAt)
      .slice(0, 12);

    this.submissionAlerts = this.filteredSubmissions
      .map((submission) => {
        const averageScore = this.resolveSubmissionAverage(submission);
        if (averageScore === null) {
          return null;
        }

        return {
          title: submission.title,
          venueId: submission.venueId,
          questionnaireId: submission.questionnaireId,
          averageScore,
          createdAt: submission.createdAt
        };
      })
      .filter((submission): submission is SubmissionAlertRow => submission !== null)
      .sort((left, right) => left.averageScore - right.averageScore || right.createdAt - left.createdAt)
      .slice(0, 10);

    this.allCommentRows = commentRows.sort((left, right) => right.createdAt - left.createdAt);
    this.refreshCommentDrilldown();

    this.scheduleChartRender();
  }

  private refreshCommentDrilldown(): void {
    const query = this.commentSearchText.trim().toLowerCase();

    this.filteredCommentRows = this.allCommentRows.filter((row) => {
      if (this.commentSourceFilter !== 'all' && row.sourceType !== this.commentSourceFilter) {
        return false;
      }

      if (this.commentScoreFilter === 'low' && ((row.score ?? Number.POSITIVE_INFINITY) > 3)) {
        return false;
      }

      if (this.commentScoreFilter === 'high' && ((row.score ?? Number.NEGATIVE_INFINITY) <= 3)) {
        return false;
      }

      if (this.commentScoreFilter === 'unscored' && row.score !== null) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchContent = [
        row.text,
        row.questionId,
        row.category,
        row.guestName,
        row.title,
        row.questionnaireId,
        row.courseName ?? '',
        row.menuItemName ?? '',
        this.venueLabel(row.venueId)
      ].join(' ').toLowerCase();

      return searchContent.includes(query);
    });

    const pageCount = this.commentPageCount;
    if (this.commentPage > pageCount) {
      this.commentPage = pageCount;
    }

    const pageStart = (this.commentPage - 1) * this.commentPageSize;
    this.pagedCommentRows = this.filteredCommentRows.slice(pageStart, pageStart + this.commentPageSize);
  }

  private csvCell(value: string | number | null | undefined): string {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
  }

  private toFileSafeSegment(value: string): string {
    const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return normalized || 'venue';
  }

  private resolveSubmissionAverage(submission: NormalizedFeedbackSubmission): number | null {
    if (this.selectedCategory === 'all') {
      return submission.averageScore;
    }

    let scoreSum = 0;
    let scoreCount = 0;

    for (const response of submission.responses) {
      if (response.category !== this.selectedCategory) {
        continue;
      }

      if (response.score !== null) {
        scoreSum += response.score;
        scoreCount += 1;
      }
    }

    return scoreCount > 0 ? scoreSum / scoreCount : null;
  }

  private resolveDominantCategory(categories: Map<string, number>): string {
    let dominantCategory = 'uncategorized';
    let dominantCount = -1;

    for (const [category, count] of categories.entries()) {
      if (count > dominantCount) {
        dominantCategory = category;
        dominantCount = count;
      }
    }

    return dominantCategory;
  }

  private scheduleChartRender(): void {
    setTimeout(() => this.renderCharts(), 0);
  }

  private renderCharts(): void {
    this.renderTrendChart();
    this.renderCategoryChart();
    this.renderDistributionChart();
  }

  private renderTrendChart(): void {
    this.trendChart?.destroy();
    this.trendChart = null;

    if (!this.trendCanvas || this.monthlyTrend.length === 0) {
      return;
    }

    this.trendChart = new ChartJs(this.trendCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.monthlyTrend.map((point) => point.monthLabel),
        datasets: [
          {
            type: 'bar',
            label: 'Submissions',
            data: this.monthlyTrend.map((point) => point.submissions),
            yAxisID: 'submissions',
            borderRadius: 6,
            maxBarThickness: 26,
            backgroundColor: '#bfdbfe'
          },
          {
            type: 'line',
            label: 'Average Score',
            data: this.monthlyTrend.map((point) => point.averageScore),
            yAxisID: 'score',
            borderColor: '#1d4ed8',
            backgroundColor: '#1d4ed8',
            tension: 0.28,
            pointRadius: 2.6,
            pointHoverRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12
            }
          }
        },
        scales: {
          score: {
            type: 'linear',
            position: 'left',
            min: 0,
            max: 5,
            ticks: { stepSize: 1 }
          },
          submissions: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }

  private renderCategoryChart(): void {
    this.categoryChart?.destroy();
    this.categoryChart = null;

    if (!this.categoryCanvas || this.categoryScores.length === 0) {
      return;
    }

    this.categoryChart = new ChartJs(this.categoryCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.categoryScores.map((row) => this.normalizeCategoryLabel(row.category)),
        datasets: [
          {
            label: 'Average Score',
            data: this.categoryScores.map((row) => row.averageScore),
            borderRadius: 8,
            maxBarThickness: 28,
            backgroundColor: ['#1d4ed8', '#0ea5e9', '#2563eb', '#3b82f6', '#38bdf8', '#60a5fa']
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }

  private renderDistributionChart(): void {
    this.distributionChart?.destroy();
    this.distributionChart = null;

    if (!this.distributionCanvas || this.summary.scoredResponses === 0) {
      return;
    }

    this.distributionChart = new ChartJs(this.distributionCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.scoreDistributionLabels,
        datasets: [
          {
            label: 'Response Count',
            data: this.scoreDistribution,
            borderRadius: 8,
            backgroundColor: ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#1d4ed8']
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 0,
              minRotation: 0
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private destroyCharts(): void {
    this.trendChart?.destroy();
    this.trendChart = null;
    this.categoryChart?.destroy();
    this.categoryChart = null;
    this.distributionChart?.destroy();
    this.distributionChart = null;
  }

  private addKeywords(store: Map<string, number>, rawText: string): void {
    const normalized = rawText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const words = normalized.split(/\s+/);

    for (const word of words) {
      if (word.length < 3 || this.stopWords.has(word) || /^\d+$/.test(word)) {
        continue;
      }

      store.set(word, (store.get(word) ?? 0) + 1);
    }
  }

  private normalizeFeedbackTexts(values: Array<string | null | undefined>): string[] {
    const normalized: string[] = [];

    for (const rawValue of values) {
      const value = (rawValue ?? '').replace(/\s+/g, ' ').trim();
      if (!value) {
        continue;
      }

      if (value.length > 260) {
        normalized.push(`${value.slice(0, 257)}...`);
      } else {
        normalized.push(value);
      }
    }

    return normalized;
  }

  private normalizeCategory(rawCategory: string | null | undefined): string {
    const value = (rawCategory ?? '').trim().toLowerCase();
    return value || 'uncategorized';
  }

  private normalizeIdentifier(rawValue: string | null | undefined, fallback: string): string {
    const value = (rawValue ?? '').trim();
    return value || fallback;
  }

  private extractOid(reference: RawDocumentReference | string | null | undefined): string | null {
    if (typeof reference === 'string') {
      const trimmed = reference.trim();
      return trimmed.length > 0 ? trimmed : null;
    }

    const value = reference?.$oid?.trim();
    return value && value.length > 0 ? value : null;
  }

  private extractTimestamp(dateValue: RawDateValue | string | null | undefined): number | null {
    const date = typeof dateValue === 'string' ? dateValue : dateValue?.$date;
    if (!date) {
      return null;
    }

    const timestamp = Date.parse(date);
    return Number.isFinite(timestamp) ? timestamp : null;
  }

  private buildSyntheticId(record: RawFeedbackRecord, createdAt: number): string {
    const parts = [
      this.normalizeIdentifier(record.title, 'submission'),
      this.normalizeIdentifier(record.questionnaireId, 'questionnaire'),
      String(createdAt)
    ];
    return parts.join(':');
  }

  private toFiniteNumber(value: number | null | undefined): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    return Number.isFinite(value) ? value : null;
  }

  private toMonthKey(timestamp: number): string {
    return new Date(timestamp).toISOString().slice(0, 7);
  }

  private formatMonthKey(monthKey: string): string {
    const [yearString, monthString] = monthKey.split('-');
    const year = Number(yearString);
    const month = Number(monthString);
    if (!Number.isFinite(year) || !Number.isFinite(month)) {
      return monthKey;
    }

    const date = new Date(Date.UTC(year, month - 1, 1));
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  private scoreToBucket(score: number): number {
    if (score >= 4) {
      return 4;
    }

    if (score >= 3) {
      return 3;
    }

    if (score >= 2) {
      return 2;
    }

    if (score >= 1) {
      return 1;
    }

    return 0;
  }

  private normalizeCategoryLabel(category: string): string {
    return category.replace(/[-_]+/g, ' ');
  }

  private toInputDate(timestamp: number): string {
    return new Date(timestamp).toISOString().slice(0, 10);
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Could not parse that file. Verify it is valid questionnaire_results JSON.';
  }

  private resolveVenueMapErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Could not parse venue CSV. Ensure it has `_id` and `name` columns.';
  }

  private parseVenueMapCsv(contents: string): Map<string, string> {
    const rows = this.parseCsvRows(contents);
    if (rows.length < 2) {
      throw new Error('Venue CSV must include a header row and at least one data row.');
    }

    const header = rows[0].map((value) => this.normalizeCsvHeader(value));
    const idIndex = header.findIndex((column) => column === '_id' || column === 'id' || column === 'venueid' || column === 'venue_id');
    const nameIndex = header.findIndex((column) => column === 'name' || column === 'venuename' || column === 'venue_name');

    if (idIndex < 0 || nameIndex < 0) {
      throw new Error('Venue CSV must include `_id` and `name` columns.');
    }

    const map = new Map<string, string>();

    for (let index = 1; index < rows.length; index += 1) {
      const row = rows[index];
      if (!row || row.length === 0) {
        continue;
      }

      const rawId = (row[idIndex] ?? '').trim();
      const rawName = (row[nameIndex] ?? '').trim();
      if (!rawId || !rawName) {
        continue;
      }

      map.set(this.normalizeVenueIdLookupKey(rawId), rawName);
    }

    return map;
  }

  private parseCsvRows(contents: string): string[][] {
    const normalized = contents.replace(/^\uFEFF/, '');
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentValue = '';
    let inQuotes = false;

    for (let index = 0; index < normalized.length; index += 1) {
      const char = normalized[index];

      if (char === '"') {
        const next = normalized[index + 1];
        if (inQuotes && next === '"') {
          currentValue += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (char === ',' && !inQuotes) {
        currentRow.push(currentValue);
        currentValue = '';
        continue;
      }

      if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && normalized[index + 1] === '\n') {
          index += 1;
        }

        currentRow.push(currentValue);
        if (!this.isCsvRowEmpty(currentRow)) {
          rows.push(currentRow);
        }

        currentRow = [];
        currentValue = '';
        continue;
      }

      currentValue += char;
    }

    currentRow.push(currentValue);
    if (!this.isCsvRowEmpty(currentRow)) {
      rows.push(currentRow);
    }

    return rows;
  }

  private isCsvRowEmpty(row: string[]): boolean {
    return row.every((cell) => cell.trim().length === 0);
  }

  private normalizeCsvHeader(rawHeader: string): string {
    return rawHeader.trim().replace(/[\s-]+/g, '_').toLowerCase();
  }

  private normalizeVenueIdLookupKey(value: string): string {
    const trimmed = value.trim().replace(/^"+|"+$/g, '');
    const oidMatch = trimmed.match(/[a-f0-9]{24}/i);
    return (oidMatch ? oidMatch[0] : trimmed).toLowerCase();
  }

  private sortVenueOptionsByLabel(): void {
    this.venueOptions.sort((left, right) => this.venueLabel(left).localeCompare(this.venueLabel(right), undefined, { sensitivity: 'base' }));
  }

  private resetDataState(): void {
    this.sourceFileName = '';
    this.venueMapFileName = '';
    this.totalLoadedSubmissions = 0;
    this.allSubmissions = [];
    this.filteredSubmissions = [];
    this.venueOptions = [];
    this.questionnaireOptions = [];
    this.categoryOptions = [];
    this.venueNameById = new Map<string, string>();
    this.venueMapError = '';
    this.fromDate = '';
    this.toDate = '';
    this.searchText = '';
    this.summary = {
      submissions: 0,
      uniqueEvents: 0,
      uniqueGuests: 0,
      averageScore: 0,
      scoredResponses: 0,
      mailingListRate: 0,
      lowScoreShare: 0,
      feedbackComments: 0
    };
    this.monthlyTrend = [];
    this.categoryScores = [];
    this.questionRows = [];
    this.menuRows = [];
    this.keywordRows = [];
    this.lowCommentRows = [];
    this.submissionAlerts = [];
    this.strengthQuestions = [];
    this.improvementQuestions = [];
    this.allCommentRows = [];
    this.filteredCommentRows = [];
    this.pagedCommentRows = [];
    this.commentSearchText = '';
    this.commentSourceFilter = 'all';
    this.commentScoreFilter = 'all';
    this.commentPage = 1;
    this.commentPageSize = 25;
    this.destroyCharts();
  }
}
