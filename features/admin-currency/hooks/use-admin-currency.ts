"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/error";
import { adminCurrencyApi } from "../api/admin-currency.api";
import type { UpdateCurrencyPayload } from "../types/admin-currency.types";

export const ADMIN_CURRENCY_QUERY_KEY = ["admin", "settings", "currency"] as const;

function reportMutationError(error: ApiError | Error) {
  if (error instanceof ApiError && !error.isValidation) {
    toast.error(error.message);
  } else if (!(error instanceof ApiError)) {
    toast.error(error.message || "An unexpected error occurred.");
  }
}

export function useAdminCurrencySettings() {
  return useQuery({
    queryKey: ADMIN_CURRENCY_QUERY_KEY,
    queryFn: async () => (await adminCurrencyApi.getCurrencySettings()).data,
  });
}

export function useUpdateCurrencySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCurrencyPayload) =>
      adminCurrencyApi.updateCurrencySettings(payload),
    onSuccess: (response) => {
      queryClient.setQueryData(ADMIN_CURRENCY_QUERY_KEY, response.data);
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(response.message || "Store currency updated successfully.");
    },
    onError: reportMutationError,
  });
}
