import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExtractedData } from '../model/extracteddata.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    getDataByUserId(id: number) {
        throw new Error('Method not implemented.');
    }
    private baseUrl = '/api';

    constructor(private http: HttpClient) {}

    getData(): Observable<ExtractedData[]> {
        return this.http.get<ExtractedData[]>(`${this.baseUrl}/scanneddata`);
        // getData(userId: number): Observable<ExtractedData[]> {
        //     return this.http.get<ExtractedData[]>(
        //         `${this.baseUrl}/scanneddata?user_id=${userId}`
        //     );
    }

    updateData(data: ExtractedData): Observable<ExtractedData> {
        return this.http.put<ExtractedData>(
            `${this.baseUrl}/scanneddata/${data.id}`,
            data
        );
    }

    deleteData(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/scanneddata/${id}`);
    }

    extractData(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/extract`, formData);
    }
}
