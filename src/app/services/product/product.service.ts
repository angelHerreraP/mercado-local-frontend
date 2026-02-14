import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductResponse, AddProductRequest } from '../../core/models/product.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.apiUrl}/all`);
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: AddProductRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, product);
  }

  uploadImage(file: File): Observable<{ url: string, key: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string, key: string }>(`${environment.apiUrl}/media/upload`, formData);
  }
}
