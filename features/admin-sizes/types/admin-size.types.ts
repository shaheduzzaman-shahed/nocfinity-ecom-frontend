export interface AdminSize {
  id: number;
  name: string;
  sort_order: number;
  product_variants_count?: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface SizePayload {
  name: string;
  sort_order: number;
}
