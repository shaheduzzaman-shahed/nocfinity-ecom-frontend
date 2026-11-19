"use client";

import { create } from "zustand";
import type { User } from "@/features/auth/types/auth.types";
import {
  removeTokenCookie,
  setTokenCookie,
} from "@/lib/auth/token-cookie";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_COOKIE_NAME = "auth_token";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token:
    typeof window !== "undefined"
      ? localStorage.getItem(AUTH_TOKEN_KEY)
      : null,
  isAuthenticated:
    typeof window !== "undefined" ? !!localStorage.getItem(AUTH_TOKEN_KEY) : false,

  setAuth: (user, token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setTokenCookie(AUTH_COOKIE_NAME, token);
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    removeTokenCookie(AUTH_COOKIE_NAME);
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user });
  },
}));
