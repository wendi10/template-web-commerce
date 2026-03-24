export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiError {
  code: number;
  message: string;
  detail?: string;
}
