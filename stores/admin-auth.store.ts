"use client";

import { create } from "zustand";
import type { User } from "@/features/auth/types/auth.types";
import {
  removeTokenCookie,
  setTokenCookie,
} from "@/lib/auth/token-cookie";

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_COOKIE_NAME = "admin_token";

interface AdminAuthState {
  user: User | null;
  permissions: string[];
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, permissions: string[], token: string) => void;
  setProfile: (user: User, permissions: string[]) => void;
  clearAuth: () => void;
}

/**
 * Staff authentication is stored separately from the customer session so the
 * two tokens can never be used interchangeably.
 */
export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  permissions: [],
  token:
    typeof window !== "undefined"
      ? localStorage.getItem(ADMIN_TOKEN_KEY)
      : null,
  isAuthenticated:
    typeof window !== "undefined"
      ? !!localStorage.getItem(ADMIN_TOKEN_KEY)
      : false,

  setAuth: (user, permissions, token) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    setTokenCookie(ADMIN_COOKIE_NAME, token);
    set({ user, permissions, token, isAuthenticated: true });
  },

  setProfile: (user, permissions) => {
    set({ user, permissions });
  },

  clearAuth: () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    removeTokenCookie(ADMIN_COOKIE_NAME);
    set({ user: null, permissions: [], token: null, isAuthenticated: false });
  },
}));
