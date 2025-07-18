import { HttpClient } from '@angular/common/http';
import {
    OnInit,
    Component,
    inject,
    signal,
    ChangeDetectionStrategy,
} from '@angular/core';
import { ExtractedData } from '../model/extracteddata.model';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { ToastrService } from 'ngx-toastr'; // Make sure you have ngx-toastr installed and imported
import { DialogContentScannedPdf } from '../dialog/DialogContentScannedPdf';

declare var bootstrap: any;

@Component({
    selector: 'app-extractdata',
    imports: [FormsModule, MatButtonModule, MatDialogModule],
    templateUrl: './extractdata.component.html',
    styleUrl: './extractdata.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtractdataComponent implements OnInit {
    extracteddata = signal<ExtractedData[]>([]);
    private httpClient = inject(HttpClient);
    // private toastr = inject(ToastrService);

    editIcon: string = 'assets/images/edit.png';
    deleteIcon: string = 'assets/images/delete.png';

    editingData: ExtractedData | null = null;

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.httpClient
            .get<ExtractedData[]>('http://localhost:8080/api/scanneddata')
            .subscribe({
                next: (data) => {
                    this.extracteddata.set(data);
                },
                error: (err) => console.error('Failed to fetch data', err),
            });
    }

    //To call an edit modal
    onEdit(data: ExtractedData) {
        if (data) {
            this.editingData = { ...data };
            setTimeout(() => {
                const modalElement = document.getElementById('editTodoModal');
                if (modalElement) {
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                }
            });
        } else {
            console.error('Received null or undefined data for editing.');
        }
    }

    // To update the data using modal
    onUpdate() {
        if (!this.editingData || !this.editingData.id) {
            return;
        }

        const updateUrl = `http://localhost:8080/api/scanneddata/${this.editingData.id}`;
        this.httpClient
            .put<ExtractedData>(updateUrl, this.editingData)
            .subscribe({
                next: (updatedDataFromServer) => {
                    this.extracteddata.update((currentData) => {
                        const index = currentData.findIndex(
                            (d) => d.id === updatedDataFromServer.id
                        );
                        if (index > -1) {
                            currentData[index] = updatedDataFromServer;
                        }
                        return [...currentData];
                    });
                    this.editingData = null;
                },
            });
    }

    // To delete the data
    onDelete(id: number) {
        if (!confirm(`Are you sure you want to delete item with ID: ${id}?`)) {
            return;
        }

        const deleteUrl = `http://localhost:8080/api/scanneddata/${id}`;
        this.httpClient.delete(deleteUrl).subscribe({
            next: () => {
                this.getData();
                console.log('Data deleted successfully');
            },
            error: (err) => {
                console.error('Delete failed', err);
            },
        });
    }

    // To open the modal
    readonly dialog = inject(MatDialog);

    openDialog() {
        const dialogRef = this.dialog.open(DialogContentScannedPdf, {
            width: '600px',
            height: '600px',
            maxWidth: '90vw',
            panelClass: 'custom-dialog-container',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Dialog closed with success, refreshing data...');
                this.getData();
            }
        });
    }
}
