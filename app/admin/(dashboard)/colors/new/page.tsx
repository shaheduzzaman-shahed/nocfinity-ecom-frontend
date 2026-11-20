"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { ColorForm } from "@/features/admin-colors/components/color-form";
import { useCreateColor } from "@/features/admin-colors/hooks/use-admin-colors";
import { ApiError } from "@/lib/api/error";

export default function NewAdminColorPage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "products.create")) {
    return (
      <NoAccess message="You need the products.create permission to create colors." />
    );
  }

  return <NewColorContent />;
}

function NewColorContent() {
  const router = useRouter();
  const createColor = useCreateColor();

  const serverErrors =
    createColor.error instanceof ApiError ? createColor.error.errors : undefined;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/colors"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to colors
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-bold">Create color</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a color option for product variants.
        </p>
      </div>

      <ColorForm
        submitLabel="Create color"
        isSubmitting={createColor.isPending}
        serverErrors={serverErrors}
        onSubmit={(payload) =>
          createColor.mutate(payload, {
            onSuccess: () => router.push("/admin/colors"),
          })
        }
      />
    </div>
  );
}
