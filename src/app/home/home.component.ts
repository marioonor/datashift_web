import { Component, OnInit } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
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
    MatDialogModule
  ],
})
export class HomeComponent implements OnInit {
  data: ExtractedData[] = [];
  filteredData: ExtractedData[] = []; 
  selectedFile: File | null = null;
  uploadMessage: string = '';
  isUploadSuccessful: boolean = false;
  uploadProgressMessage: string = '';
  currentYear: number = new Date().getFullYear();

  constructor(
    private http: HttpClient,
    private authService: AuthenService,
    private router: Router,
    public dialog: MatDialog,
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

    this.uploadProgressMessage = 'Uploading file...';
    this.http
      .post<any>('http://localhost:8085/api/data-shift/upload', formData)
      .subscribe({
        next: (uploadResponse) => {
          console.log('File uploaded successfully:', uploadResponse);
          const documentName = uploadResponse.documentName; 

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

  openKeywordSidebarModal(): void {
    const dialogRef = this.dialog.open(SidebarComponent, {
      width: '500px',
      disableClose: false 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The keyword sidebar dialog was closed');
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

  navigateToViewAllData() {
    this.router.navigate(['/viewdata']);
  }
}
