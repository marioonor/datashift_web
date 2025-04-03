import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MainData } from '../result/result.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

// Define the interfaces for the grouped data
interface PageKeyword {
  pages: string[];
  keyword: string;
}

interface GroupedData {
  documentName: string;
  pageKeywords: PageKeyword[];
}

interface DialogData {
  groupedData: GroupedData;
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
    RouterModule,
    MatDialogModule
  ],
  templateUrl: './groupeddatamodalcomponent.component.html',
  styleUrl: './groupeddatamodalcomponent.component.css',
})
export class GroupeddatamodalcomponentComponent implements OnInit {
  groupedData: GroupedData[] = []; // Store the grouped data here
  errorMessage: string | null = null;
  dialog: any;
isLoading: any;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData, private http: HttpClient, private router: Router) {    
      if (data && data.groupedData) {
        this.groupedData = [data.groupedData];
      }
  }

  ngOnInit(): void {    
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToExtractedData() {
    this.router.navigate(['/extracted-data']);
  }
}
