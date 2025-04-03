import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ExtractedData } from '../model/extractedData';
import { AuthenService } from '../service/AuthenService';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-content',
  templateUrl: './extracteddata.component.html',
  styleUrl: './extracteddata.component.css',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    HeaderComponent
  ],
  standalone: true,
})
export class ContentComponent implements OnInit {
  data: ExtractedData[] = [];
  filteredData: ExtractedData[] = []; // Array to hold the filtered data
  selectedFile: File | null = null;
  uploadMessage: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExtractedData();
  }

  loadExtractedData() {
    this.http
      .get<ExtractedData[]>('http://localhost:8085/extracted-data')
      .subscribe({
        next: (data) => {
          console.log('Data received:', data);
          this.data = data;
          this.filteredData = data;
          console.log('dataSource.data:', this.data);
        },
        error: (error) => {
          console.error('Error fetching extracted data:', error);
        },
      });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.clearUploadMessageAfterDelay();
    }
  }

  private clearUploadMessageAfterDelay() {
    setTimeout(() => {
      this.uploadMessage = '';
    }, 3000);
  }

  searchData(input: string) {
    const searchTerm = input.trim().toLowerCase(); 

    if (!searchTerm) {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter((item) => {
        return (
          item.controlId.toLowerCase().includes(searchTerm) ||
          item.controlName.toLowerCase().includes(searchTerm) ||
          item.documentName.toLowerCase().includes(searchTerm) ||
          item.pageNumber.toLowerCase().includes(searchTerm) ||
          item.keywords.toLowerCase().includes(searchTerm) ||
          item.evidence.toLowerCase().includes(searchTerm)
        );
      });
    }
  }

  navigateToHome() {
    this.router.navigate(['/home']); 
  }

  navigateToMain() {
    this.router.navigate(['/result']);
  }
}
