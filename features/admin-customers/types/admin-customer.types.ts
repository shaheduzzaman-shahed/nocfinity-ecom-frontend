import type { AdminOrder } from "@/features/admin-orders/types/admin-order.types";

export interface AdminCustomerAddress {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface AdminCustomer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  is_active: boolean;
  orders_count: number;
  total_spent: number;
  shipping_addresses?: AdminCustomerAddress[] | null;
  created_at: string;
  updated_at: string;
}

export interface AdminCustomerFilters {
  search?: string;
  sort_by?: "created_at" | "name" | "email" | "orders_count" | "total_spent";
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}
