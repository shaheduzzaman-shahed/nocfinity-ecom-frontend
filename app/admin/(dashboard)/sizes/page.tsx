"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Ruler } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import {
  useDeleteSize,
  useSizes,
} from "@/features/admin-sizes/hooks/use-admin-sizes";
import type { AdminSize } from "@/features/admin-sizes/types/admin-size.types";

export default function AdminSizesPage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "products.view")) {
    return <NoAccess />;
  }

  return <SizesContent permissions={permissions} />;
}

function SizesContent({ permissions }: { permissions: string[] }) {
  const canCreate = hasPermission(permissions, "products.create");
  const canEdit = hasPermission(permissions, "products.edit");
  const canDelete = hasPermission(permissions, "products.delete");
  const sizesQuery = useSizes();
  const deleteSize = useDeleteSize();
  const [sizeToDelete, setSizeToDelete] = useState<AdminSize | null>(null);

  const sizes = sizesQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Sizes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the size options used by product variants, ordered from
            smallest to largest.
          </p>
        </div>
        {canCreate && (
          <Link
            href="/admin/sizes/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="h-4 w-4" />
            New size
          </Link>
        )}
      </div>

      {sizesQuery.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">Unable to load sizes.</p>
          <p className="mt-1 text-muted-foreground">
            {sizesQuery.error instanceof Error
              ? sizesQuery.error.message
              : "Please try again."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => sizesQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      )}

      {sizesQuery.isLoading && (
        <div className="space-y-2 rounded-lg border p-4">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="h-10 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      )}

      {!sizesQuery.isLoading && !sizesQuery.isError && sizes.length === 0 && (
        <div className="rounded-lg border p-10 text-center">
          <Ruler className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium">No sizes yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a size before creating product variants.
          </p>
          {canCreate && (
            <Link
              href="/admin/sizes/new"
              className={buttonVariants({ size: "sm", className: "mt-5" })}
            >
              <Plus className="h-4 w-4" />
              New size
            </Link>
          )}
        </div>
      )}

      {sizes.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">Sort order</th>
                <th className="px-4 py-3 font-medium">Variants</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sizes.map((size) => {
                const variantCount = size.product_variants_count ?? 0;

                return (
                  <tr key={size.id}>
                    <td className="px-4 py-3 font-medium">{size.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {size.sort_order}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {variantCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {canEdit && (
                          <Link
                            href={`/admin/sizes/${size.id}/edit`}
                            className={buttonVariants({
                              variant: "outline",
                              size: "sm",
                            })}
                          >
                            Edit
                          </Link>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => setSizeToDelete(size)}
                            disabled={variantCount > 0}
                            title={
                              variantCount > 0
                                ? "This size is used by product variants."
                                : undefined
                            }
                          >
                            Delete
                          </Button>
                        )}
                        {!canEdit && !canDelete && (
                          <span className="text-xs text-muted-foreground">
                            View only
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={sizeToDelete !== null}
        title="Delete size"
        description={
          sizeToDelete
            ? `Delete "${sizeToDelete.name}"? Sizes used by product variants cannot be deleted.`
            : ""
        }
        confirmLabel="Delete size"
        isPending={deleteSize.isPending}
        onConfirm={() => {
          if (!sizeToDelete) return;

          deleteSize.mutate(sizeToDelete.id, {
            onSuccess: () => setSizeToDelete(null),
            onError: () => setSizeToDelete(null),
          });
        }}
        onCancel={() => setSizeToDelete(null)}
      />
    </div>
  );
}
