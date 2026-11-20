"use client";

import { useState } from "react";
import Link from "next/link";
import { Palette, Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import {
  useColors,
  useDeleteColor,
} from "@/features/admin-colors/hooks/use-admin-colors";
import type { AdminColor } from "@/features/admin-colors/types/admin-color.types";

export default function AdminColorsPage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "products.view")) {
    return <NoAccess />;
  }

  return <ColorsContent permissions={permissions} />;
}

function ColorsContent({ permissions }: { permissions: string[] }) {
  const canCreate = hasPermission(permissions, "products.create");
  const canEdit = hasPermission(permissions, "products.edit");
  const canDelete = hasPermission(permissions, "products.delete");
  const colorsQuery = useColors();
  const deleteColor = useDeleteColor();
  const [colorToDelete, setColorToDelete] = useState<AdminColor | null>(null);

  const colors = colorsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Colors</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the color options used by product variants and storefront
            swatches.
          </p>
        </div>
        {canCreate && (
          <Link
            href="/admin/colors/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="h-4 w-4" />
            New color
          </Link>
        )}
      </div>

      {colorsQuery.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">Unable to load colors.</p>
          <p className="mt-1 text-muted-foreground">
            {colorsQuery.error instanceof Error
              ? colorsQuery.error.message
              : "Please try again."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => colorsQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      )}

      {colorsQuery.isLoading && (
        <div className="space-y-2 rounded-lg border p-4">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="h-10 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      )}

      {!colorsQuery.isLoading &&
        !colorsQuery.isError &&
        colors.length === 0 && (
          <div className="rounded-lg border p-10 text-center">
            <Palette className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No colors yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a color before creating product variants.
            </p>
            {canCreate && (
              <Link
                href="/admin/colors/new"
                className={buttonVariants({ size: "sm", className: "mt-5" })}
              >
                <Plus className="h-4 w-4" />
                New color
              </Link>
            )}
          </div>
        )}

      {colors.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Color</th>
                <th className="px-4 py-3 font-medium">Hex</th>
                <th className="px-4 py-3 font-medium">Variants</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {colors.map((color) => {
                const variantCount = color.product_variants_count ?? 0;

                return (
                  <tr key={color.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className="size-7 shrink-0 rounded-full border bg-muted"
                          style={
                            color.hex_code
                              ? { backgroundColor: color.hex_code }
                              : undefined
                          }
                        />
                        <span className="font-medium">{color.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {color.hex_code ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {variantCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {canEdit && (
                          <Link
                            href={`/admin/colors/${color.id}/edit`}
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
                            onClick={() => setColorToDelete(color)}
                            disabled={variantCount > 0}
                            title={
                              variantCount > 0
                                ? "This color is used by product variants."
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
        open={colorToDelete !== null}
        title="Delete color"
        description={
          colorToDelete
            ? `Delete "${colorToDelete.name}"? Colors used by product variants cannot be deleted.`
            : ""
        }
        confirmLabel="Delete color"
        isPending={deleteColor.isPending}
        onConfirm={() => {
          if (!colorToDelete) return;

          deleteColor.mutate(colorToDelete.id, {
            onSuccess: () => setColorToDelete(null),
            onError: () => setColorToDelete(null),
          });
        }}
        onCancel={() => setColorToDelete(null)}
      />
    </div>
  );
}
