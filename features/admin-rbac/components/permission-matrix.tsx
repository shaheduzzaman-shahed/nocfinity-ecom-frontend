"use client";

import { useMemo } from "react";
import { groupPermissions } from "../lib/permissions";
import type {
  AdminPermission,
  PermissionModuleGroup,
} from "../types/admin-rbac.types";

interface PermissionMatrixProps {
  permissions: AdminPermission[];
  selected: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

export function PermissionMatrix({
  permissions,
  selected,
  onChange,
  disabled = false,
}: PermissionMatrixProps) {
  const groups = useMemo(() => groupPermissions(permissions), [permissions]);

  const togglePermission = (name: string) => {
    onChange(
      selected.includes(name)
        ? selected.filter((permission) => permission !== name)
        : [...selected, name]
    );
  };

  const toggleModule = (group: PermissionModuleGroup) => {
    const modulePermissions = group.permissions.map(
      (permission) => permission.name
    );
    const allSelected = modulePermissions.every((name) =>
      selected.includes(name)
    );

    onChange(
      allSelected
        ? selected.filter((name) => !modulePermissions.includes(name))
        : Array.from(new Set([...selected, ...modulePermissions]))
    );
  };

  if (groups.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No permissions are available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const modulePermissions = group.permissions.map(
          (permission) => permission.name
        );
        const allSelected = modulePermissions.every((name) =>
          selected.includes(name)
        );
        const sectionId = `permission-group-${group.module}`;

        return (
          <section
            key={group.module}
            aria-labelledby={sectionId}
            className="rounded-lg border p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 id={sectionId} className="text-sm font-semibold">
                {group.label}
              </h3>
              <button
                type="button"
                className="text-xs font-medium text-primary underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-50"
                onClick={() => toggleModule(group)}
                disabled={disabled}
              >
                {allSelected ? "Clear all" : "Select all"}
              </button>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {group.permissions.map((permission) => (
                <label
                  key={permission.name}
                  className="flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 text-sm hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 rounded border-input accent-primary"
                    checked={selected.includes(permission.name)}
                    onChange={() => togglePermission(permission.name)}
                    disabled={disabled}
                  />
                  <span>
                    <span className="font-mono text-xs font-medium">
                      {permission.name}
                    </span>
                    {permission.description && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {permission.description}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
