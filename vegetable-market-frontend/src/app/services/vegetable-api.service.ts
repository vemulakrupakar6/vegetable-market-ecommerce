import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutResponse, Vegetable, VegetableListResponse } from '../models/vegetable.model';

@Injectable({ providedIn: 'root' })
export class VegetableApiService {
  readonly apiBase = 'http://localhost:3000/api';
  readonly serverBase = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getVegetables(search = '', limit = 100): Observable<VegetableListResponse> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', '1')
      .set('limit', String(limit));
    return this.http.get<VegetableListResponse>(`${this.apiBase}/vegetables`, { params });
  }

  getVegetable(id: number): Observable<Vegetable> {
    return this.http.get<Vegetable>(`${this.apiBase}/vegetables/${id}`);
  }

  createVegetable(form: FormData): Observable<Vegetable> {
    return this.http.post<Vegetable>(`${this.apiBase}/vegetables`, form);
  }

  updateVegetable(id: number, form: FormData): Observable<Vegetable> {
    return this.http.put<Vegetable>(`${this.apiBase}/vegetables/${id}`, form);
  }

  deleteVegetable(id: number): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(`${this.apiBase}/vegetables/${id}`);
  }

  checkout(payload: {
    customer_name: string;
    phone: string;
    address: string;
    items: Array<{ id: number; quantity: number }>;
  }): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiBase}/checkout/cod`, payload);
  }

  imageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    return `${this.serverBase}${path.startsWith('/') ? '' : '/'}${path}`;
  }
}
