export interface StorefrontCategory {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  sort_order: number;
  parent?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  children?: StorefrontCategory[];
  created_at: string | null;
  updated_at: string | null;
}
