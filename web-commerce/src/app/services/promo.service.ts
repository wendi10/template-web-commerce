import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../types/api.types';
import { ValidatePromoRequest, ValidatePromoResponse } from '../types/promo.types';

@Injectable({ providedIn: 'root' })
export class PromoService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  validatePromo(req: ValidatePromoRequest): Observable<ApiResponse<ValidatePromoResponse>> {
    return this.http.post<ApiResponse<ValidatePromoResponse>>(`${this.base}/promos/validate`, req);
  }
}
