import { api } from "@/lib/api/client";
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from "@/lib/api/types";
import type {
  AdminProduct,
  AdminProductImage,
  AdminProductListParams,
  ProductPayload,
} from "../types/admin-product.types";

export const adminProductsApi = {
  listProducts(params: AdminProductListParams) {
    return api.get<ApiPaginatedResponse<AdminProduct>>("/admin/products", {
      params: {
        page: params.page,
        per_page: params.per_page,
        search: params.search,
        category_id: params.category_id,
        is_active: params.is_active,
      },
    });
  },

  getProduct(productId: number) {
    return api.get<ApiSuccessResponse<AdminProduct>>(
      `/admin/products/${productId}`
    );
  },

  createProduct(payload: ProductPayload) {
    return api.post<ApiSuccessResponse<AdminProduct>>(
      "/admin/products",
      payload
    );
  },

  updateProduct(productId: number, payload: ProductPayload) {
    return api.put<ApiSuccessResponse<AdminProduct>>(
      `/admin/products/${productId}`,
      payload
    );
  },

  updateProductStatus(productId: number, isActive: boolean) {
    return api.put<ApiSuccessResponse<AdminProduct>>(
      `/admin/products/${productId}`,
      { is_active: isActive }
    );
  },

  deleteProduct(productId: number) {
    return api.delete<ApiSuccessResponse<null>>(
      `/admin/products/${productId}`
    );
  },

  uploadImages(productId: number, files: File[], primaryIndex?: number) {
    const formData = new FormData();

    files.forEach((file) => formData.append("images[]", file));

    if (primaryIndex !== undefined) {
      formData.append("primary_index", String(primaryIndex));
    }

    return api.post<ApiSuccessResponse<AdminProductImage[]>>(
      `/admin/products/${productId}/images`,
      formData
    );
  },

  updateImage(
    productId: number,
    imageId: number,
    payload: { is_primary?: boolean; sort_order?: number }
  ) {
    return api.put<ApiSuccessResponse<AdminProductImage>>(
      `/admin/products/${productId}/images/${imageId}`,
      payload
    );
  },

  deleteImage(productId: number, imageId: number) {
    return api.delete<ApiSuccessResponse<null>>(
      `/admin/products/${productId}/images/${imageId}`
    );
  },
};
