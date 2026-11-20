import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkoutApi } from "../api/checkout.api";
import type { CheckoutPayload } from "../types/checkout.types";

export const CHECKOUT_KEYS = {
  preview: ["checkout-preview"] as const,
  confirmation: (id: string | number) => ["order-confirmation", String(id)] as const,
};

export function useCheckoutPreview(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: CHECKOUT_KEYS.preview,
    queryFn: async () => {
      const res = await checkoutApi.getPreview();
      return res.data;
    },
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useProcessCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const res = await checkoutApi.submitCheckout(payload);
      return res.data;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: CHECKOUT_KEYS.preview });
      queryClient.setQueryData(CHECKOUT_KEYS.confirmation(order.id), order);
      queryClient.setQueryData(CHECKOUT_KEYS.confirmation(order.order_number), order);
    },
  });
}

export function useOrderConfirmation(orderId: string | number) {
  return useQuery({
    queryKey: CHECKOUT_KEYS.confirmation(orderId),
    queryFn: async () => {
      const res = await checkoutApi.getOrderConfirmation(orderId);
      return res.data;
    },
    enabled: Boolean(orderId),
  });
}
