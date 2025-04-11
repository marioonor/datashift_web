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
  ],
})
export class ViewPdfComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  showPdfViewer: boolean = true;

  controlKeywords: ControlKeywordsDTO[] = [];
  controlIdentifiers: ControlIdentifierDTO[] = [];
  selectedControlIdentifier: string = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
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
      this.controlKeywords.length = 0;
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
          this.controlKeywords.length = 0;
          if (error.status === 404) {
            console.error('Resource not found');
          } else if (error.status === 500) {
            console.error('Internal server error');
          }
        },
      });
    this.subscriptions.push(sub);
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedControlIdentifier = target.value;
    console.log('Control Identifiers:', this.selectedControlIdentifier);
    this.loadKeywords();
  }
}
