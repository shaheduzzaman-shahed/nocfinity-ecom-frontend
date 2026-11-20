"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api/error";
import { adminRbacApi } from "../api/admin-rbac.api";
import type { RolePayload } from "../types/admin-rbac.types";

export const ADMIN_ROLES_QUERY_KEY = ["admin", "roles"] as const;
export const ADMIN_PERMISSIONS_QUERY_KEY = ["admin", "permissions"] as const;
export const ADMIN_STAFF_QUERY_KEY = ["admin", "staff"] as const;
export const ADMIN_PROFILE_QUERY_KEY = ["admin-profile"] as const;

function reportMutationError(error: ApiError) {
  if (!error.isValidation) {
    toast.error(error.message);
  }
}

export function useRoles() {
  return useQuery({
    queryKey: ADMIN_ROLES_QUERY_KEY,
    queryFn: async () => (await adminRbacApi.listRoles()).data,
  });
}

export function useRole(roleId: number | null) {
  return useQuery({
    queryKey: [...ADMIN_ROLES_QUERY_KEY, roleId],
    queryFn: async () => (await adminRbacApi.getRole(roleId as number)).data,
    enabled: roleId !== null,
    retry: false,
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: ADMIN_PERMISSIONS_QUERY_KEY,
    queryFn: async () => (await adminRbacApi.listPermissions()).data,
    staleTime: Infinity,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RolePayload) => adminRbacApi.createRole(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ROLES_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useUpdateRole(roleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RolePayload) =>
      adminRbacApi.updateRole(roleId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ROLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_STAFF_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: number) => adminRbacApi.deleteRole(roleId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ROLES_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}

export function useStaff() {
  return useQuery({
    queryKey: ADMIN_STAFF_QUERY_KEY,
    queryFn: async () => (await adminRbacApi.listStaff()).data,
  });
}

export function useUpdateStaffRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ staffId, roles }: { staffId: number; roles: string[] }) =>
      adminRbacApi.updateStaffRoles(staffId, roles),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STAFF_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_PROFILE_QUERY_KEY });
      toast.success(response.message);
    },
    onError: reportMutationError,
  });
}
