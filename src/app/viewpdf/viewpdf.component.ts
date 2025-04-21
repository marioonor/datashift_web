import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { PdfComponent } from '../pdf/pdf.component';
import { Router } from '@angular/router';
import {
  FindOptions,
  NgxExtendedPdfViewerService,
} from 'ngx-extended-pdf-viewer';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

interface ControlKeywordsDTO {
  controlIdentifier: string;
  controlName: string;
  keywords: string[];
}

interface ControlIdentifierDTO {
  controlId: any;
  controlIdentifier: string;
  controlName: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './viewpdf.component.html',
  styleUrl: './viewpdf.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    HeaderComponent,
    PdfComponent,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatOptionModule,
  ],
  providers: [NgxExtendedPdfViewerService],
})
export class ViewPdfComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  showPdfViewer: boolean = true;

  controlKeywords: ControlKeywordsDTO[] = [];
  controlIdentifiers: ControlIdentifierDTO[] = [];
  selectedControlIdentifier: string = '';
  manualSearchTerm: string = '';
  private subscriptions: Subscription[] = [];
  searchTerm: any;
  isPdfViewerReady: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sanitizer: DomSanitizer,
    private pdfService: NgxExtendedPdfViewerService,
    @Inject(PLATFORM_ID) private platformId: Object // Add this line
  ) {}

  ngOnInit(): void {
    this.loadControlOptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  loadControlOptions() {
    this.isLoading = true;
    const sub = this.http
      .get<ControlIdentifierDTO[]>(
        'http://localhost:8085/data/control-identifiers'
      )
      .subscribe({
        next: (data) => {
          this.controlIdentifiers = data;
          this.selectedControlIdentifier =
            this.controlIdentifiers[0].controlIdentifier;
          if (this.controlIdentifiers.length > 0) {
            this.selectedControlIdentifier =
              this.controlIdentifiers[0].controlIdentifier;
          }
          this.isLoading = false;
          console.log('Control Identifiers:', this.controlIdentifiers);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.error('Error loading control options:', error);
          if (error.status === 404) {
            console.error('Resource not found');
          } else if (error.status === 500) {
            console.error('Internal server error');
          }
        },
      });
    this.subscriptions.push(sub);
  }

  loadKeywords() {
    if (!this.selectedControlIdentifier) {
      // this.controlKeywords.length = 0;
      this.controlKeywords = []; // Clear the control keywords if no identifier is selected
      return;
    }

    this.isLoading = true;
    const sub = this.http
      .get<ControlKeywordsDTO[]>(
        `http://localhost:8085/data/control-keywords/${this.selectedControlIdentifier}`
      )
      .subscribe({
        next: (controlKeywords) => {
          this.controlKeywords = controlKeywords;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.error('Error fetching control keywords:', error);
          // this.controlKeywords.length = 0;
          this.controlKeywords = []; // Clear the control keywords on error
          if (error.status === 404) {
            console.error('Resource not found');
          } else if (error.status === 500) {
            console.error('Internal server error');
          }
        },
      });
    this.subscriptions.push(sub);
  }

  onSelectionChange(event: MatSelectChange<any>): void {
    let value: string = '';
    if (typeof event === 'string') {
      value = event;
    } else if (event instanceof Event) {
      const target = event.target as HTMLSelectElement;
      value = target.value;
    }
    this.selectedControlIdentifier = value;
    console.log('Control Identifiers:', this.selectedControlIdentifier);
    this.loadKeywords();
  }

  searchManually(): void {
    this.executeSearch(this.manualSearchTerm);
  }

  searchWithLoadedKeywords(): void {
    if (
      this.controlKeywords.length > 0 &&
      this.controlKeywords[0].keywords?.length > 0
    ) {
      const keywordsString = this.controlKeywords[0].keywords.join('');
      this.executeSearch(keywordsString, true);
    } else {
      console.warn('No keywords loaded to search for.');
      this.clearSearchHighlights();
    }
  }

  searchByKeyword(keyword: string): void {
    if (keyword) {
      console.log('Searching for keyword:', keyword);
      this.manualSearchTerm = keyword;
      this.executeSearch(keyword, false);
    } else {
      console.warn('No keyword provided for search.');
      this.clearSearchHighlights();
    }
  }

  private executeSearch(term: string, findMultiple: boolean = false): void {
    if (term) {
      const options: FindOptions = {
        highlightAll: true,
        matchCase: false,
        wholeWords: false,
      };
      console.log(`Executing search for term: ${term}`, options);
      this.pdfService.find(term, options);
    } else {
      console.warn('No search term provided.');
      this.clearSearchHighlights();
    }
  }

  clearSearchHighlights(): void {
    this.pdfService.find('');
  }

  searchPdf(): void {
    if (this.searchTerm) {
      this.pdfService.find(this.searchTerm, {
        highlightAll: true,
        matchCase: false,
        wholeWords: false,
      });
    } else {
      this.pdfService.find('');
    }
  }

  findNext(): void {
    if (this.searchTerm) {
      this.pdfService.findNext();
    }
  }

  findPrevious(): void {
    if (this.searchTerm) {
      this.pdfService.findPrevious();
    }
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToExtractedData() {
    this.router.navigate(['/extracted-data']);
  }

  navigateToMain() {
    this.router.navigate(['/result']);
  }
}
