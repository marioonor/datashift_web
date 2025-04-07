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

// Define the interfaces for the grouped data
interface PageKeyword {
  pages: string[];
  keyword: string;
  controlIds: string[];
}

interface GroupedData {
  documentName: string;
  pageKeywords: PageKeyword[];
}

// Define the interface for the main data
export interface MainData {
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

// Define the interface for the modal data
interface ModalData {
  controlId: string;
  documentName: string;
  pageNumber: string;
}

@Component({
  selector: 'app-main',
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
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent implements OnInit {
  mainData: MainData[] = [];
  filteredData: MainData[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  displayedColumns: string[] = [
    'controlId',
    'controlName',
    'controlDescription',
    'evidence',
    'remarks',
    'status',
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMainData();
    this.loadGroupedData();
  }

  loadMainData() {
    this.isLoading = true;
    this.errorMessage = null;
    this.http.get<MainData[]>('http://localhost:8085/main-data').subscribe({
      next: (data) => {
        console.log('Main data received:', data);
        // Add this line to inspect the data
        data.forEach((item) => console.log('Main Data Item:', item));
        this.mainData = data;
        this.filteredData = [...this.mainData];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching main data:', error);
        this.errorMessage =
          'Failed to load main data. Please check the console for details.';
        this.isLoading = false;
      },
    });
  }

  loadGroupedData() {
    this.http
      .get<GroupedData[]>('http://localhost:8085/main-data/grouped')
      .subscribe({
        next: (groupedData) => {
          console.log('Grouped data received:', groupedData);
          // Map grouped data to main data
          this.filteredData.forEach((item) => {
            // Find the group that matches the item's documentName
            const matchingGroup = groupedData.find(
              (group) =>
                group.documentName.replace(/^\d+\.\s/, '') === item.documentName
            );

            if (matchingGroup) {
              // Filter pageKeywords based on the controlId
              const filteredPageKeywords = matchingGroup.pageKeywords.filter(
                (pageKeyword) => pageKeyword.controlIds.includes(item.controlId) // Check if the controlIds array contains the current item's controlId
              );

              // Create a new GroupedData object with only the filtered pageKeywords
              item.groupedData = {
                documentName: matchingGroup.documentName,
                pageKeywords: filteredPageKeywords,
              };
            } else {
              item.groupedData = undefined;
            }
            // Add these lines to check the matching
            console.log('Matching group: ', matchingGroup);
          });
        },
        error: (error) => {
          console.error('Error fetching grouped data:', error);
        },
      });
  }

  openEvidenceModal(item: MainData) {
    // Prepare the modal data
    const modalData: ModalData = {
      controlId: item.controlId,
      documentName: item.documentName,
      pageNumber: item.pageNumber,
    };
    console.log('Modal Data to be passed:', modalData);
    console.log('Grouped Data to be passed:', item.groupedData);

    // Open the modal and pass the modal data
    this.dialog.open(GroupeddatamodalcomponentComponent, {
      data: { modalData, groupedData: item.groupedData }, // Pass both modalData and groupedData
      width: '800px',
      height: '400px',
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
