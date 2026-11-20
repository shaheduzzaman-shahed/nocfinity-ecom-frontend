"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/error";
import { adminShippingApi } from "../api/admin-shipping.api";
import type { UpdateShippingSettingsPayload } from "../types/admin-shipping.types";

export const ADMIN_SHIPPING_QUERY_KEY = ["admin", "settings", "shipping"] as const;

function reportMutationError(error: ApiError | Error) {
  if (error instanceof ApiError && !error.isValidation) {
    toast.error(error.message);
  } else if (!(error instanceof ApiError)) {
    toast.error(error.message || "An unexpected error occurred.");
  }
}

export function useAdminShippingSettings() {
  return useQuery({
    queryKey: ADMIN_SHIPPING_QUERY_KEY,
    queryFn: async () => (await adminShippingApi.getShippingSettings()).data,
  });
}

export function useUpdateShippingSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateShippingSettingsPayload) =>
      adminShippingApi.updateShippingSettings(payload),
    onSuccess: (response) => {
      queryClient.setQueryData(ADMIN_SHIPPING_QUERY_KEY, response.data);
      toast.success(response.message || "Shipping settings updated successfully.");
    },
    onError: reportMutationError,
  });
}
