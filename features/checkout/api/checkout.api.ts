import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type {
  CheckoutPayload,
  CheckoutPreviewData,
  OrderData,
} from "../types/checkout.types";

export const checkoutApi = {
  getPreview() {
    return api.get<ApiSuccessResponse<CheckoutPreviewData>>("/checkout");
  },

  submitCheckout(payload: CheckoutPayload) {
    return api.post<ApiSuccessResponse<OrderData>>("/checkout", payload);
  },

  getOrderConfirmation(orderId: string | number) {
    return api.get<ApiSuccessResponse<OrderData>>(
      `/orders/${orderId}/confirmation`
    );
  },
};
