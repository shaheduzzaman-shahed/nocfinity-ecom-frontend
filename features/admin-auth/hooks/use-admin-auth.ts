"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { adminAuthApi } from "../api/admin-auth.api";
import type {
  AdminLoginPayload,
  UpdateStaffPasswordPayload,
  UpdateStaffProfilePayload,
} from "../types/admin-auth.types";
import { useAdminAuthStore } from "@/stores/admin-auth.store";
import type { ApiError } from "@/lib/api/error";

const ADMIN_PROFILE_QUERY_KEY = ["admin-profile"];

export function useAdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAdminAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: AdminLoginPayload) => adminAuthApi.login(payload),
    onSuccess: (response) => {
      setAuth(
        response.data.user,
        response.data.permissions,
        response.data.token
      );
      toast.success("Welcome back!");
      const redirect = searchParams.get("redirect");
      router.push(redirect ?? "/admin");
    },
    onError: (error: ApiError) => {
      if (!error.isValidation) {
        toast.error(error.message);
      }
    },
  });
}

export function useAdminLogout() {
  const router = useRouter();
  const clearAuth = useAdminAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminAuthApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success("Logged out successfully.");
      router.push("/admin/login");
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      router.push("/admin/login");
    },
  });
}

export function useAdminProfile() {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const setProfile = useAdminAuthStore((state) => state.setProfile);

  return useQuery({
    queryKey: ADMIN_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const response = await adminAuthApi.getProfile();
      setProfile(response.data.user, response.data.permissions);
      return response.data;
    },
    enabled: isAuthenticated,
    retry: false,
  });
}

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();
  const setProfile = useAdminAuthStore((state) => state.setProfile);

  return useMutation({
    mutationFn: (payload: UpdateStaffProfilePayload) =>
      adminAuthApi.updateProfile(payload),
    onSuccess: (response) => {
      setProfile(response.data.user, response.data.permissions);
      queryClient.invalidateQueries({ queryKey: ADMIN_PROFILE_QUERY_KEY });
      toast.success(response.message);
    },
    onError: (error: ApiError) => {
      if (!error.isValidation) {
        toast.error(error.message);
      }
    },
  });
}

export function useUpdateAdminPassword() {
  return useMutation({
    mutationFn: (payload: UpdateStaffPasswordPayload) =>
      adminAuthApi.updatePassword(payload),
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error: ApiError) => {
      if (!error.isValidation) {
        toast.error(error.message);
      }
    },
  });
}
