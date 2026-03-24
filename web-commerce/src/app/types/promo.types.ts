// Matches domain.PromoType (backend)
export type PromoType = 'percentage' | 'fixed';

// Matches domain.PromoCode (backend)
export interface PromoCode {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: PromoType;
  value: string | number;
  min_purchase: string | number;    // was min_order_amount – backend field: min_purchase
  max_discount: string | number;    // max discount cap
  usage_limit: number;              // 0 = unlimited
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Matches promo_handler.go ValidatePromo body (backend)
export interface ValidatePromoRequest {
  code: string;
  sub_total: number;  // backend field: sub_total (not order_amount)
}

// Matches domain.ValidatePromoResponse (backend)
export interface ValidatePromoResponse {
  promo_code: PromoCode;
  discount_amount: string | number;
  is_valid: boolean;
  message?: string;
}
