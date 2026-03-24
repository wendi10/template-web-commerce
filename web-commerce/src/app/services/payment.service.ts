import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../types/api.types';
import { Payment, CreatePaymentRequest } from '../types/payment.types';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // POST /api/v1/payments – create payment for an existing order
  // Body: { order_id, payment_method, provider }
  // Returns Payment with payment_url to redirect customer
  createPayment(req: CreatePaymentRequest): Observable<ApiResponse<Payment>> {
    return this.http.post<ApiResponse<Payment>>(`${this.base}/payments`, req);
  }

  // GET /api/v1/payments/order/{orderID} – get payment info for an order
  getPaymentByOrder(orderId: string): Observable<ApiResponse<Payment>> {
    return this.http.get<ApiResponse<Payment>>(`${this.base}/payments/order/${orderId}`);
  }
}
