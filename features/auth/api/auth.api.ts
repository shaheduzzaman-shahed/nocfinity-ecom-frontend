import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  User,
} from "../types/auth.types";

export const authApi = {
  register(payload: RegisterPayload) {
    return api.post<ApiSuccessResponse<AuthResponse>>("/register", payload);
  },

  login(payload: LoginPayload) {
    return api.post<ApiSuccessResponse<AuthResponse>>("/login", payload);
  },

  logout() {
    return api.post<ApiSuccessResponse<null>>("/logout");
  },

  getProfile() {
    return api.get<ApiSuccessResponse<User>>("/profile");
  },

  updateProfile(payload: UpdateProfilePayload) {
    return api.put<ApiSuccessResponse<User>>("/profile", payload);
  },

  forgotPassword(payload: ForgotPasswordPayload) {
    return api.post<ApiSuccessResponse<null>>("/forgot-password", payload);
  },

  resetPassword(payload: ResetPasswordPayload) {
    return api.post<ApiSuccessResponse<null>>("/reset-password", payload);
  },
};
