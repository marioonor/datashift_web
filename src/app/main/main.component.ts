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

@Component({
  selector: 'app-main',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  mainData: MainData[] = []; // Store the data here
  filteredData: MainData[] = []; // Data to display in the table
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

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
        this.errorMessage = 'Failed to load data. Please check the console for details.';
        this.isLoading = false;
      },
    });
  }
}
