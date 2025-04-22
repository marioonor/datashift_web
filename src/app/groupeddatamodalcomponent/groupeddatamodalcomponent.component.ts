import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

interface PageKeyword {
  pages: string[];
  keyword: string;
}

interface GroupedData {
  documentName: string;
  pageKeywords: PageKeyword[];
}

interface ModalData {
  controlId: string;
  documentName: string;
  pageNumber: string;
}

interface DialogData {
  modalData: ModalData;
  groupedData: GroupedData;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    RouterModule,
    MatDialogModule,
  ],
  templateUrl: './groupeddatamodalcomponent.component.html',
  styleUrl: './groupeddatamodalcomponent.component.css',
})
export class GroupeddatamodalcomponentComponent implements OnInit {
  groupedData: GroupedData | null = null;
  modalData: ModalData | null = null;
  errorMessage: string | null = null;
  groupedDatas: GroupedData[] = [];
  dialog: any;
  isLoading: any;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
    private router: Router
  ) {
    if (data) {
      this.groupedData = data.groupedData;
      this.modalData = data.modalData;
    }
  }

  ngOnInit(): void {}
}
