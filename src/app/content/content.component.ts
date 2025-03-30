import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { DataShiftService } from '../service/data-shift.service';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ExtractedData } from '../extractedData'; // Import the interface
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  standalone: true,
})
export class ContentComponent implements OnInit {
  data: ExtractedData[] = [];
  filteredData: ExtractedData[] = []; // Array to hold the filtered data
  selectedFile: File | null = null;
  uploadMessage: string = '';
  isUploadSuccessful: boolean = false;
  uploadProgressMessage: string = '';

  constructor(
    private http: HttpClient,
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
          this.filteredData = data; // Initialize filteredData with all data
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

    this.http
      .post('http://localhost:8085/data/pdf', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              const percentDone = Math.round(
                (100 * event.loaded) / event.total
              );
              this.uploadProgressMessage = `File is ${percentDone}% uploaded.`;
              console.log(`File is ${percentDone}% uploaded.`);
            }
            this.clearUploadMessageAfterDelay();
          } else if (event instanceof HttpResponse) {
            this.uploadMessage = 'File uploaded successfully!';
            this.isUploadSuccessful = true;
            this.uploadProgressMessage = '';
            console.log('File is completely uploaded!');
            console.log('Response:', event.body);
            this.loadExtractedData();
          }
        },
        error: (err) => {
          this.uploadMessage = 'Upload failed.';
          this.clearUploadMessageAfterDelay();
          this.isUploadSuccessful = false;
          this.uploadProgressMessage = '';
          console.error('Upload Error:', err);
        },
        complete: () => {
          console.log('Upload completed.');
        },
      });
  }

  private clearUploadMessageAfterDelay() {
    setTimeout(() => {
      this.uploadMessage = '';
    }, 3000);
  }

  searchData(input: string) {
    const searchTerm = input.trim().toLowerCase();

    if (!searchTerm) {
      this.filteredData = [...this.data]; // Show all data if the search term is empty
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
}
