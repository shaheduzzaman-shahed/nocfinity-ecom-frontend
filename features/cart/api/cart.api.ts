import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type {
  AddToCartPayload,
  CartData,
  MergeCartPayload,
  UpdateCartItemPayload,
} from "../types/cart.types";

export const cartApi = {
  getCart() {
    return api.get<ApiSuccessResponse<CartData>>("/cart");
  },

  addItem(payload: AddToCartPayload) {
    return api.post<ApiSuccessResponse<CartData>>("/cart/items", payload);
  },

  updateItem(itemId: number, payload: UpdateCartItemPayload) {
    return api.put<ApiSuccessResponse<CartData>>(`/cart/items/${itemId}`, payload);
  },

  removeItem(itemId: number) {
    return api.delete<ApiSuccessResponse<CartData>>(`/cart/items/${itemId}`);
  },

  clearCart() {
    return api.delete<ApiSuccessResponse<CartData>>("/cart");
  },

  mergeCart(items: MergeCartPayload["items"]) {
    return api.post<ApiSuccessResponse<CartData>>("/cart/merge", { items });
  },
};
