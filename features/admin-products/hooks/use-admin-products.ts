"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/error";
import { adminProductsApi } from "../api/admin-products.api";
import type {
  AdminProductListParams,
  ImageReorder,
  ProductPayload,
} from "../types/admin-product.types";

export const ADMIN_PRODUCTS_QUERY_KEY = ["admin", "products"] as const;

function reportMutationError(error: ApiError) {
  if (!error.isValidation) {
    toast.error(error.message);
  }
}

interface SaveProductInput {
  payload: ProductPayload;
  images: File[];
  primaryIndex: number | null;
}

export function useAdminProducts(params: AdminProductListParams) {
  return useQuery({
    queryKey: [...ADMIN_PRODUCTS_QUERY_KEY, "list", params],
    queryFn: () => adminProductsApi.listProducts(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminProduct(productId: number | null) {
  return useQuery({
    queryKey: [...ADMIN_PRODUCTS_QUERY_KEY, "detail", productId],
    queryFn: async () =>
      (await adminProductsApi.getProduct(productId as number)).data,
    enabled: productId !== null,
    retry: false,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, images, primaryIndex }: SaveProductInput) => {
      const response = await adminProductsApi.createProduct(payload);

      if (images.length > 0) {
        try {
          await adminProductsApi.uploadImages(
            response.data.id,
            images,
            primaryIndex ?? undefined
          );
        } catch (error) {
          toast.error(
            error instanceof ApiError
              ? `${response.message} Images could not be uploaded: ${error.message}`
              : `${response.message} Images could not be uploaded.`
          );
        }
      }

      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useUpdateProduct(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, images, primaryIndex }: SaveProductInput) => {
      const response = await adminProductsApi.updateProduct(productId, payload);

      if (images.length > 0) {
        try {
          await adminProductsApi.uploadImages(
            productId,
            images,
            primaryIndex ?? undefined
          );
        } catch (error) {
          toast.error(
            error instanceof ApiError
              ? `${response.message} Images could not be uploaded: ${error.message}`
              : `${response.message} Images could not be uploaded.`
          );
        }
      }

      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      isActive,
    }: {
      productId: number;
      isActive: boolean;
    }) => adminProductsApi.updateProductStatus(productId, isActive),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) =>
      adminProductsApi.deleteProduct(productId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useUpdateProductImage(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      imageId,
      data,
    }: {
      imageId: number;
      data: { is_primary?: boolean; sort_order?: number };
    }) => adminProductsApi.updateImage(productId, imageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
    },
    onError: reportMutationError,
  });
}

export function useDeleteProductImage(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: number) =>
      adminProductsApi.deleteImage(productId, imageId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useReorderProductImages(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (images: ImageReorder[]) => {
      await Promise.all(
        images.map((image) =>
          adminProductsApi.updateImage(productId, image.id, {
            sort_order: image.sort_order,
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
    },
    onError: reportMutationError,
  });
}
