import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ExtractedData } from '../model/extractedData';
import { HttpClient } from '@angular/common/http';
import { AuthenService } from '../service/AuthenService';
import { CdkTableDataSourceInput } from '@angular/cdk/table';
import { catchError, finalize, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

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
  ],
})
export class ViewPdfComponent implements OnInit {
  isLoading: boolean = false;
  ngOnInit(): void {
    this.loadControlOptions();
  }

  controlKeywords: ControlKeywordsDTO[] = [];
  controlIdentifiers: ControlIdentifierDTO[] = [];
  selectedControlIdentifier: string = '';

  constructor(private http: HttpClient) {}

  loadControlOptions() {
    this.isLoading = true;
    this.http
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
        error: (error) => {
          this.isLoading = false;
        },
      });
  }

  loadKeywords() {
    if (this.selectedControlIdentifier) {
      this.isLoading = true;
      this.http
        .get<ControlKeywordsDTO[]>(
          `http://localhost:8085/data/control-keywords/${this.selectedControlIdentifier}`
        )
        .subscribe({
          next: (controlKeywords) => {
            this.controlKeywords.length = 0;
            this.controlKeywords.push(...controlKeywords);
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error fetching control keywords:', error);
            this.controlKeywords.length = 0;
          },
        });
    } else {
      this.controlKeywords.length = 0;
    }
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedControlIdentifier = target.value;
    console.log('Control Identifiers:', this.selectedControlIdentifier);
    this.loadKeywords();
  }
}
