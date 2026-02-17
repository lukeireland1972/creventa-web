import { Component, DestroyRef, ElementRef, ViewChild, inject } from '@angular/core';
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart as ChartJs, registerables } from 'chart.js';

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
  menuRatings?: RawMenuRating[] | null;
}

interface RawFeedbackRecord {
  _id?: RawDocumentReference | null;
  created?: RawDateValue | null;
  updated?: RawDateValue | null;
  questionnaireId?: string | null;
  title?: string | null;
  venueId?: RawDocumentReference | null;
  eventId?: RawDocumentReference | null;
  eventGuestId?: RawDocumentReference | null;
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
  createdAt: number;
}

interface SubmissionAlertRow {
  title: string;
  venueId: string;
  questionnaireId: string;
  averageScore: number;
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

  @ViewChild('trendCanvas')
  private trendCanvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('categoryCanvas')
  private categoryCanvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('distributionCanvas')
  private distributionCanvas?: ElementRef<HTMLCanvasElement>;

  isDropActive = false;
  isProcessing = false;
  loadError = '';
  sourceFileName = '';

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

  totalLoadedSubmissions = 0;

  private minDataTimestamp = 0;
  private maxDataTimestamp = 0;

  private trendChart: ChartJs | null = null;
  private categoryChart: ChartJs | null = null;
  private distributionChart: ChartJs | null = null;

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
  }

  get hasData(): boolean {
    return this.allSubmissions.length > 0;
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.item(0);
    if (!file) {
      return;
    }

    if (input) {
      input.value = '';
    }

    void this.loadFromFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDropActive = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDropActive = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDropActive = false;
    const file = event.dataTransfer?.files?.item(0);
    if (!file) {
      return;
    }

    void this.loadFromFile(file);
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
      this.isDropActive = false;
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

    this.venueOptions = [...venues].sort((left, right) => left.localeCompare(right));
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

          if ((response.score ?? 5) <= 3) {
            lowComments.push({
              text,
              score: response.score ?? 0,
              questionId: response.questionId,
              category: response.category,
              title: submission.title,
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
            if ((menuRating.score ?? 5) <= 3) {
              lowComments.push({
                text,
                score: menuRating.score ?? 0,
                questionId: response.questionId,
                category: 'food',
                title: submission.title,
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

    this.scheduleChartRender();
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

  private extractOid(reference: RawDocumentReference | null | undefined): string | null {
    const value = reference?.$oid?.trim();
    return value && value.length > 0 ? value : null;
  }

  private extractTimestamp(dateValue: RawDateValue | null | undefined): number | null {
    const date = dateValue?.$date;
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

  private resetDataState(): void {
    this.sourceFileName = '';
    this.totalLoadedSubmissions = 0;
    this.allSubmissions = [];
    this.filteredSubmissions = [];
    this.venueOptions = [];
    this.questionnaireOptions = [];
    this.categoryOptions = [];
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
    this.destroyCharts();
  }
}
