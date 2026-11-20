"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { RoleForm } from "@/features/admin-rbac/components/role-form";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import {
  usePermissions,
  useRole,
  useUpdateRole,
} from "@/features/admin-rbac/hooks/use-admin-rbac";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";

export default function EditAdminRolePage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "roles.view")) {
    return <NoAccess />;
  }

  return <EditRoleContent canManage={hasPermission(permissions, "roles.manage")} />;
}

function EditRoleContent({ canManage }: { canManage: boolean }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const roleId = Number(params.id);
  const roleQuery = useRole(Number.isInteger(roleId) ? roleId : null);
  const permissionsQuery = usePermissions();
  const updateRole = useUpdateRole(Number.isInteger(roleId) ? roleId : 0);

  const backLink = (
    <Link
      href="/admin/roles"
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to roles
    </Link>
  );

  if (roleQuery.isLoading) {
    return (
      <div className="space-y-6">
        {backLink}
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (roleQuery.isError || !roleQuery.data) {
    return (
      <div className="space-y-6">
        {backLink}
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">Unable to load role.</p>
          <p className="mt-1 text-muted-foreground">
            {roleQuery.error instanceof Error
              ? roleQuery.error.message
              : "The role may no longer exist."}
          </p>
        </div>
      </div>
    );
  }

  const role = roleQuery.data;

  return (
    <div className="space-y-6">
      <div>
        {backLink}
        <h1 className="mt-2 font-heading text-2xl font-bold">
          {role.display_name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Identifier: <span className="font-mono text-xs">{role.name}</span>
        </p>
      </div>

      {role.is_system ? (
        <Card>
          <CardHeader>
            <CardTitle>Protected role</CardTitle>
            <CardDescription>
              The Super Admin role automatically holds every permission and
              cannot be edited, deleted, or downgraded.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/roles"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Back to roles
            </Link>
          </CardContent>
        </Card>
      ) : !canManage ? (
        <NoAccess message="You need the roles.manage permission to edit roles." />
      ) : permissionsQuery.isLoading ? (
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      ) : permissionsQuery.data ? (
        <RoleForm
          key={role.id}
          permissions={permissionsQuery.data}
          defaultValues={{
            display_name: role.display_name,
            description: role.description,
            permissions: role.permissions,
          }}
          submitLabel="Save changes"
          isSubmitting={updateRole.isPending}
          onSubmit={(payload) =>
            updateRole.mutate(payload, {
              onSuccess: () => router.push("/admin/roles"),
            })
          }
        />
      ) : (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">
            Unable to load permissions.
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
    </div>
  );
}
