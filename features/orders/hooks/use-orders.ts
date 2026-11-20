"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/error";
import { ordersApi } from "../api/orders.api";
import type { OrderListParams } from "../types/order.types";
import { useAuthStore } from "@/stores/auth.store";

export const ORDERS_QUERY_KEY = ["customer-orders"] as const;

function reportMutationError(error: ApiError | Error) {
  if (error instanceof ApiError && !error.isValidation) {
    toast.error(error.message);
  } else if (error instanceof ApiError && error.isValidation) {
    const firstError = error.errors ? Object.values(error.errors)[0]?.[0] : null;
    toast.error(firstError || error.message || "Failed to process request.");
  } else if (!(error instanceof ApiError)) {
    toast.error(error.message || "An unexpected error occurred.");
  }
}

export function useCustomerOrders(params?: OrderListParams) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, params?.page ?? 1, params?.per_page ?? 10],
    queryFn: async () => {
      const res = await ordersApi.getOrders(params);
      return {
        orders: res.data,
        meta: res.meta,
      };
    },
    enabled: isAuthenticated,
  });
}

export function useCustomerOrder(id: string | number) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, "detail", String(id)],
    queryFn: async () => (await ordersApi.getOrder(id)).data,
    enabled: isAuthenticated && Boolean(id),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string | number; reason?: string }) =>
      ordersApi.cancelOrder(id, reason),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ORDERS_QUERY_KEY, "detail", String(variables.id)],
      });
      toast.success(response.message || "Order cancelled successfully.");
    },
    onError: reportMutationError,
  });
}
