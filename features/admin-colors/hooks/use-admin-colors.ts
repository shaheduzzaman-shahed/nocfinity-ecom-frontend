"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api/error";
import { adminColorsApi } from "../api/admin-colors.api";
import type { ColorPayload } from "../types/admin-color.types";

export const ADMIN_COLORS_QUERY_KEY = ["admin", "colors"] as const;

function reportMutationError(error: ApiError) {
  if (!error.isValidation) {
    toast.error(error.message);
  }
}

export function useColors() {
  return useQuery({
    queryKey: ADMIN_COLORS_QUERY_KEY,
    queryFn: async () => (await adminColorsApi.listColors()).data,
  });
}

export function useCreateColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ColorPayload) =>
      adminColorsApi.createColor(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COLORS_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useUpdateColor(colorId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ColorPayload) =>
      adminColorsApi.updateColor(colorId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COLORS_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useDeleteColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (colorId: number) => adminColorsApi.deleteColor(colorId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COLORS_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}
