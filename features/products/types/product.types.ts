export interface ProductCategoryRef {
  id: number;
  name: string;
  slug: string;
}

export interface ProductCardData {
  id: number;
  name: string;
  slug: string;
  category: ProductCategoryRef | null;
  primary_image: string | null;
  regular_price: number;
  discount_price: number | null;
  effective_price: number;
  discount_percentage: number | null;
  stock: number;
  in_stock: boolean;
  average_rating: number;
  reviews_count: number;
  currency: string;
}

export interface ProductImageData {
  id: number;
  url: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string | null;
}

export interface ProductColorData {
  id: number;
  name: string;
  hex_code: string | null;
}

export interface ProductSizeData {
  id: number;
  name: string;
  sort_order: number;
}

export interface ProductVariantData {
  id: number;
  color: ProductColorData | null;
  size: ProductSizeData | null;
  sku: string;
  stock: number;
  price_override: number | null;
  effective_price: number;
}

export type RatingBreakdown = Record<string, number>;

export interface ProductDetailData extends ProductCardData {
  description: string | null;
  images: ProductImageData[];
  variants: ProductVariantData[];
  rating_breakdown: RatingBreakdown | null;
  related_products: ProductCardData[];
}

export interface PublicColorData {
  id: number;
  name: string;
  hex_code: string | null;
}

export interface PublicSizeData {
  id: number;
  name: string;
  sort_order: number;
}

export interface ProductListParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  color_id?: number | string;
  size_id?: number | string;
  min_price?: number;
  max_price?: number;
  availability?: "in_stock" | "out_of_stock";
  sort?: "newest" | "price_asc" | "price_desc";
}
