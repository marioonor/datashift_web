import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataShift } from '../model/data-shift.model';

@Injectable({
  providedIn: 'root'
})
export class DataShiftService {
  private apiUrl = 'http://localhost:8085/api/data-shift/all';

  constructor(private http: HttpClient) { }

  getAllData(): Observable<DataShift[]> {
    return this.http.get<DataShift[]>(this.apiUrl);
  }

  fetchAllData(): Observable<DataShift[]> {
    return this.http.get<DataShift[]>(this.apiUrl);
  }
}
