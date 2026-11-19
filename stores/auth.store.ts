"use client";

import { create } from "zustand";
import type { User } from "@/features/auth/types/auth.types";

function setTokenCookie(token: string) {
  document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

function removeTokenCookie() {
  document.cookie = "auth_token=; path=/; max-age=0";
}

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
  token: typeof window !== "undefined" ? localStorage.getItem("auth_token") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("auth_token") : false,

  setAuth: (user, token) => {
    localStorage.setItem("auth_token", token);
    setTokenCookie(token);
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem("auth_token");
    removeTokenCookie();
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user });
  },
}));
