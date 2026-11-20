"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ShieldCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { useDeleteRole, useRoles } from "@/features/admin-rbac/hooks/use-admin-rbac";
import type { AdminRole } from "@/features/admin-rbac/types/admin-rbac.types";
import { NoAccess } from "@/features/admin-rbac/components/no-access";

export default function AdminRolesPage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "roles.view")) {
    return <NoAccess />;
  }

  return <RolesContent permissions={permissions} />;
}

function RolesContent({ permissions }: { permissions: string[] }) {
  const canManage = hasPermission(permissions, "roles.manage");
  const rolesQuery = useRoles();
  const deleteRole = useDeleteRole();
  const [roleToDelete, setRoleToDelete] = useState<AdminRole | null>(null);

  const roles = rolesQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Roles & permissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create custom roles and control exactly what each staff member can
            access.
          </p>
        </div>
        {canManage && (
          <Link
            href="/admin/roles/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="h-4 w-4" />
            New role
          </Link>
        )}
      </div>

      {rolesQuery.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">Unable to load roles.</p>
          <p className="mt-1 text-muted-foreground">
            {rolesQuery.error instanceof Error
              ? rolesQuery.error.message
              : "Please try again."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => rolesQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      )}

      {rolesQuery.isLoading && (
        <div className="space-y-2 rounded-lg border p-4">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="h-10 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      )}

      {!rolesQuery.isLoading && !rolesQuery.isError && roles.length === 0 && (
        <div className="rounded-lg border p-10 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium">No roles yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first custom role to start assigning permissions.
          </p>
        </div>
      )}

      {roles.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Permissions</th>
                <th className="px-4 py-3 font-medium">Staff</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {roles.map((role) => (
                <tr key={role.id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{role.display_name}</span>
                      {role.is_system && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          System
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {role.name}
                    </p>
                    {role.description && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {role.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">{role.permissions.length}</td>
                  <td className="px-4 py-3">{role.users_count}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {role.is_system ? (
                        <span className="text-xs text-muted-foreground">
                          Protected
                        </span>
                      ) : canManage ? (
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/roles/${role.id}/edit`}
                            className={buttonVariants({
                              variant: "outline",
                              size: "sm",
                            })}
                          >
                            Edit
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => setRoleToDelete(role)}
                          >
                            Delete
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          View only
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={roleToDelete !== null}
        title="Delete role"
        description={
          roleToDelete
            ? `Delete "${roleToDelete.display_name}"? This cannot be undone. Roles still assigned to staff cannot be deleted.`
            : ""
        }
        confirmLabel="Delete role"
        isPending={deleteRole.isPending}
        onConfirm={() => {
          if (!roleToDelete) return;

          deleteRole.mutate(roleToDelete.id, {
            onSuccess: () => setRoleToDelete(null),
          });
        }}
        onCancel={() => setRoleToDelete(null)}
      />
    </div>
  );
}
