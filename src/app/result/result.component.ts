import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MainData } from '../model/mainData';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router'; // Import Router and RouterModule
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main',
  standalone: true, // Add standalone: true
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    RouterModule,
    HeaderComponent,
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent implements OnInit {
  mainData: MainData[] = []; // Store the data here
  filteredData: MainData[] = []; // Data to display in the table
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.loadMainData();
  }

  loadMainData() {
    this.isLoading = true;
    this.errorMessage = null;
    this.http.get<MainData[]>('http://localhost:8085/main-data').subscribe({
      next: (data) => {
        console.log('Data received:', data);
        this.mainData = data; // Store the data
        this.filteredData = data; // Initially, show all data
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching the main data:', error);
        this.errorMessage =
          'Failed to load data. Please check the console for details.';
        this.isLoading = false;
      },
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']); // Navigate to /home
  }

  navigateToExtractedData() {
    this.router.navigate(['/extracted-data']);
  }
}
