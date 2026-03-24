import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../types/api.types';
import { Product, ProductListFilter, Category } from '../types/product.types';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // GET /api/v1/products
  // Backend response: { success, message, data: Product[], meta: { page, limit, total, total_pages } }
  getProducts(filter?: ProductListFilter): Observable<ApiResponse<Product[]>> {
    let params = new HttpParams();
    if (filter) {
      if (filter.category_id) params = params.set('category_id', filter.category_id);
      if (filter.search) params = params.set('search', filter.search);
      if (filter.min_price != null) params = params.set('min_price', filter.min_price.toString());
      if (filter.max_price != null) params = params.set('max_price', filter.max_price.toString());
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.limit) params = params.set('limit', filter.limit.toString());
      if (filter.sort_by) params = params.set('sort_by', filter.sort_by);
      if (filter.sort_order) params = params.set('sort_order', filter.sort_order);
    }
    return this.http.get<ApiResponse<Product[]>>(`${this.base}/products`, { params });
  }

  // GET /api/v1/products/{id}
  getProduct(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.base}/products/${id}`);
  }

  // GET /api/v1/products/slug/{slug}
  getProductBySlug(slug: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.base}/products/slug/${slug}`);
  }

  // GET /api/v1/categories
  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.base}/categories`);
  }
}
