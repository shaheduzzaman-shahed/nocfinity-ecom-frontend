"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { SizeForm } from "@/features/admin-sizes/components/size-form";
import { useCreateSize } from "@/features/admin-sizes/hooks/use-admin-sizes";
import { ApiError } from "@/lib/api/error";

export default function NewAdminSizePage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "products.create")) {
    return (
      <NoAccess message="You need the products.create permission to create sizes." />
    );
  }

  return <NewSizeContent />;
}

function NewSizeContent() {
  const router = useRouter();
  const createSize = useCreateSize();

  const serverErrors =
    createSize.error instanceof ApiError ? createSize.error.errors : undefined;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/sizes"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sizes
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-bold">Create size</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a size option for product variants.
        </p>
      </div>

      <SizeForm
        submitLabel="Create size"
        isSubmitting={createSize.isPending}
        serverErrors={serverErrors}
        onSubmit={(payload) =>
          createSize.mutate(payload, {
            onSuccess: () => router.push("/admin/sizes"),
          })
        }
      />
    </div>
  );
}
