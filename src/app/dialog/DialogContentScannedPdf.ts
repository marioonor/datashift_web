import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'dialog-content-example-dialog',
    standalone: true,
    templateUrl: 'DialogContentScannedPdf.html',
    imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentScannedPdf {
    uploadMessage = '';
    isUploadSuccessful = false;
    uploadProgressMessage = '';
    selectedFile: File | null = null;
    keyword: string = '';
    selectedControl: string = '';

    constructor(
        private http: HttpClient,
        public dialogRef: MatDialogRef<DialogContentScannedPdf>
    ) {}

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
            return;
        }

        const parsedKeywords = this.keyword
            .split(/[\n,]+/)
            .map(k => k.trim().toLowerCase())
            .filter(k => k.length > 0);

        if (parsedKeywords.length === 0) {
            this.uploadMessage = 'Please enter at least one keyword.';
            this.clearUploadMessageAfterDelay();
            this.isUploadSuccessful = false;
            return;
        }

        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('keywords', JSON.stringify(parsedKeywords));
        formData.append('controlId', this.selectedControl);

        this.http
            .post<any>('http://localhost:8080/api/extract', formData)
            .subscribe({
                next: (res) => {
                    this.uploadMessage = 'Data extracted successfully!';
                    this.isUploadSuccessful = true;
                    this.uploadProgressMessage = '';
                    console.log('Success:', res);
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.uploadMessage = 'Error extracting data.';
                    this.clearUploadMessageAfterDelay();
                    this.isUploadSuccessful = false;
                    console.error('Error:', err);
                },
            });
    }

    private clearUploadMessageAfterDelay() {
        setTimeout(() => {
            this.uploadMessage = '';
        }, 3000);
    }
}
