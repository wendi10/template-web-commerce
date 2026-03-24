import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../types/api.types';
import { Banner } from '../types/banner.types';

@Injectable({ providedIn: 'root' })
export class BannerService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // GET /api/v1/banners – public, returns active banners
  getActiveBanners(): Observable<ApiResponse<Banner[]>> {
    return this.http.get<ApiResponse<Banner[]>>(`${this.base}/banners`);
  }
}
