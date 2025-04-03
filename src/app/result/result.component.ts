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
  displayedColumns: string[] = ['controlId', 'controlName', 'controlDescription', 'evidence', 'remarks', 'status'];

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {}

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
    this.http.get<GroupedData[]>('http://localhost:8085/main-data/grouped').subscribe({
      next: (groupedData) => {
        console.log('Grouped data received:', groupedData);
        // Map grouped data to main data
        this.filteredData.forEach((item) => {
          item.groupedData = groupedData.find(
            (group) => group.documentName.replace(/^\d+\.\s/, '') === item.documentName
          );
          console.log('item.groupedData:', item.groupedData); // Add this line
          console.log('item:', item); // Add this line
        });
      },
      error: (error) => {
        console.error('Error fetching grouped data:', error);
      },
    });
  }

  openEvidenceModal(item: MainData) {
    console.log('item:', item); // Add this line
    this.dialog.open(GroupeddatamodalcomponentComponent, {
      data: item,
      width: '800px',
      height: '800px',
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToExtractedData() {
    this.router.navigate(['/extracted-data']);
  }
}
