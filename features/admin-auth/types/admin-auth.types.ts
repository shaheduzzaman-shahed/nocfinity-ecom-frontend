import type { User } from "@/features/auth/types/auth.types";

export interface AdminAuthResponse {
  user: User;
  permissions: string[];
  token: string;
}

export interface AdminProfileResponse {
  user: User;
  permissions: string[];
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface UpdateStaffProfilePayload {
  name: string;
}

export interface UpdateStaffPasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}
