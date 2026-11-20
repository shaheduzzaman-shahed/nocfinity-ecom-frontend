"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/error";
import { addressesApi } from "../api/addresses.api";
import type { AddressPayload } from "../types/address.types";
import { useAuthStore } from "@/stores/auth.store";

export const ADDRESSES_QUERY_KEY = ["addresses"] as const;

function reportMutationError(error: ApiError | Error) {
  if (error instanceof ApiError && !error.isValidation) {
    toast.error(error.message);
  } else if (!(error instanceof ApiError)) {
    toast.error(error.message || "An unexpected error occurred.");
  }
}

export function useAddresses() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: async () => (await addressesApi.getAddresses()).data,
    enabled: isAuthenticated,
  });
}

export function useAddress(addressId: number) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: [...ADDRESSES_QUERY_KEY, addressId],
    queryFn: async () => (await addressesApi.getAddress(addressId)).data,
    enabled: isAuthenticated && Number.isInteger(addressId) && addressId > 0,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddressPayload) => addressesApi.createAddress(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
      toast.success(response.message || "Shipping address added successfully.");
    },
    onError: reportMutationError,
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AddressPayload> }) =>
      addressesApi.updateAddress(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
      toast.success(response.message || "Shipping address updated successfully.");
    },
    onError: reportMutationError,
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) => addressesApi.deleteAddress(addressId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
      toast.success(response.message || "Shipping address removed.");
    },
    onError: reportMutationError,
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) => addressesApi.setDefaultAddress(addressId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
      toast.success(response.message || "Default shipping address set.");
    },
    onError: reportMutationError,
  });
}
