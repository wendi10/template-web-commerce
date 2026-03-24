import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../types/api.types';
import { CartSummary, AddToCartRequest, UpdateCartItemRequest } from '../types/cart.types';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  readonly cartCount = signal(0);
  readonly isOpen = signal(false);

  // GET /api/v1/cart – returns CartSummary
  // Optional promo_code query param to preview discount
  getCart(promoCode?: string): Observable<ApiResponse<CartSummary>> {
    const url = promoCode
      ? `${this.base}/cart?promo_code=${encodeURIComponent(promoCode)}`
      : `${this.base}/cart`;
    return this.http.get<ApiResponse<CartSummary>>(url).pipe(
      tap((res) => this.cartCount.set(res.data?.total_items ?? 0))
    );
  }

  // POST /api/v1/cart – backend returns CartItem, but we immediately
  // refetch CartSummary so the caller always works with the full cart state.
  addToCart(req: AddToCartRequest): Observable<ApiResponse<CartSummary>> {
    return this.http.post<ApiResponse<CartSummary>>(`${this.base}/cart`, req).pipe(
      switchMap(() => this.getCart())
    );
  }

  // PUT /api/v1/cart/{itemID} – backend returns CartItem, refetch summary
  updateItem(itemId: string, req: UpdateCartItemRequest): Observable<ApiResponse<CartSummary>> {
    return this.http.put<ApiResponse<CartSummary>>(`${this.base}/cart/${itemId}`, req).pipe(
      switchMap(() => this.getCart())
    );
  }

  // DELETE /api/v1/cart/{itemID} – backend returns 204 No Content, refetch summary
  removeItem(itemId: string): Observable<ApiResponse<CartSummary>> {
    return this.http.delete<void>(`${this.base}/cart/${itemId}`).pipe(
      switchMap(() => this.getCart())
    );
  }

  openCart(): void { this.isOpen.set(true); }
  closeCart(): void { this.isOpen.set(false); }
  toggleCart(): void { this.isOpen.update(v => !v); }
}
