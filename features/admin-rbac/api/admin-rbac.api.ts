import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type {
  AdminPermission,
  AdminRole,
  AdminStaffMember,
  CreateStaffPayload,
  RolePayload,
  UpdateStaffPayload,
} from "../types/admin-rbac.types";

export const adminRbacApi = {
  listRoles() {
    return api.get<ApiSuccessResponse<AdminRole[]>>("/admin/roles");
  },

  getRole(roleId: number) {
    return api.get<ApiSuccessResponse<AdminRole>>(`/admin/roles/${roleId}`);
  },

  createRole(payload: RolePayload) {
    return api.post<ApiSuccessResponse<AdminRole>>("/admin/roles", payload);
  },

  updateRole(roleId: number, payload: RolePayload) {
    return api.put<ApiSuccessResponse<AdminRole>>(
      `/admin/roles/${roleId}`,
      payload
    );
  },

  deleteRole(roleId: number) {
    return api.delete<ApiSuccessResponse<null>>(`/admin/roles/${roleId}`);
  },

  listPermissions() {
    return api.get<ApiSuccessResponse<AdminPermission[]>>("/admin/permissions");
  },

  listStaff() {
    return api.get<ApiSuccessResponse<AdminStaffMember[]>>("/admin/staff");
  },

  getStaff(staffId: number) {
    return api.get<ApiSuccessResponse<AdminStaffMember>>(`/admin/staff/${staffId}`);
  },

  createStaff(payload: CreateStaffPayload) {
    return api.post<ApiSuccessResponse<AdminStaffMember>>("/admin/staff", payload);
  },

  updateStaff(staffId: number, payload: UpdateStaffPayload) {
    return api.put<ApiSuccessResponse<AdminStaffMember>>(
      `/admin/staff/${staffId}`,
      payload
    );
  },

  toggleStaffStatus(staffId: number, is_active: boolean) {
    return api.patch<ApiSuccessResponse<AdminStaffMember>>(
      `/admin/staff/${staffId}/status`,
      { is_active }
    );
  },

  deleteStaff(staffId: number) {
    return api.delete<ApiSuccessResponse<null>>(`/admin/staff/${staffId}`);
  },

  updateStaffRoles(staffId: number, roles: string[]) {
    return api.put<ApiSuccessResponse<AdminStaffMember>>(
      `/admin/staff/${staffId}/roles`,
      { roles }
    );
  },
};
