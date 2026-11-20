"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { useCategories } from "@/features/admin-categories/hooks/use-admin-categories";
import { useColors } from "@/features/admin-colors/hooks/use-admin-colors";
import { useSizes } from "@/features/admin-sizes/hooks/use-admin-sizes";
import { ProductForm } from "@/features/admin-products/components/product-form";
import { useCreateProduct } from "@/features/admin-products/hooks/use-admin-products";
import { ApiError } from "@/lib/api/error";

export default function NewAdminProductPage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "products.create")) {
    return (
      <NoAccess message="You need the products.create permission to add products." />
    );
  }

  return <NewProductContent />;
}

function NewProductContent() {
  const router = useRouter();
  const categoriesQuery = useCategories();
  const colorsQuery = useColors();
  const sizesQuery = useSizes();
  const createProduct = useCreateProduct();

  const isLoading =
    categoriesQuery.isLoading ||
    colorsQuery.isLoading ||
    sizesQuery.isLoading;
  const isError =
    categoriesQuery.isError || colorsQuery.isError || sizesQuery.isError;

  const serverErrors =
    createProduct.error instanceof ApiError
      ? createProduct.error.errors
      : undefined;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-bold">
          Create product
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add product details, imagery, and every purchasable variant.
        </p>
      </div>

      {isLoading && (
        <div className="h-72 animate-pulse rounded-lg bg-muted" />
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">
            Unable to load product options.
          </p>
          <p className="mt-1 text-muted-foreground">
            Categories, colors, and sizes must load before a product can be
            created. Check the API connection and refresh.
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <ProductForm
          categories={categoriesQuery.data ?? []}
          colors={colorsQuery.data ?? []}
          sizes={sizesQuery.data ?? []}
          submitLabel="Create product"
          isSubmitting={createProduct.isPending}
          serverErrors={serverErrors}
          onSubmit={(payload, images, primaryIndex) => {
            createProduct.mutate(
              { payload, images, primaryIndex },
              {
                onSuccess: () => router.push("/admin/products"),
              }
            );
          }}
        />
      )}
    </div>
  );
}
