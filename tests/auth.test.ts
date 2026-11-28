import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/features/auth/schemas/auth.schema";
import { useAuthStore } from "@/stores/auth.store";
import { useAdminAuthStore } from "@/stores/admin-auth.store";

const storage = new Map<string, string>();
beforeAll(() => {
  globalThis.localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
    length: 0,
    key: () => null,
  };
});

describe("Frontend Auth Testing", () => {
  describe("Registration Validation", () => {
    it("accepts a valid registration payload", () => {
      const valid = {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "Password123!",
        password_confirmation: "Password123!",
      };
      const result = registerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects weak passwords missing required character classes", () => {
      const weakPasswords = [
        "short1!",       // < 8 chars
        "alllowercase1!", // no uppercase
        "ALLUPPERCASE1!", // no lowercase
        "NoNumbersHere!", // no number
        "NoSpecialChar1", // no special char
      ];

      for (const pwd of weakPasswords) {
        const result = registerSchema.safeParse({
          name: "User",
          email: "user@example.com",
          password: pwd,
          password_confirmation: pwd,
        });
        expect(result.success).toBe(false);
      }
    });

    it("rejects mismatched password confirmation", () => {
      const result = registerSchema.safeParse({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "Password123!",
        password_confirmation: "Different123!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Passwords do not match");
      }
    });

    it("rejects invalid email formats", () => {
      const result = registerSchema.safeParse({
        name: "Jane Doe",
        email: "not-an-email",
        password: "Password123!",
        password_confirmation: "Password123!",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Login Validation", () => {
    it("validates valid email and password", () => {
      const result = loginSchema.safeParse({
        email: "customer@example.com",
        password: "secretpassword",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing email or password", () => {
      expect(loginSchema.safeParse({ email: "", password: "foo" }).success).toBe(false);
      expect(loginSchema.safeParse({ email: "test@example.com", password: "" }).success).toBe(false);
    });
  });

  describe("Password Reset Validation", () => {
    it("validates forgot password email", () => {
      expect(forgotPasswordSchema.safeParse({ email: "user@example.com" }).success).toBe(true);
      expect(forgotPasswordSchema.safeParse({ email: "invalid" }).success).toBe(false);
    });

    it("validates reset password schema with token, password confirmation", () => {
      const valid = {
        token: "sample-token-abc",
        email: "user@example.com",
        password: "NewPassword123!",
        password_confirmation: "NewPassword123!",
      };
      expect(resetPasswordSchema.safeParse(valid).success).toBe(true);
    });
  });

  describe("Store Isolation (Customer vs Admin)", () => {
    beforeEach(() => {
      useAuthStore.getState().clearAuth();
      useAdminAuthStore.getState().clearAuth();
    });

    it("maintains separate customer and admin authentication states", () => {
      const customer = {
        id: 1,
        name: "Customer Jane",
        email: "jane@customer.com",
        account_type: "customer" as const,
        phone: null,
        avatar: null,
        is_active: true,
        email_verified_at: null,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };

      const adminUser = {
        id: 99,
        name: "Admin Alice",
        email: "admin@store.com",
        account_type: "staff" as const,
        phone: null,
        avatar: null,
        is_active: true,
        email_verified_at: null,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };

      // Set customer auth
      useAuthStore.getState().setAuth(customer, "customer-token-123");
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user?.email).toBe("jane@customer.com");
      expect(useAdminAuthStore.getState().isAuthenticated).toBe(false);

      // Set admin auth
      useAdminAuthStore.getState().setAuth(adminUser, ["products.view", "orders.edit"], "admin-token-xyz");
      expect(useAdminAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAdminAuthStore.getState().permissions).toContain("products.view");

      // Customer clear does not clear admin
      useAuthStore.getState().clearAuth();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAdminAuthStore.getState().isAuthenticated).toBe(true);
    });
  });
});
