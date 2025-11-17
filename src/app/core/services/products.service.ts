import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import type {CreateProductDto, Product, UpdateProductDto} from '../models/product.model';
import type {Observable} from 'rxjs';
import type {ApiData, ApiDataMessage, ApiMessage} from '../models/api.envelope.model';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class ProductService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBase}/bp/products`;

  getAll(): Observable<ApiData<Product[]>> {
    return this.http.get<ApiData<Product[]>>(this.baseUrl);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${encodeURIComponent(id)}`);
  }

  create(dto: CreateProductDto): Observable<ApiDataMessage<Product>> {
    return this.http.post<ApiDataMessage<Product>>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateProductDto): Observable<ApiDataMessage<Product>> {
    return this.http.put<ApiDataMessage<Product>>(`${this.baseUrl}/${encodeURIComponent(id)}`, dto);
  }

  delete(id: string): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }

}
