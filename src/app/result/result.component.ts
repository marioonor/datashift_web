import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { NgIf } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GroupeddatamodalcomponentComponent } from '../groupeddatamodalcomponent/groupeddatamodalcomponent.component';

interface PageKeyword {
  pages: string[];
  keyword: string;
  controlIds: string[];
}

interface GroupedData {
  documentName: string;
  pageKeywords: PageKeyword[];
}

export interface MainData {
  keywords: string; // Ensure this matches the type from your backend (likely string)
  controlKeywords: any; // Consider if this is still needed or should be removed/renamed
  controlId: string;
  controlName: string;
  controlDescription: string;
  evidence: string;
  remarks: string;
  status: string;
  documentName: string;
  pageNumber: string;
  groupedData?: GroupedData;
}

interface ModalData {
  controlId: string;
  documentName: string;
  pageNumber: string;
}

@Component({
  selector: 'app-main', // Consider renaming selector to 'app-result' for clarity
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    HeaderComponent,
    MatDialogModule,
    NgIf,
    // NgFor is implicitly included via CommonModule, but explicit import doesn't hurt
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent implements OnInit {
  mainData: MainData[] = [];
  filteredData: MainData[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  // --- MODIFIED LINE ---
  // Add 'keywords' to the array
  displayedColumns: string[] = [
    'controlId',
    'controlName',
    'controlDescription',
    'keywords', // Added keywords here
    'evidence',
    'remarks',
    'status',
  ];
  // --- END MODIFICATION ---

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMainData();
    // Consider if loadGroupedData needs to run immediately or can be triggered later
    // this.loadGroupedData(); // Potentially move this call if not needed right away
  }

  loadMainData() {
    this.isLoading = true;
    this.errorMessage = null;
    // Use environment variables for API base URL
    const apiUrl = 'http://localhost:8085/main-data';
    this.http.get<MainData[]>(apiUrl).subscribe({
      next: (data) => {
        console.log('Main data received:', data);
        // Optional: Log only if needed for debugging
        // data.forEach((item) => console.log('Main Data Item:', item));

        // Ensure the 'keywords' property exists and has the expected type
        this.mainData = data;
        this.filteredData = [...this.mainData]; // Use spread for shallow copy
        this.isLoading = false;

        // Load grouped data only after main data is successfully loaded
        this.loadGroupedData();
      },
      error: (error) => {
        console.error('Error fetching main data:', error);
        // Provide a more user-friendly error message if possible
        this.errorMessage =
          'Failed to load main data. Please try again later or contact support.';
        this.isLoading = false;
      },
    });
  }

  loadGroupedData() {
    // Use environment variables for API base URL
    const groupedApiUrl = 'http://localhost:8085/main-data/grouped';
    this.http.get<GroupedData[]>(groupedApiUrl).subscribe({
      next: (groupedData) => {
        console.log('Grouped data received:', groupedData);

        // Create a map for faster lookup if groupedData is large
        const groupedDataMap = new Map<string, GroupedData>();
        groupedData.forEach(group => {
          // Normalize document name for matching (remove leading number/dot/space)
          const normalizedDocName = group.documentName.replace(/^\d+\.\s/, '');
          groupedDataMap.set(normalizedDocName, group);
        });


        this.filteredData.forEach((item) => {
          // Use the map for efficient lookup
          const matchingGroup = groupedDataMap.get(item.documentName);

          if (matchingGroup) {
            // Filter pageKeywords based on the current item's controlId
            const filteredPageKeywords = matchingGroup.pageKeywords.filter(
              (pageKeyword) => pageKeyword.controlIds.includes(item.controlId)
            );

            // Assign the potentially filtered grouped data
            item.groupedData = {
              documentName: matchingGroup.documentName, // Keep original name
              pageKeywords: filteredPageKeywords,
            };
          } else {
            // Explicitly set to undefined if no match found
            item.groupedData = undefined;
          }
          // Optional: Log only if needed for debugging
          // console.log(`Item ${item.controlId} - Matching group: `, matchingGroup);
          // console.log(`Item ${item.controlId} - Assigned groupedData: `, item.groupedData);
        });
      },
      error: (error) => {
        // Handle grouped data errors gracefully, maybe log or show a specific message
        console.error('Error fetching grouped data:', error);
        // Optionally inform the user:
        // this.errorMessage = 'Failed to load associated evidence details.';
      },
    });
  }


  openEvidenceModal(item: MainData) {
    // Prepare data specifically for the modal
    const modalData: ModalData = {
      controlId: item.controlId,
      documentName: item.documentName,
      pageNumber: item.pageNumber,
    };
    console.log('Modal Data to be passed:', modalData);
    console.log('Grouped Data to be passed:', item.groupedData); // Log the data being passed

    this.dialog.open(GroupeddatamodalcomponentComponent, {
      data: {
        modalData: modalData, // Pass the specific modal data
        groupedData: item.groupedData // Pass the associated grouped data
      },
      width: '800px', // Consider using relative units like '%' or 'vw'
      height: '400px', // Consider 'auto' or relative units
      // panelClass: 'your-custom-modal-class' // For custom styling
    });
  }

  // Navigation methods remain the same
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
