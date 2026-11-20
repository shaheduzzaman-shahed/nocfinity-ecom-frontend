"use client";

import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { formatCurrency, formatDate } from "@/lib/format";
import type { AdminProduct } from "../types/admin-product.types";

interface ProductTableProps {
  products: AdminProduct[];
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  togglingProductId: number | null;
  onDelete: (product: AdminProduct) => void;
  onToggleStatus: (product: AdminProduct) => void;
}

export function ProductTable({
  products,
  canCreate,
  canEdit,
  canDelete,
  togglingProductId,
  onDelete,
  onToggleStatus,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Plus className="h-5 w-5 text-muted-foreground" />
        </div>
        <h2 className="mt-4 font-heading text-lg font-semibold">
          No products found
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Adjust the filters or add a new product to start building the
          catalog.
        </p>
        {canCreate && (
          <Link
            href="/admin/products/new"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            Add product
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[1080px] text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">SKU</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((product) => {
            const hasDiscount =
              product.discount_price !== null ||
              product.effective_price !== product.regular_price;

            return (
              <tr key={product.id} className="align-middle">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-13 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {product.primary_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.primary_image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs font-semibold text-muted-foreground">
                          {product.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        /{product.slug}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.variants_count ?? product.variants.length}{" "}
                        variant
                        {(product.variants_count ?? product.variants.length) ===
                        1
                          ? ""
                          : "s"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {product.sku ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.category?.name ?? "Uncategorized"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {formatCurrency(product.effective_price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatCurrency(product.regular_price)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      product.stock > 0
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {canEdit ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(product)}
                      disabled={togglingProductId === product.id}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        product.is_active
                          ? "text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </Button>
                  ) : (
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        product.is_active
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(product.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {canEdit ? (
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        View only
                      </span>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => onDelete(product)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
