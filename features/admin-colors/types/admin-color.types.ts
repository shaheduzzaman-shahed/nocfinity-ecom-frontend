export interface AdminColor {
  id: number;
  name: string;
  hex_code: string | null;
  product_variants_count?: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface ColorPayload {
  name: string;
  hex_code: string | null;
}
