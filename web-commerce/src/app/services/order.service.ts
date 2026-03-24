import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../types/api.types';
import { Order, CreateOrderRequest } from '../types/order.types';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // POST /api/v1/orders – create order from cart items
  // Body: { address_id, promo_code?, notes? }
  createOrder(req: CreateOrderRequest): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.base}/orders`, req);
  }

  // GET /api/v1/orders – list customer's own orders
  // Backend response: { success, message, data: Order[], meta: { page, limit, total, total_pages } }
  getMyOrders(page = 1, limit = 10, status?: string): Observable<ApiResponse<Order[]>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<Order[]>>(`${this.base}/orders`, { params });
  }

  // GET /api/v1/orders/{id}
  getOrder(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.base}/orders/${id}`);
  }

  // POST /api/v1/orders/{id}/cancel
  cancelOrder(id: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.base}/orders/${id}/cancel`, {});
  }
}
