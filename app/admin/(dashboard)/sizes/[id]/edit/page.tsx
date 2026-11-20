"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { SizeForm } from "@/features/admin-sizes/components/size-form";
import {
  useSizes,
  useUpdateSize,
} from "@/features/admin-sizes/hooks/use-admin-sizes";
import { ApiError } from "@/lib/api/error";

export default function EditAdminSizePage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "products.view")) {
    return <NoAccess />;
  }

  return (
    <EditSizeContent canEdit={hasPermission(permissions, "products.edit")} />
  );
}

function EditSizeContent({ canEdit }: { canEdit: boolean }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sizeId = Number(params.id);
  const validSizeId = Number.isInteger(sizeId) ? sizeId : null;

  const sizesQuery = useSizes();
  const updateSize = useUpdateSize(validSizeId ?? 0);

  const backLink = (
    <Link
      href="/admin/sizes"
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to sizes
    </Link>
  );

  if (sizesQuery.isLoading) {
    return (
      <div className="space-y-6">
        {backLink}
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const size = sizesQuery.data?.find((item) => item.id === validSizeId);

  if (sizesQuery.isError || !size) {
    return (
      <div className="space-y-6">
        {backLink}
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">Unable to load size.</p>
          <p className="mt-1 text-muted-foreground">
            {sizesQuery.error instanceof Error
              ? sizesQuery.error.message
              : "The size may no longer exist."}
          </p>
          <Link
            href="/admin/sizes"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "mt-4",
            })}
          >
            Back to sizes
          </Link>
        </div>
      </div>
    );
  }

  const serverErrors =
    updateSize.error instanceof ApiError ? updateSize.error.errors : undefined;

  return (
    <div className="space-y-6">
      <div>
        {backLink}
        <h1 className="mt-2 font-heading text-2xl font-bold">{size.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Used by {size.product_variants_count ?? 0} product variants.
        </p>
      </div>

      {!canEdit ? (
        <NoAccess message="You need the products.edit permission to edit sizes." />
      ) : (
        <SizeForm
          key={size.id}
          defaultValues={{ name: size.name, sort_order: size.sort_order }}
          submitLabel="Save changes"
          isSubmitting={updateSize.isPending}
          serverErrors={serverErrors}
          onSubmit={(payload) =>
            updateSize.mutate(payload, {
              onSuccess: () => router.push("/admin/sizes"),
            })
          }
        />
      )}
    </div>
  );
}
