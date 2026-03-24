import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../types/api.types';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';
import { StorageService } from '../core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private base = environment.apiUrl;

  readonly isLoggedIn = signal(!!this.storage.get<string>('access_token'));

  register(req: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.base}/auth/register`, req).pipe(
      tap((res) => this._saveTokens(res.data))
    );
  }

  login(req: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.base}/auth/login`, req).pipe(
      tap((res) => this._saveTokens(res.data))
    );
  }

  logout(): void {
    this.storage.remove('access_token');
    this.storage.remove('refresh_token');
    this.isLoggedIn.set(false);
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = this.storage.get<string>('refresh_token');
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.base}/auth/refresh`, { refresh_token: refreshToken })
      .pipe(tap((res) => this._saveTokens(res.data)));
  }

  private _saveTokens(data: AuthResponse): void {
    this.storage.set('access_token', data.access_token);
    this.storage.set('refresh_token', data.refresh_token);
    this.isLoggedIn.set(true);
  }
}
