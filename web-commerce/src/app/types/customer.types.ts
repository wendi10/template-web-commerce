// Matches domain.Customer (backend)
export interface Customer {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;  // avatar URL (optional)
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  addresses?: Address[];
}

// Matches domain.Address (backend)
export interface Address {
  id: string;
  customer_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Matches domain.UpdateProfileRequest (backend)
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
}

// Matches domain.CreateAddressRequest (backend)
export interface CreateAddressRequest {
  label: string;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  province: string;
  postal_code: string;
  is_default?: boolean;
}

// Matches domain.UpdateAddressRequest (backend)
export interface UpdateAddressRequest {
  label?: string;
  recipient_name?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  is_default?: boolean;
}
