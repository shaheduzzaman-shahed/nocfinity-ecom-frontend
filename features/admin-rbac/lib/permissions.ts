import type {
  AdminPermission,
  PermissionModuleGroup,
} from "../types/admin-rbac.types";

export function hasPermission(
  permissions: string[],
  permission: string
): boolean {
  return permissions.includes(permission);
}

export function hasAnyPermission(
  permissions: string[],
  required: string[]
): boolean {
  return required.some((permission) => permissions.includes(permission));
}

export function formatModuleLabel(moduleName: string): string {
  return moduleName
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function groupPermissions(
  permissions: AdminPermission[]
): PermissionModuleGroup[] {
  const groups = new Map<string, AdminPermission[]>();

  permissions.forEach((permission) => {
    const moduleName = permission.module ?? "general";
    const modulePermissions = groups.get(moduleName) ?? [];
    modulePermissions.push(permission);
    groups.set(moduleName, modulePermissions);
  });

  return Array.from(groups.entries())
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([moduleName, modulePermissions]) => ({
      module: moduleName,
      label: formatModuleLabel(moduleName),
      permissions: modulePermissions,
    }));
}
