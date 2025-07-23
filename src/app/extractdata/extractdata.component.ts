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
import { DialogContentScannedPdf } from '../dialog/DialogContentScannedPdf';
import { DataService } from '../service/data.service';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserResponse } from '../model/auth.models';
import { Subscription } from 'rxjs';

declare var bootstrap: any;

@Component({
    selector: 'app-extractdata',
    imports: [CommonModule, FormsModule, MatButtonModule, MatDialogModule],
    templateUrl: './extractdata.component.html',
    styleUrl: './extractdata.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtractdataComponent implements OnInit {
    extracteddata = signal<ExtractedData[]>([]);
    private dataService = inject(DataService);
    constructor(private router: Router, private authService: AuthService) {}

    editIcon: string = 'assets/images/edit.png';
    deleteIcon: string = 'assets/images/delete.png';

    userFirstName: string = 'Admin';
    private userAuthSubscription: Subscription | undefined;

    editingData: ExtractedData | null = null;
    private editModal: any;

    ngOnInit() {
        this.getData();

        this.userAuthSubscription = this.authService.currentUser.subscribe(
            (user: UserResponse | null) => {
                this.userFirstName = user?.name || 'Admin';
            }
        );
    }

    ngOnDestroy(): void {
        this.userAuthSubscription?.unsubscribe();
    }

    getData() {
        const currentUser = this.authService.getCurrentUserValue();
        if (!currentUser) return;

        this.dataService.getData().subscribe({
            next: (data) => {
                if (Array.isArray(data)) {
                    console.log('Received data:', data);
                    this.extracteddata.set(data);
                } else {
                    console.error('Data is not an array:', data);
                    this.extracteddata.set([]);
                }
            },
            error: (err) =>
                console.error('Failed to fetch user-specific data', err),
        });
    }

    //To call an edit modal
    onEdit(data: ExtractedData) {
        if (data) {
            this.editingData = { ...data };
            setTimeout(() => {
                const modalElement = document.getElementById('editTodoModal');
                if (modalElement) {
                    this.editModal = new bootstrap.Modal(modalElement);
                    this.editModal.show();
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

        this.dataService.updateData(this.editingData).subscribe({
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
                this.editModal?.hide();
            },
            error: (err) => {
                console.error('Update failed', err);
                alert('Update failed. Please try again.');
            },
        });
    }

    // To delete the data
    onDelete(id: number) {
        if (!confirm(`Are you sure you want to delete item with ID: ${id}?`)) {
            return;
        }

        this.dataService.deleteData(id).subscribe({
            next: () => {
                this.extracteddata.update((currentData) =>
                    currentData.filter((d) => d.id !== id)
                );
                console.log(`Data with id ${id} deleted successfully`);
            },
            error: (err) => {
                console.error('Delete failed', err);
                alert('Failed to delete data. Please try again.');
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

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('Dialog closed with success, refreshing data...');
                this.getData();
            }
        });
    }

    logout() {
        this.authService.logout();
    }
}
