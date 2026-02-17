import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, DestroyRef, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ApiService,
  CreateEnquiryDocumentShareLinkRequest,
  EnquiryDocumentDto,
  EnquiryDocumentShareLinkResponse,
  UpdateEnquiryDocumentRequest,
  UploadEnquiryDocumentRequest
} from '../../../../services/api.service';

type UploadCategory = 'Contract' | 'Floor Plan' | 'Menu' | 'BEO' | 'Invoice' | 'Other';

@Component({
  selector: 'app-enquiry-documents',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnChanges, OnDestroy {
  @Input() enquiryId: string | null = null;
  @Input() enquiryStatus: string | null = null;

  readonly categories: UploadCategory[] = ['Contract', 'Floor Plan', 'Menu', 'BEO', 'Invoice', 'Other'];
  readonly allowedDocumentExtensions = ['pdf', 'docx', 'xlsx', 'png', 'jpg', 'jpeg'];
  readonly maxDocumentBytes = 25 * 1024 * 1024;

  documents: EnquiryDocumentDto[] = [];
  loading = false;
  loadingError = '';
  busyMessage = '';
  feedbackMessage = '';

  categoryFilter = 'All';
  searchTerm = '';
  private searchDebounceHandle: ReturnType<typeof setTimeout> | null = null;

  pendingFile: File | null = null;
  pendingCategory: UploadCategory = 'Other';
  dropActive = false;
  uploadBusy = false;
  uploadProgressPercent = 0;
  uploadError = '';

  deletingDocumentId: string | null = null;
  renamingDocumentId: string | null = null;
  sharingDocumentId: string | null = null;
  generatingBeo = false;

  versionHistoryDocument: EnquiryDocumentDto | null = null;
  versionHistoryRows: EnquiryDocumentDto[] = [];
  versionHistoryLoading = false;
  versionHistoryError = '';

  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  get canGenerateBeo(): boolean {
    return this.enquiryStatus === 'Confirmed';
  }

  get pendingFileLabel(): string {
    if (!this.pendingFile) {
      return '';
    }

    return `${this.pendingFile.name} (${this.humanFileSize(this.pendingFile.size)})`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enquiryId']) {
      this.resetTransientState();
      if (this.enquiryId) {
        this.loadDocuments();
      } else {
        this.documents = [];
      }
      return;
    }

    if ((changes['enquiryStatus'] || changes['enquiryId']) && !this.canGenerateBeo) {
      this.generatingBeo = false;
    }
  }

  ngOnDestroy(): void {
    if (this.searchDebounceHandle) {
      clearTimeout(this.searchDebounceHandle);
      this.searchDebounceHandle = null;
    }
  }

  onCategoryFilterChange(value: string): void {
    this.categoryFilter = value || 'All';
    this.loadDocuments();
  }

  onSearchTermInput(value: string): void {
    this.searchTerm = value ?? '';
    if (this.searchDebounceHandle) {
      clearTimeout(this.searchDebounceHandle);
    }

    this.searchDebounceHandle = setTimeout(() => {
      this.loadDocuments();
    }, 250);
  }

  onPendingCategoryChange(value: string): void {
    this.pendingCategory = this.coerceCategory(value);
    this.uploadError = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dropActive = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dropActive = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dropActive = false;

    const file = event.dataTransfer?.files?.item(0);
    if (file) {
      this.queueFile(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0) ?? null;
    if (file) {
      this.queueFile(file);
    }
    input.value = '';
  }

  clearPendingFile(): void {
    this.pendingFile = null;
    this.uploadProgressPercent = 0;
    this.uploadError = '';
  }

  uploadPendingDocument(): void {
    if (!this.enquiryId || !this.pendingFile || this.uploadBusy) {
      return;
    }

    this.uploadBusy = true;
    this.uploadError = '';
    this.feedbackMessage = '';
    this.uploadProgressPercent = 0;

    this.readFileAsBase64(this.pendingFile)
      .then((base64Content) => {
        const payload: UploadEnquiryDocumentRequest = {
          fileName: this.pendingFile!.name,
          mimeType: this.resolveMimeType(this.pendingFile!),
          category: this.pendingCategory,
          base64Content
        };

        this.api
          .uploadEnquiryDocumentWithProgress(this.enquiryId!, payload)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (event) => {
              if (event.type === HttpEventType.UploadProgress) {
                const totalBytes = event.total ?? payload.base64Content.length;
                if (totalBytes > 0) {
                  this.uploadProgressPercent = Math.min(100, Math.round((event.loaded / totalBytes) * 100));
                }
                return;
              }

              if (event.type === HttpEventType.Response) {
                this.uploadBusy = false;
                this.uploadProgressPercent = 100;
                this.pendingFile = null;
                this.pendingCategory = 'Other';
                this.feedbackMessage = 'Document uploaded.';
                this.loadDocuments();
              }
            },
            error: (error) => {
              this.uploadBusy = false;
              this.uploadProgressPercent = 0;
              this.uploadError = typeof error?.error === 'string'
                ? error.error
                : 'Unable to upload document.';
            }
          });
      })
      .catch(() => {
        this.uploadBusy = false;
        this.uploadProgressPercent = 0;
        this.uploadError = 'Unable to read the selected file.';
      });
  }

  generateBeo(): void {
    if (!this.enquiryId || !this.canGenerateBeo || this.generatingBeo) {
      return;
    }

    this.generatingBeo = true;
    this.feedbackMessage = '';
    this.uploadError = '';
    this.busyMessage = 'Generating BEO...';

    this.api.generateEnquiryBeo(this.enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.generatingBeo = false;
          this.busyMessage = '';
          this.feedbackMessage = 'BEO generated successfully.';
          this.loadDocuments();
          if (result.downloadUrl) {
            window.open(result.downloadUrl, '_blank', 'noopener');
          }
        },
        error: (error) => {
          this.generatingBeo = false;
          this.busyMessage = '';
          this.uploadError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to generate BEO.';
        }
      });
  }

  downloadDocument(document: EnquiryDocumentDto): void {
    window.open(document.downloadUrl || `/api/documents/${document.id}`, '_blank', 'noopener');
  }

  previewDocument(document: EnquiryDocumentDto): void {
    if (!this.canPreview(document)) {
      return;
    }

    window.open(document.downloadUrl || `/api/documents/${document.id}`, '_blank', 'noopener');
  }

  renameDocument(document: EnquiryDocumentDto): void {
    if (!this.enquiryId || this.renamingDocumentId) {
      return;
    }

    const nextName = window.prompt('Rename document', document.fileName);
    if (nextName === null) {
      return;
    }

    const trimmed = nextName.trim();
    if (!trimmed) {
      this.uploadError = 'File name cannot be blank.';
      return;
    }

    this.renamingDocumentId = document.id;
    this.uploadError = '';

    const payload: UpdateEnquiryDocumentRequest = {
      fileName: trimmed,
      renameAllVersions: true
    };

    this.api.updateEnquiryDocument(this.enquiryId, document.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.renamingDocumentId = null;
          this.feedbackMessage = 'Document renamed.';
          this.loadDocuments();
        },
        error: (error) => {
          this.renamingDocumentId = null;
          this.uploadError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to rename document.';
        }
      });
  }

  deleteDocument(document: EnquiryDocumentDto): void {
    if (!this.enquiryId || this.deletingDocumentId) {
      return;
    }

    const confirmed = window.confirm(`Delete "${document.fileName}"?`);
    if (!confirmed) {
      return;
    }

    this.deletingDocumentId = document.id;
    this.uploadError = '';

    this.api.deleteEnquiryDocument(this.enquiryId, document.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletingDocumentId = null;
          this.feedbackMessage = 'Document deleted.';
          this.loadDocuments();
        },
        error: (error) => {
          this.deletingDocumentId = null;
          this.uploadError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to delete document.';
        }
      });
  }

  shareDocument(document: EnquiryDocumentDto): void {
    if (!this.enquiryId || this.sharingDocumentId) {
      return;
    }

    this.sharingDocumentId = document.id;
    this.uploadError = '';
    this.feedbackMessage = '';

    const payload: CreateEnquiryDocumentShareLinkRequest = {
      expiresInMinutes: 24 * 60
    };

    this.api.createEnquiryDocumentShareLink(this.enquiryId, document.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: EnquiryDocumentShareLinkResponse) => {
          this.sharingDocumentId = null;
          void this.copyShareUrl(result.shareUrl);
          this.feedbackMessage = `Share link copied. Expires ${new Date(result.expiresAtUtc).toLocaleString()}.`;
        },
        error: (error) => {
          this.sharingDocumentId = null;
          this.uploadError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to create share link.';
        }
      });
  }

  showVersionHistory(document: EnquiryDocumentDto): void {
    if (!this.enquiryId) {
      return;
    }

    this.versionHistoryDocument = document;
    this.versionHistoryRows = [];
    this.versionHistoryError = '';
    this.versionHistoryLoading = true;

    this.api.getEnquiryDocumentVersions(this.enquiryId, document.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          this.versionHistoryLoading = false;
          this.versionHistoryRows = [...rows].sort((left, right) => right.versionNumber - left.versionNumber);
        },
        error: (error) => {
          this.versionHistoryLoading = false;
          this.versionHistoryRows = [];
          this.versionHistoryError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to load version history.';
        }
      });
  }

  closeVersionHistory(): void {
    this.versionHistoryDocument = null;
    this.versionHistoryRows = [];
    this.versionHistoryError = '';
  }

  canPreview(document: EnquiryDocumentDto): boolean {
    if (document.canPreview) {
      return true;
    }

    const mime = (document.mimeType || '').toLowerCase();
    return mime === 'application/pdf' || mime.startsWith('image/');
  }

  humanFileSize(size: number): string {
    if (size < 1024) {
      return `${size} B`;
    }
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }

  fileTypeLabel(document: EnquiryDocumentDto): string {
    const extension = this.extensionOf(document.fileName);
    if (extension) {
      return extension.toUpperCase();
    }

    const mime = document.mimeType.toLowerCase();
    if (mime.includes('pdf')) {
      return 'PDF';
    }
    if (mime.includes('image')) {
      return 'Image';
    }
    if (mime.includes('spreadsheet') || mime.includes('excel')) {
      return 'Spreadsheet';
    }
    if (mime.includes('wordprocessingml') || mime.includes('msword')) {
      return 'Word';
    }
    return 'File';
  }

  private loadDocuments(): void {
    if (!this.enquiryId) {
      this.documents = [];
      return;
    }

    this.loading = true;
    this.loadingError = '';

    const category = this.categoryFilter.toLowerCase() === 'all' ? undefined : this.categoryFilter;
    const search = this.searchTerm.trim() || undefined;

    this.api.getEnquiryDocuments(this.enquiryId, category, search)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (documents) => {
          this.loading = false;
          this.documents = [...documents].sort((left, right) => {
            const byUploadedAt = new Date(right.uploadedAtUtc).getTime() - new Date(left.uploadedAtUtc).getTime();
            if (byUploadedAt !== 0) {
              return byUploadedAt;
            }

            return right.versionNumber - left.versionNumber;
          });
        },
        error: (error) => {
          this.loading = false;
          this.documents = [];
          this.loadingError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to load documents.';
        }
      });
  }

  private queueFile(file: File): void {
    this.uploadError = '';
    this.feedbackMessage = '';

    const extension = this.extensionOf(file.name);
    if (!extension || !this.allowedDocumentExtensions.includes(extension)) {
      this.pendingFile = null;
      this.uploadError = 'Allowed file types: PDF, DOCX, XLSX, PNG, JPG.';
      return;
    }

    if (file.size <= 0 || file.size > this.maxDocumentBytes) {
      this.pendingFile = null;
      this.uploadError = 'File size must be between 1 byte and 25MB.';
      return;
    }

    this.pendingFile = file;
    this.uploadProgressPercent = 0;
  }

  private resolveMimeType(file: File): string {
    const extension = this.extensionOf(file.name);
    if (extension === 'pdf') {
      return 'application/pdf';
    }
    if (extension === 'docx') {
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    if (extension === 'xlsx') {
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    if (extension === 'png') {
      return 'image/png';
    }
    if (extension === 'jpg' || extension === 'jpeg') {
      return 'image/jpeg';
    }

    return file.type || 'application/octet-stream';
  }

  private extensionOf(fileName: string): string {
    const parts = fileName.toLowerCase().split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const text = typeof reader.result === 'string' ? reader.result : '';
        const splitIndex = text.indexOf(',');
        if (splitIndex < 0) {
          reject(new Error('Invalid data URL'));
          return;
        }
        resolve(text.substring(splitIndex + 1));
      };
      reader.readAsDataURL(file);
    });
  }

  private async copyShareUrl(url: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      return;
    } catch {
      window.prompt('Copy this share link', url);
    }
  }

  private coerceCategory(value: string): UploadCategory {
    return this.categories.includes(value as UploadCategory) ? (value as UploadCategory) : 'Other';
  }

  private resetTransientState(): void {
    this.documents = [];
    this.loading = false;
    this.loadingError = '';
    this.busyMessage = '';
    this.feedbackMessage = '';
    this.uploadBusy = false;
    this.uploadProgressPercent = 0;
    this.uploadError = '';
    this.pendingFile = null;
    this.pendingCategory = 'Other';
    this.deletingDocumentId = null;
    this.renamingDocumentId = null;
    this.sharingDocumentId = null;
    this.generatingBeo = false;
    this.versionHistoryDocument = null;
    this.versionHistoryRows = [];
    this.versionHistoryError = '';
    this.versionHistoryLoading = false;
  }
}
