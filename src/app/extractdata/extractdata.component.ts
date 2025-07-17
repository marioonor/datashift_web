import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ExtractedData } from '../model/extracteddata.model';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
    selector: 'app-extractdata',
    imports: [FormsModule],
    templateUrl: './extractdata.component.html',
    styleUrl: './extractdata.component.css',
})
export class ExtractdataComponent {
    extracteddata = signal<ExtractedData[]>([]);
    private httpClient = inject(HttpClient);

    editIcon: string = 'assets/images/edit.png';
    deleteIcon: string = 'assets/images/delete.png';

    editingData: ExtractedData | null = null;

    ngOnInit() {
        this.httpClient
            .get<ExtractedData[]>('http://localhost:8080/api/scanneddata')
            .subscribe({
                next: (data) => {
                    this.extracteddata.set(data);
                },
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
        if (!this.editingData || !this.editingData.scannedId) {
            return;
        }

        const updateUrl = `http://localhost:8080/api/scanneddata/${this.editingData.scannedId}`;
        this.httpClient
            .put<ExtractedData>(updateUrl, this.editingData)
            .subscribe({
                next: (updatedDataFromServer) => {
                    this.extracteddata.update((currentData) => {
                        const index = currentData.findIndex(
                            (d) =>
                                d.scannedId === updatedDataFromServer.scannedId
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
                this.extracteddata.update((currentData) =>
                    currentData.filter((d) => Number(d.scannedId) !== id)
                );
            },
            error: (err) => {
                console.error('Delete failed', err);
            },
        });
    }
}
