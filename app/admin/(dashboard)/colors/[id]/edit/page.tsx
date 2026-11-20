"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { ColorForm } from "@/features/admin-colors/components/color-form";
import {
  useColors,
  useUpdateColor,
} from "@/features/admin-colors/hooks/use-admin-colors";
import { ApiError } from "@/lib/api/error";

export default function EditAdminColorPage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "products.view")) {
    return <NoAccess />;
  }

  return (
    <EditColorContent canEdit={hasPermission(permissions, "products.edit")} />
  );
}

function EditColorContent({ canEdit }: { canEdit: boolean }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const colorId = Number(params.id);
  const validColorId = Number.isInteger(colorId) ? colorId : null;

  const colorsQuery = useColors();
  const updateColor = useUpdateColor(validColorId ?? 0);

  const backLink = (
    <Link
      href="/admin/colors"
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to colors
    </Link>
  );

  if (colorsQuery.isLoading) {
    return (
      <div className="space-y-6">
        {backLink}
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const color = colorsQuery.data?.find((item) => item.id === validColorId);

  if (colorsQuery.isError || !color) {
    return (
      <div className="space-y-6">
        {backLink}
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">Unable to load color.</p>
          <p className="mt-1 text-muted-foreground">
            {colorsQuery.error instanceof Error
              ? colorsQuery.error.message
              : "The color may no longer exist."}
          </p>
          <Link
            href="/admin/colors"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "mt-4",
            })}
          >
            Back to colors
          </Link>
        </div>
      </div>
    );
  }

  const serverErrors =
    updateColor.error instanceof ApiError ? updateColor.error.errors : undefined;

  return (
    <div className="space-y-6">
      <div>
        {backLink}
        <h1 className="mt-2 font-heading text-2xl font-bold">{color.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Used by {color.product_variants_count ?? 0} product variants.
        </p>
      </div>

      {!canEdit ? (
        <NoAccess message="You need the products.edit permission to edit colors." />
      ) : (
        <ColorForm
          key={color.id}
          defaultValues={{ name: color.name, hex_code: color.hex_code }}
          submitLabel="Save changes"
          isSubmitting={updateColor.isPending}
          serverErrors={serverErrors}
          onSubmit={(payload) =>
            updateColor.mutate(payload, {
              onSuccess: () => router.push("/admin/colors"),
            })
          }
        />
      )}
    </div>
  );
}
