"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { RoleForm } from "@/features/admin-rbac/components/role-form";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import {
  useCreateRole,
  usePermissions,
} from "@/features/admin-rbac/hooks/use-admin-rbac";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";

export default function NewAdminRolePage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "roles.manage")) {
    return (
      <NoAccess message="You need the roles.manage permission to create roles." />
    );
  }

  return <NewRoleContent />;
}

function NewRoleContent() {
  const router = useRouter();
  const permissionsQuery = usePermissions();
  const createRole = useCreateRole();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/roles"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to roles
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-bold">Create role</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Name the role and choose the permissions it should grant.
        </p>
      </div>

      {permissionsQuery.isLoading && (
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      )}

      {permissionsQuery.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">
            Unable to load permissions.
          </p>
          <p className="mt-1 text-muted-foreground">
            {permissionsQuery.error instanceof Error
              ? permissionsQuery.error.message
              : "Please try again."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => permissionsQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      )}

      {permissionsQuery.data && (
        <RoleForm
          permissions={permissionsQuery.data}
          submitLabel="Create role"
          isSubmitting={createRole.isPending}
          onSubmit={(payload) =>
            createRole.mutate(payload, {
              onSuccess: () => router.push("/admin/roles"),
            })
          }
        />
      )}
    </div>
  );
}
