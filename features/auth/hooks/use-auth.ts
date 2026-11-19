"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "../api/auth.api";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
} from "../types/auth.types";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/lib/api/error";

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      toast.success("Account created successfully!");
      router.push("/");
    },
    onError: (error: ApiError) => {
      if (!error.isValidation) {
        toast.error(error.message);
      }
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      toast.success("Welcome back!");
      const redirect = searchParams.get("redirect");
      router.push(redirect ?? "/");
    },
    onError: (error: ApiError) => {
      if (!error.isValidation) {
        toast.error(error.message);
      }
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success("Logged out successfully.");
      router.push("/login");
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
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

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authApi.resetPassword(payload),
    onSuccess: () => {
      toast.success("Password reset successfully. Please sign in.");
      router.push("/login");
    },
    onError: (error: ApiError) => {
      if (!error.isValidation) {
        toast.error(error.message);
      }
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      authApi.updateProfile(payload),
    onSuccess: (response) => {
      setUser(response.data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully.");
    },
    onError: (error: ApiError) => {
      if (!error.isValidation) {
        toast.error(error.message);
      }
    },
  });
}

export function useProfile() {
  const { isAuthenticated, setUser } = useAuthStore();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await authApi.getProfile();
      setUser(response.data);
      return response.data;
    },
    enabled: isAuthenticated,
    retry: false,
  });
}
