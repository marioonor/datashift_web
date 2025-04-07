import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface ControlKeywordsDTO {
  controlIdentifier: string;
  controlName: string;
  keywords: string[];
}

interface ControlIdentifierDTO {
  controlIdentifier: string;
  controlName: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  imports: [CommonModule],
  standalone: true,
})

export class SidebarComponent implements OnInit {
  selectedFile: File | null = null;
  uploadMessage: string = '';
  isUploadSuccessful: boolean = false;
  uploadProgressMessage: string = '';
  controlKeywords: ControlKeywordsDTO[] = []; 
  isLoading: boolean = false; 
  controlIdentifiers: ControlIdentifierDTO[] = []; 
  selectedControlIdentifier: string = ''; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadControlIdentifiers();
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

    this.http.post('http://localhost:8085/data/path', formData, { 
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            const percentDone = Math.round(100 * event.loaded / event.total);
            this.uploadProgressMessage = `File is ${percentDone}% uploaded.`;
            console.log(`File is ${percentDone}% uploaded.`);
          }
        } else if (event instanceof HttpResponse) {
          this.uploadMessage = 'File uploaded successfully!';
          this.clearUploadMessageAfterDelay();
          this.isUploadSuccessful = true;
          this.uploadProgressMessage = '';
          console.log('File is completely uploaded!');
          console.log('Response:', event.body);
          this.loadControlIdentifiers();
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
      }
    });
  }

  private clearUploadMessageAfterDelay() {
    setTimeout(() => {
      this.uploadMessage = '';
    }, 3000);
  }

  loadControlIdentifiers() {
    this.isLoading = true;
    this.http.get<ControlIdentifierDTO[]>('http://localhost:8085/data/control-identifiers')
      .subscribe({
        next: (controlIdentifiers) => {
          this.controlIdentifiers = controlIdentifiers;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error fetching control identifiers:', error);
        }
      });
  }

  loadKeywords() {
    if (this.selectedControlIdentifier) {
      this.isLoading = true;
      this.http.get<ControlKeywordsDTO[]>(`http://localhost:8085/data/control-keywords/${this.selectedControlIdentifier}`)
        .subscribe({
          next: (controlKeywords) => {
            this.controlKeywords.length = 0;
            this.controlKeywords.push(...controlKeywords);
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error fetching control keywords:', error);
            this.controlKeywords.length = 0;
          }
        });
    } else {
      this.controlKeywords.length = 0;
    }
  }

  onControlIdentifierChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedControlIdentifier = target.value;
    this.loadKeywords();
  }
}
