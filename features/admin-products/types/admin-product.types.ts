export interface AdminProductImage {
  id: number;
  url: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string | null;
}

export interface AdminProductVariant {
  id: number;
  color: {
    id: number;
    name: string;
    hex_code: string | null;
  } | null;
  size: {
    id: number;
    name: string;
    sort_order: number;
  } | null;
  sku: string;
  stock: number;
  price_override: number | null;
  effective_price: number;
  is_active: boolean;
}

export interface AdminProduct {
  id: number;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  name: string;
  slug: string;
  description: string | null;
  regular_price: number;
  discount_price: number | null;
  effective_price: number;
  is_active: boolean;
  sku: string | null;
  stock: number;
  variants_count: number | null;
  primary_image: string | null;
  images: AdminProductImage[];
  variants: AdminProductVariant[];
  average_rating: number;
  reviews_count: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminProductListParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  is_active?: 0 | 1;
}

export interface ProductVariantPayload {
  id?: number;
  color_id: number;
  size_id: number;
  sku: string;
  stock: number;
  price_override: number | null;
  is_active: boolean;
}

export interface ProductPayload {
  name: string;
  description: string | null;
  category_id: number;
  regular_price: number;
  discount_price: number | null;
  is_active: boolean;
  variants: ProductVariantPayload[];
}

export interface ImageReorder {
  id: number;
  sort_order: number;
}
