import { cache } from "react";
import { serverGet } from "@/lib/api/server";
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationMeta,
} from "@/lib/api/types";
import type {
  ProductCardData,
  ProductDetailData,
  ProductListParams,
} from "../types/product.types";

function buildQuery(params: ProductListParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export const getProducts = cache(
  async (
    params: ProductListParams
  ): Promise<{
    products: ProductCardData[];
    meta: PaginationMeta | null;
  }> => {
    const response = await serverGet<
      ApiPaginatedResponse<ProductCardData>
    >(`/products${buildQuery(params)}`);

    return {
      products: response?.data ?? [],
      meta: response?.meta ?? null,
    };
  }
);

export const getProduct = cache(
  async (productId: number): Promise<ProductDetailData | null> => {
    const response = await serverGet<ApiSuccessResponse<ProductDetailData>>(
      `/products/${productId}`
    );

    return response?.data ?? null;
  }
);

export const getFeaturedProducts = cache(
  async (): Promise<ProductCardData[]> => {
    const response = await serverGet<ApiSuccessResponse<ProductCardData[]>>(
      "/featured-products"
    );

    return response?.data ?? [];
  }
);
