"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { useAdminAuthStore } from "@/stores/admin-auth.store";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import {
  useRoles,
  useStaff,
  useUpdateStaffRoles,
} from "@/features/admin-rbac/hooks/use-admin-rbac";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import type {
  AdminRole,
  AdminStaffMember,
} from "@/features/admin-rbac/types/admin-rbac.types";

export default function AdminStaffPage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "staff.manage")) {
    return <NoAccess />;
  }

  return <StaffContent />;
}

function StaffContent() {
  const staffQuery = useStaff();
  const rolesQuery = useRoles();
  const updateRoles = useUpdateStaffRoles();
  const currentUserId = useAdminAuthStore((state) => state.user?.id);

  const staff = staffQuery.data ?? [];
  const roles = rolesQuery.data ?? [];

  const hasError = staffQuery.isError || rolesQuery.isError;
  const isLoading = staffQuery.isLoading || rolesQuery.isLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Staff roles</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Assign roles to staff accounts. Effective permissions combine every
          role a staff member holds.
        </p>
      </div>

      {hasError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">
            Unable to load staff accounts.
          </p>
          <p className="mt-1 text-muted-foreground">
            {staffQuery.error instanceof Error
              ? staffQuery.error.message
              : "Please try again."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              staffQuery.refetch();
              rolesQuery.refetch();
            }}
          >
            Try again
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-2">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="h-24 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      )}

      {!isLoading && !hasError && staff.length === 0 && (
        <div className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
          No staff accounts found.
        </div>
      )}

      {!isLoading && !hasError && staff.length > 0 && (
        <div className="space-y-3">
          {roles.length === 0 && (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              No roles exist yet. Create a role before assigning permissions to
              staff.
            </p>
          )}

          {staff.map((member) => (
            <StaffRoleRow
              key={`${member.id}-${member.roles.join(",")}`}
              member={member}
              roles={roles}
              isSelf={member.id === currentUserId}
              isSaving={
                updateRoles.isPending &&
                updateRoles.variables?.staffId === member.id
              }
              onSave={(roleNames) =>
                updateRoles.mutate({ staffId: member.id, roles: roleNames })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface StaffRoleRowProps {
  member: AdminStaffMember;
  roles: AdminRole[];
  isSelf: boolean;
  isSaving: boolean;
  onSave: (roles: string[]) => void;
}

function StaffRoleRow({
  member,
  roles,
  isSelf,
  isSaving,
  onSave,
}: StaffRoleRowProps) {
  const [selected, setSelected] = useState<string[]>(member.roles);

  const isSuperAdmin = member.roles.includes("super-admin");
  const isLocked = isSelf || isSuperAdmin;
  const isDirty =
    [...selected].sort().join(",") !== [...member.roles].sort().join(",");
  const assignableRoles = roles.filter((role) => !role.is_system);

  const toggleRole = (name: string) => {
    if (isLocked) return;

    setSelected((current) =>
      current.includes(name)
        ? current.filter((role) => role !== name)
        : [...current, name]
    );
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{member.name}</span>
            {isSelf && (
              <Badge className="bg-primary/10 text-primary">You</Badge>
            )}
            {isSuperAdmin && <Badge>Super Admin</Badge>}
            {!member.is_active && <Badge>Inactive</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">{member.email}</p>
        </div>

        {!isLocked && (
          <Button
            size="sm"
            onClick={() => onSave(selected)}
            disabled={!isDirty || isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save roles
          </Button>
        )}
      </div>

      {isSuperAdmin ? (
        <p className="mt-3 text-xs text-muted-foreground">
          The Super Admin account is protected and cannot be modified.
        </p>
      ) : isLocked ? (
        <p className="mt-3 text-xs text-muted-foreground">
          You cannot change your own role assignments.
        </p>
      ) : assignableRoles.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">
          No assignable roles available.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {assignableRoles.map((role) => {
            const isSelected = selected.includes(role.name);

            return (
              <label
                key={role.name}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                  isSelected
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
              >
                <input
                  type="checkbox"
                  className="size-3.5 rounded border-input accent-primary"
                  checked={isSelected}
                  onChange={() => toggleRole(role.name)}
                  disabled={isSaving}
                />
                {role.display_name}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
