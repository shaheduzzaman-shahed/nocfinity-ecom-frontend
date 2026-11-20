"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/error";
import { adminOrdersApi } from "../api/admin-orders.api";
import type {
  AdminOrderListParams,
  UpdateOrderStatusPayload,
} from "../types/admin-order.types";

export const ADMIN_ORDERS_QUERY_KEY = ["admin", "orders"] as const;

function reportMutationError(error: ApiError | Error) {
  if (error instanceof ApiError && !error.isValidation) {
    toast.error(error.message);
  } else if (error instanceof ApiError && error.isValidation) {
    const firstError = error.errors ? Object.values(error.errors)[0]?.[0] : null;
    toast.error(firstError || error.message || "Failed to update order.");
  } else if (!(error instanceof ApiError)) {
    toast.error(error.message || "An unexpected error occurred.");
  }
}

export function useAdminOrders(params: AdminOrderListParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_QUERY_KEY, params],
    queryFn: async () => adminOrdersApi.listOrders(params),
  });
}

export function useAdminOrder(orderId: string | number) {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_QUERY_KEY, "detail", String(orderId)],
    queryFn: async () => (await adminOrdersApi.getOrder(orderId)).data,
    enabled: Boolean(orderId),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number;
      payload: UpdateOrderStatusPayload;
    }) => adminOrdersApi.updateStatus(id, payload),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_ORDERS_QUERY_KEY, "detail", String(variables.id)],
      });
      toast.success(response.message || "Order status updated successfully.");
    },
    onError: reportMutationError,
  });
}
