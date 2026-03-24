import { Customer, Address } from './customer.types';
import { PromoCode } from './promo.types';
import { Payment } from './payment.types';

// Matches domain.OrderStatus (backend)
export type OrderStatus =
  | 'pending'
  | 'waiting_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled';

// Matches domain.OrderItem (backend)
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  product_price: string | number;  // maps to unit_price column in DB
  quantity: number;
  total_price: string | number;    // maps to subtotal column in DB
  created_at: string;
}

// Matches domain.Order (backend)
export interface Order {
  id: string;
  customer_id: string;
  address_id: string;
  promo_code_id?: string;
  order_number: string;
  status: OrderStatus;
  sub_total: string | number;
  discount_amount: string | number;
  shipping_cost: string | number;
  total_amount: string | number;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  address?: Address;
  promo_code?: PromoCode;
  items?: OrderItem[];
  payment?: Payment;
}

// Matches domain.CreateOrderRequest (backend)
// POST /api/v1/orders
export interface CreateOrderRequest {
  address_id: string;
  promo_code?: string;
  notes?: string;
}

// Paginated list: GET /api/v1/orders
// Backend response: { data: Order[], meta: { page, limit, total, total_pages } }
// Use ApiResponse<Order[]> with res.meta for pagination
