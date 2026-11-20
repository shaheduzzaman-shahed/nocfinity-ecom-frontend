export interface AdminCategory {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  sort_order: number;
  products_count?: number;
  parent?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  children?: AdminCategory[];
  created_at: string | null;
  updated_at: string | null;
}

export interface CategoryPayload {
  name: string;
  description: string | null;
  parent_id: number | null;
  is_active: boolean;
  sort_order: number;
  image: File | null;
}

export interface CategoryTreeRow {
  category: AdminCategory;
  depth: number;
}
