import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type {
  AdminPermission,
  AdminRole,
  AdminStaffMember,
  RolePayload,
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

  updateStaffRoles(staffId: number, roles: string[]) {
    return api.put<ApiSuccessResponse<AdminStaffMember>>(
      `/admin/staff/${staffId}/roles`,
      { roles }
    );
  },
};
