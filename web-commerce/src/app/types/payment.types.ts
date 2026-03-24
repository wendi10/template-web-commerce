import { Order } from './order.types';

// Matches domain.PaymentStatus (backend)
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'expired' | 'refunded';

// Matches domain.PaymentProvider (backend)
export type PaymentProvider = 'doku';

// Matches domain.Payment (backend)
export interface Payment {
  id: string;
  order_id: string;
  provider: PaymentProvider;
  transaction_id?: string;      // provider_ref in DB
  payment_method: string;       // method in DB
  status: PaymentStatus;
  amount: string | number;
  currency: string;             // default: 'IDR'
  payment_url?: string;         // redirect URL from provider
  paid_at?: string;
  expired_at?: string;
  created_at: string;
  updated_at: string;
  order?: Order;
}

// Matches domain.CreatePaymentRequest (backend)
// POST /api/v1/payments
export interface CreatePaymentRequest {
  order_id: string;
  payment_method: string;   // e.g. 'virtual_account', 'credit_card', 'qris'
  provider: PaymentProvider; // 'doku'
}
