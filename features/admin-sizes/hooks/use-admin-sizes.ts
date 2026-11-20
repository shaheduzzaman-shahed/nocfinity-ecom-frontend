"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api/error";
import { adminSizesApi } from "../api/admin-sizes.api";
import type { SizePayload } from "../types/admin-size.types";

export const ADMIN_SIZES_QUERY_KEY = ["admin", "sizes"] as const;

function reportMutationError(error: ApiError) {
  if (!error.isValidation) {
    toast.error(error.message);
  }
}

export function useSizes() {
  return useQuery({
    queryKey: ADMIN_SIZES_QUERY_KEY,
    queryFn: async () => (await adminSizesApi.listSizes()).data,
  });
}

export function useCreateSize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SizePayload) => adminSizesApi.createSize(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SIZES_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useUpdateSize(sizeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SizePayload) =>
      adminSizesApi.updateSize(sizeId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SIZES_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useDeleteSize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sizeId: number) => adminSizesApi.deleteSize(sizeId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SIZES_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}
