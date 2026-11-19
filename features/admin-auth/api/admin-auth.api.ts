import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type {
  AdminAuthResponse,
  AdminLoginPayload,
  AdminProfileResponse,
  UpdateStaffPasswordPayload,
  UpdateStaffProfilePayload,
} from "../types/admin-auth.types";

export const adminAuthApi = {
  login(payload: AdminLoginPayload) {
    return api.post<ApiSuccessResponse<AdminAuthResponse>>(
      "/admin/login",
      payload
    );
  },

  logout() {
    return api.post<ApiSuccessResponse<null>>("/admin/logout");
  },

  getProfile() {
    return api.get<ApiSuccessResponse<AdminProfileResponse>>("/admin/profile");
  },

  updateProfile(payload: UpdateStaffProfilePayload) {
    return api.put<ApiSuccessResponse<AdminProfileResponse>>(
      "/admin/profile",
      payload
    );
  },

  updatePassword(payload: UpdateStaffPasswordPayload) {
    return api.put<ApiSuccessResponse<null>>(
      "/admin/profile/password",
      payload
    );
  },
};
