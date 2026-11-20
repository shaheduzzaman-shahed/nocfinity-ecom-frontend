"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { CategoryForm } from "@/features/admin-categories/components/category-form";
import {
  useCategories,
  useCategory,
  useUpdateCategory,
} from "@/features/admin-categories/hooks/use-admin-categories";
import { ApiError } from "@/lib/api/error";

export default function EditAdminCategoryPage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "categories.view")) {
    return <NoAccess />;
  }

  return (
    <EditCategoryContent
      canManage={hasPermission(permissions, "categories.manage")}
    />
  );
}

function EditCategoryContent({ canManage }: { canManage: boolean }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const categoryId = Number(params.id);
  const validCategoryId = Number.isInteger(categoryId) ? categoryId : null;

  const categoryQuery = useCategory(validCategoryId);
  const categoriesQuery = useCategories();
  const updateCategory = useUpdateCategory(validCategoryId ?? 0);

  const serverErrors =
    updateCategory.error instanceof ApiError
      ? updateCategory.error.errors
      : undefined;

  const backLink = (
    <Link
      href="/admin/categories"
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to categories
    </Link>
  );

  if (categoryQuery.isLoading || categoriesQuery.isLoading) {
    return (
      <div className="space-y-6">
        {backLink}
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (categoryQuery.isError || !categoryQuery.data) {
    return (
      <div className="space-y-6">
        {backLink}
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">
            Unable to load category.
          </p>
          <p className="mt-1 text-muted-foreground">
            {categoryQuery.error instanceof Error
              ? categoryQuery.error.message
              : "The category may no longer exist."}
          </p>
          <Link
            href="/admin/categories"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "mt-4",
            })}
          >
            Back to categories
          </Link>
        </div>
      </div>
    );
  }

  const category = categoryQuery.data;

  return (
    <div className="space-y-6">
      <div>
        {backLink}
        <h1 className="mt-2 font-heading text-2xl font-bold">{category.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Slug: <span className="font-mono text-xs">/{category.slug}</span>
        </p>
      </div>

      {!canManage ? (
        <NoAccess message="You need the categories.manage permission to edit categories." />
      ) : categoriesQuery.isError || !categoriesQuery.data ? (
        <Card>
          <CardHeader>
            <CardTitle>Unable to load parent categories</CardTitle>
            <CardDescription>
              The parent selector needs the full category tree before this
              category can be edited.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              onClick={() => categoriesQuery.refetch()}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <CategoryForm
          key={category.id}
          categories={categoriesQuery.data}
          excludeCategoryId={category.id}
          defaultValues={{
            name: category.name,
            description: category.description,
            parent_id: category.parent_id,
            is_active: category.is_active,
            sort_order: category.sort_order,
            image: category.image,
          }}
          submitLabel="Save changes"
          isSubmitting={updateCategory.isPending}
          serverErrors={serverErrors}
          onSubmit={(payload) =>
            updateCategory.mutate(payload, {
              onSuccess: () => router.push("/admin/categories"),
            })
          }
        />
      )}
    </div>
  );
}
