// Matches domain.Category (backend)
export interface Category {
  id: string;
  parent_id?: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  children?: Category[];
}

// Matches domain.ProductImage (backend)
export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

// Matches domain.Product (backend)
export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  weight: string | number;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  category?: Category;
  images?: ProductImage[];
}

// Query params for GET /api/v1/products
// Pagination info is returned in res.meta (not res.data)
export interface ProductListFilter {
  category_id?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
  sort_by?: string;    // e.g. 'created_at', 'price', 'name'
  sort_order?: string; // 'asc' | 'desc'
}
