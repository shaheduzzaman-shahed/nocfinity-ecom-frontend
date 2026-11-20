"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderTree, Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { CategoryTreeTable } from "@/features/admin-categories/components/category-tree-table";
import {
  useCategories,
  useDeleteCategory,
  useUpdateCategoryStatus,
} from "@/features/admin-categories/hooks/use-admin-categories";
import { flattenCategoryTree } from "@/features/admin-categories/lib/category-tree";
import type { AdminCategory } from "@/features/admin-categories/types/admin-category.types";

export default function AdminCategoriesPage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "categories.view")) {
    return <NoAccess />;
  }

  return <CategoriesContent permissions={permissions} />;
}

function CategoriesContent({ permissions }: { permissions: string[] }) {
  const canManage = hasPermission(permissions, "categories.manage");
  const categoriesQuery = useCategories();
  const deleteCategory = useDeleteCategory();
  const updateStatus = useUpdateCategoryStatus();
  const [categoryToDelete, setCategoryToDelete] =
    useState<AdminCategory | null>(null);

  const categories = categoriesQuery.data ?? [];
  const rows = flattenCategoryTree(categories);
  const activeCount = rows.filter(({ category }) => category.is_active).length;
  const togglingCategoryId =
    updateStatus.isPending && updateStatus.variables
      ? updateStatus.variables.categoryId
      : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organise the catalog into a browsable hierarchy for the storefront.
          </p>
        </div>
        {canManage && (
          <Link
            href="/admin/categories/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="h-4 w-4" />
            New category
          </Link>
        )}
      </div>

      {categoriesQuery.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">
            Unable to load categories.
          </p>
          <p className="mt-1 text-muted-foreground">
            {categoriesQuery.error instanceof Error
              ? categoriesQuery.error.message
              : "Please try again."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => categoriesQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      )}

      {categoriesQuery.isLoading && (
        <div className="space-y-2 rounded-lg border p-4">
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              className="h-10 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      )}

      {!categoriesQuery.isLoading &&
        !categoriesQuery.isError &&
        categories.length === 0 && (
          <div className="rounded-lg border p-10 text-center">
            <FolderTree className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No categories yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a top-level category to start building the catalog.
            </p>
            {canManage && (
              <Link
                href="/admin/categories/new"
                className={buttonVariants({ size: "sm", className: "mt-5" })}
              >
                <Plus className="h-4 w-4" />
                New category
              </Link>
            )}
          </div>
        )}

      {categories.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? "category" : "categories"} ·{" "}
            {activeCount} active
          </p>
          <CategoryTreeTable
            categories={categories}
            canManage={canManage}
            togglingCategoryId={togglingCategoryId}
            onDelete={setCategoryToDelete}
            onToggleStatus={(category) =>
              updateStatus.mutate({
                categoryId: category.id,
                isActive: !category.is_active,
              })
            }
          />
        </>
      )}

      <ConfirmDialog
        open={categoryToDelete !== null}
        title="Delete category"
        description={
          categoryToDelete
            ? `Delete "${categoryToDelete.name}"? Its subcategories will become top-level categories. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete category"
        isPending={deleteCategory.isPending}
        onConfirm={() => {
          if (!categoryToDelete) return;

          deleteCategory.mutate(categoryToDelete.id, {
            onSuccess: () => setCategoryToDelete(null),
            onError: () => setCategoryToDelete(null),
          });
        }}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
