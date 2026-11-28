import { describe, it, expect } from "vitest";
import { roleDetailsSchema } from "@/features/admin-rbac/schemas/admin-rbac.schema";

/**
 * Super Admin Protection & Permission Evaluation:
 * - Super admin role has all permissions implicitly.
 * - Regular staff only has explicitly assigned permissions.
 * - Super Admin cannot be downgraded or deleted.
 */
function hasPermission(
  roles: string[],
  userPermissions: string[],
  requiredPermission: string
): boolean {
  if (roles.includes("super-admin")) {
    return true;
  }
  return userPermissions.includes(requiredPermission);
}

function canDeleteStaff(targetStaffRoles: string[]): boolean {
  // Super Admin can never be deleted
  return !targetStaffRoles.includes("super-admin");
}

describe("Frontend Admin RBAC & Permissions", () => {
  it("grants all permissions to Super Admin", () => {
    const isSuperAdmin = hasPermission(["super-admin"], [], "orders.delete");
    expect(isSuperAdmin).toBe(true);
  });

  it("checks specific permission for regular staff", () => {
    const staffPermissions = ["products.view", "products.edit"];

    expect(hasPermission(["manager"], staffPermissions, "products.view")).toBe(true);
    expect(hasPermission(["manager"], staffPermissions, "products.edit")).toBe(true);
    expect(hasPermission(["manager"], staffPermissions, "orders.delete")).toBe(false);
  });

  it("enforces Super Admin deletion safeguard", () => {
    expect(canDeleteStaff(["super-admin"])).toBe(false);
    expect(canDeleteStaff(["manager"])).toBe(true);
    expect(canDeleteStaff(["support-agent"])).toBe(true);
  });

  describe("Role Schema Validation", () => {
    it("validates role creation payload", () => {
      const valid = {
        display_name: "Content Editor",
        description: "Manages product catalog and media",
      };

      const result = roleDetailsSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects empty role display name", () => {
      const invalid = {
        display_name: "",
        description: "Invalid empty role",
      };

      const result = roleDetailsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
