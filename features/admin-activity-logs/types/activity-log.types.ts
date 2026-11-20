export interface ActivityLogUser {
  id: number;
  name: string;
  email: string;
  account_type: "customer" | "staff";
  avatar: string | null;
}

export interface ActivityLog {
  id: number;
  user_id: number | null;
  user?: ActivityLogUser | null;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  payload: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export interface ActivityLogFilters {
  search?: string;
  user_id?: number | string;
  account_type?: "customer" | "staff" | "";
  action?: string;
  entity_type?: string;
  date_from?: string;
  date_to?: string;
  sort_direction?: "asc" | "desc";
  page?: number;
  per_page?: number;
}
