"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { useCategories } from "@/features/admin-categories/hooks/use-admin-categories";
import { ProductFilters } from "@/features/admin-products/components/product-filters";
import { ProductTable } from "@/features/admin-products/components/product-table";
import {
  useAdminProducts,
  useDeleteProduct,
  useUpdateProductStatus,
} from "@/features/admin-products/hooks/use-admin-products";
import type { AdminProduct } from "@/features/admin-products/types/admin-product.types";

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={<div className="h-72 animate-pulse rounded-lg bg-muted" />}
    >
      <ProductsGate />
    </Suspense>
  );
}

function ProductsGate() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "products.view")) {
    return <NoAccess />;
  }

  return <ProductsContent permissions={permissions} />;
}

function ProductsContent({ permissions }: { permissions: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(
    null
  );

  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("category_id") ?? "";
  const isActive = searchParams.get("is_active") ?? "";

  const queryParams = useMemo(
    () => ({
      page,
      per_page: 15,
      search: search || undefined,
      category_id: categoryId ? Number(categoryId) : undefined,
      is_active:
        isActive === "1" ? (1 as const) : isActive === "0" ? (0 as const) : undefined,
    }),
    [page, search, categoryId, isActive]
  );

  const productsQuery = useAdminProducts(queryParams);
  const categoriesQuery = useCategories();
  const deleteProduct = useDeleteProduct();
  const updateStatus = useUpdateProductStatus();

  const canCreate = hasPermission(permissions, "products.create");
  const canEdit = hasPermission(permissions, "products.edit");
  const canDelete = hasPermission(permissions, "products.delete");
  const hasFilters = Boolean(search || categoryId || isActive);

  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  const meta = productsQuery.data?.meta;
  const products = productsQuery.data?.data ?? [];
  const togglingProductId = updateStatus.isPending
    ? (updateStatus.variables?.productId ?? null)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the catalog, variants, inventory, and product imagery.
          </p>
        </div>
        {canCreate && (
          <Link
            href="/admin/products/new"
            className={buttonVariants({ variant: "default" })}
          >
            <Plus className="h-4 w-4" />
            New product
          </Link>
        )}
      </div>

      <ProductFilters
        initialSearch={search}
        categoryId={categoryId}
        isActive={isActive}
        categories={categoriesQuery.data ?? []}
        hasFilters={hasFilters}
        onSearchSubmit={(value) =>
          updateParams({ search: value || undefined, page: undefined })
        }
        onCategoryChange={(value) =>
          updateParams({ category_id: value || undefined, page: undefined })
        }
        onStatusChange={(value) =>
          updateParams({ is_active: value || undefined, page: undefined })
        }
        onClear={() => router.replace(pathname, { scroll: false })}
      />

      {productsQuery.isLoading ? (
        <div className="h-72 animate-pulse rounded-lg bg-muted" />
      ) : productsQuery.isError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
          <p className="font-medium">Products could not be loaded</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check the API connection and try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => productsQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <ProductTable
            products={products}
            canCreate={canCreate}
            canEdit={canEdit}
            canDelete={canDelete}
            togglingProductId={togglingProductId}
            onDelete={setProductToDelete}
            onToggleStatus={(product) =>
              updateStatus.mutate({
                productId: product.id,
                isActive: !product.is_active,
              })
            }
          />

          {meta && meta.total > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Showing {meta.from ?? 0}–{meta.to ?? 0} of {meta.total} products
                {productsQuery.isFetching && (
                  <span className="ml-2 text-xs">Updating…</span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateParams({ page: String(page - 1) })}
                  disabled={page <= 1 || productsQuery.isFetching}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateParams({ page: String(page + 1) })}
                  disabled={
                    page >= meta.last_page || productsQuery.isFetching
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={productToDelete !== null}
        title="Delete product"
        description={`Delete “${productToDelete?.name ?? ""}”? Variants and images are removed with it. Existing order items keep their saved product snapshots.`}
        confirmLabel="Delete product"
        isPending={deleteProduct.isPending}
        onCancel={() => setProductToDelete(null)}
        onConfirm={() => {
          if (!productToDelete) return;

          deleteProduct.mutate(productToDelete.id, {
            onSuccess: () => setProductToDelete(null),
          });
        }}
      />
    </div>
  );
}
