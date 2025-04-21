import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ExtractedData } from '../model/extractedData';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenService } from '../service/AuthenService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    HeaderComponent,
  ],
})
export class HomeComponent {
  data: ExtractedData[] = [];
  filteredData: ExtractedData[] = []; // Array to hold the filtered data
  selectedFile: File | null = null;
  uploadMessage: string = '';
  isUploadSuccessful: boolean = false;
  uploadProgressMessage: string = '';

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

  uploadFile() {
    if (!this.selectedFile) {
      this.uploadMessage = 'No file selected.';
      this.clearUploadMessageAfterDelay();
      this.isUploadSuccessful = false;
      this.uploadProgressMessage = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    // First, upload to /api/data-shift/upload
    this.http
      .post<any>('http://localhost:8085/api/data-shift/upload', formData)
      .subscribe({
        next: (uploadResponse) => {
          console.log('File uploaded successfully:', uploadResponse);
          const documentName = uploadResponse.documentName; // Get the documentName from the documentName field

          // Then, send the documentName to /data/pdf
          const params = new HttpParams().set('documentName', documentName);
          this.http
            .post<any>('http://localhost:8085/data/pdf', null, { params })
            .subscribe({
              next: (extractResponse) => {
                this.uploadMessage = 'Data extracted successfully!';
                this.clearUploadMessageAfterDelay();
                this.isUploadSuccessful = true;
                this.uploadProgressMessage = '';
                console.log('Data extracted successfully:', extractResponse);
                this.loadExtractedData();
              },
              error: (extractError) => {
                this.uploadMessage = 'Data extraction error.';
                this.clearUploadMessageAfterDelay();
                this.isUploadSuccessful = false;
                this.uploadProgressMessage = '';
                console.error('Data extraction error:', extractError);
              },
            });
        },
        error: (uploadError) => {
          this.uploadMessage = 'File upload error.';
          this.clearUploadMessageAfterDelay();
          this.isUploadSuccessful = false;
          this.uploadProgressMessage = '';
          console.error('File upload error:', uploadError);
        },
      });
  }

  private clearUploadMessageAfterDelay() {
    setTimeout(() => {
      this.uploadMessage = '';
    }, 3000);
  }

  navigateToMain() {
    this.router.navigate(['/result']);
  }

  navigateToExtractedData() {
    this.router.navigate(['/extracted-data']);
  }

  navigateToViewPdf() {
    this.router.navigate(['/view-pdf']);
  }
}
