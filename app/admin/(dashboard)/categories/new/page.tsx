"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { CategoryForm } from "@/features/admin-categories/components/category-form";
import {
  useCategories,
  useCreateCategory,
} from "@/features/admin-categories/hooks/use-admin-categories";
import { ApiError } from "@/lib/api/error";

export default function NewAdminCategoryPage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "categories.manage")) {
    return (
      <NoAccess message="You need the categories.manage permission to create categories." />
    );
  }

  return <NewCategoryContent />;
}

function NewCategoryContent() {
  const router = useRouter();
  const categoriesQuery = useCategories();
  const createCategory = useCreateCategory();

  const serverErrors =
    createCategory.error instanceof ApiError
      ? createCategory.error.errors
      : undefined;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to categories
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-bold">
          Create category
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a category and optionally nest it under an existing one.
        </p>
      </div>

      {categoriesQuery.isLoading && (
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      )}

      {categoriesQuery.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">
            Unable to load parent categories.
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

      {categoriesQuery.data && (
        <CategoryForm
          categories={categoriesQuery.data}
          submitLabel="Create category"
          isSubmitting={createCategory.isPending}
          serverErrors={serverErrors}
          onSubmit={(payload) =>
            createCategory.mutate(payload, {
              onSuccess: () => router.push("/admin/categories"),
            })
          }
        />
      )}
    </div>
  );
}
