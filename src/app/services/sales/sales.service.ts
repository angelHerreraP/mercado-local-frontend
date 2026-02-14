import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SaleResponse, SaleRequest } from '../../core/models/sales.models';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) { }

  getAllSales(): Observable<SaleResponse[]> {
    return this.http.get<SaleResponse[]>(`${this.apiUrl}/all`);
  }

  getUserSales(userId: number): Observable<SaleResponse[]> {
    // Note: The backend endpoint has a typo: /user/{userId}/Sales]
    return this.http.get<SaleResponse[]>(`${this.apiUrl}/user/${userId}/sales`);
  }

  createSale(sale: SaleRequest): Observable<SaleResponse> {
    return this.http.post<SaleResponse>(`${this.apiUrl}/sale`, sale);
  }
}
