import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // For loading indicator
import { MatCardModule } from '@angular/material/card'; // For better presentation
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';

// Define the structure of your data (similar to MainData in result.component.ts)
// If this interface is used elsewhere, consider moving it to a shared file.
export interface MainData {
  keywords: string;
  controlKeywords: any; // Consider if this is still needed or should be removed/renamed
  controlId: string;
  controlName: string;
  controlDescription: string;
  evidence: string;
  remarks: string;
  status: string;
  documentName: string;
  pageNumber: string;
  // groupedData?: any; // Assuming groupedData is not directly displayed in this "view all" table
}

@Component({
  selector: 'app-pdf',
  standalone: true, // Make it standalone
  imports: [
    CommonModule,
    HttpClientModule, // Add HttpClientModule here for standalone components
    HeaderComponent,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './viewalldata.component.html',
  styleUrls: ['./viewalldata.component.css'] // Corrected from styleUrl to styleUrls
})
export class ViewalldataComponent implements OnInit {
  allData: MainData[] = [];
  displayedColumns: string[] = [
    'controlId',
    'controlName',
    'controlDescription',
    'keywords',
    'documentName',
    'pageNumber',
    'evidence',
    'status',
    'remarks'
    // Add or remove columns as needed
  ];
  isLoading = true;
  errorMessage: string | null = null;

  // Use a more descriptive API URL if this component fetches a different dataset or view
  // For now, assuming it's the same base data as ResultComponent
  private apiUrl = 'http://localhost:8085/all-main-data'; // Ensure this is your correct API endpoint

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.http.get<MainData[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.allData = data;
        this.isLoading = false;
        console.log('Data loaded for ViewAllDataComponent:', data);
      },
      error: (error) => {
        console.error('Error fetching all data:', error);
        this.errorMessage = 'Failed to load data. Please try again later or contact support.';
        this.isLoading = false;
      }
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToExtractedData() {
    this.router.navigate(['/extracted-data']);
  }

  navigateToViewPdf() {
    this.router.navigate(['/view-pdf']);
  }
}
