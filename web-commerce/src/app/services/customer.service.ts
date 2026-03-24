import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../types/api.types';
import { Customer, Address, UpdateProfileRequest, CreateAddressRequest, UpdateAddressRequest } from '../types/customer.types';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // GET /api/v1/me
  getProfile(): Observable<ApiResponse<Customer>> {
    return this.http.get<ApiResponse<Customer>>(`${this.base}/me`);
  }

  // PUT /api/v1/me – { first_name?, last_name?, phone?, avatar? }
  updateProfile(req: UpdateProfileRequest): Observable<ApiResponse<Customer>> {
    return this.http.put<ApiResponse<Customer>>(`${this.base}/me`, req);
  }

  // GET /api/v1/me/addresses
  getAddresses(): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>(`${this.base}/me/addresses`);
  }

  // POST /api/v1/me/addresses
  createAddress(req: CreateAddressRequest): Observable<ApiResponse<Address>> {
    return this.http.post<ApiResponse<Address>>(`${this.base}/me/addresses`, req);
  }

  // PUT /api/v1/me/addresses/{addressID}
  updateAddress(id: string, req: UpdateAddressRequest): Observable<ApiResponse<Address>> {
    return this.http.put<ApiResponse<Address>>(`${this.base}/me/addresses/${id}`, req);
  }

  // DELETE /api/v1/me/addresses/{addressID} – returns 204 No Content
  deleteAddress(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/me/addresses/${id}`);
  }

  // PATCH /api/v1/me/addresses/{addressID}/default
  setDefaultAddress(id: string): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.base}/me/addresses/${id}/default`, {});
  }
}
