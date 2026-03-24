// Matches domain.RegisterRequest (backend)
export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;  // required, min=2
  last_name: string;   // required, min=2
  phone: string;       // required
}

// Matches domain.LoginRequest (backend)
export interface LoginRequest {
  email: string;
  password: string;
}

// Matches domain.AuthResponse (backend)
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_at: string;  // ISO date string (time.Time)
  user: UserInfo;
}

// Matches domain.UserInfo (backend)
export interface UserInfo {
  id: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface RefreshTokenRequest {
  refresh_token: string;
}
