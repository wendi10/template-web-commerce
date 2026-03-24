import { Product } from './product.types';
import { PromoCode } from './promo.types';

export interface CartItem {
  id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
  sub_total?: string | number;
}

export interface CartSummary {
  items: CartItem[];
  total_items: number;
  sub_total: string | number;
  promo_code?: PromoCode;
  discount_amount: string | number;
  total: string | number;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
