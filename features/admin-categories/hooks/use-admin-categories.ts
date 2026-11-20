"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api/error";
import { adminCategoriesApi } from "../api/admin-categories.api";
import type { CategoryPayload } from "../types/admin-category.types";

export const ADMIN_CATEGORIES_QUERY_KEY = ["admin", "categories"] as const;

function reportMutationError(error: ApiError) {
  if (!error.isValidation) {
    toast.error(error.message);
  }
}

export function useCategories() {
  return useQuery({
    queryKey: ADMIN_CATEGORIES_QUERY_KEY,
    queryFn: async () => (await adminCategoriesApi.listCategories()).data,
  });
}

export function useCategory(categoryId: number | null) {
  return useQuery({
    queryKey: [...ADMIN_CATEGORIES_QUERY_KEY, categoryId],
    queryFn: async () =>
      (await adminCategoriesApi.getCategory(categoryId as number)).data,
    enabled: categoryId !== null,
    retry: false,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoryPayload) =>
      adminCategoriesApi.createCategory(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useUpdateCategory(categoryId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoryPayload) =>
      adminCategoriesApi.updateCategory(categoryId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useUpdateCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      isActive,
    }: {
      categoryId: number;
      isActive: boolean;
    }) => adminCategoriesApi.updateCategoryStatus(categoryId, isActive),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) =>
      adminCategoriesApi.deleteCategory(categoryId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}
