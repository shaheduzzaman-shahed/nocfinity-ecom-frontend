"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { useCategories } from "@/features/admin-categories/hooks/use-admin-categories";
import { useColors } from "@/features/admin-colors/hooks/use-admin-colors";
import { useSizes } from "@/features/admin-sizes/hooks/use-admin-sizes";
import { ProductForm } from "@/features/admin-products/components/product-form";
import {
  useAdminProduct,
  useDeleteProductImage,
  useReorderProductImages,
  useUpdateProduct,
  useUpdateProductImage,
} from "@/features/admin-products/hooks/use-admin-products";
import { ApiError } from "@/lib/api/error";

export default function EditAdminProductPage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "products.view")) {
    return <NoAccess />;
  }

  if (!hasPermission(permissions, "products.edit")) {
    return (
      <NoAccess message="You need the products.edit permission to change products." />
    );
  }

  return <EditProductContent />;
}

function EditProductContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = Number(params.id);
  const validProductId = Number.isInteger(productId) && productId > 0;
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

  const productQuery = useAdminProduct(validProductId ? productId : null);
  const categoriesQuery = useCategories();
  const colorsQuery = useColors();
  const sizesQuery = useSizes();
  const updateProduct = useUpdateProduct(productId);
  const updateImage = useUpdateProductImage(productId);
  const deleteImage = useDeleteProductImage(productId);
  const reorderImages = useReorderProductImages(productId);

  const product = productQuery.data;
  const isLoading =
    productQuery.isLoading ||
    categoriesQuery.isLoading ||
    colorsQuery.isLoading ||
    sizesQuery.isLoading;
  const isError =
    productQuery.isError ||
    categoriesQuery.isError ||
    colorsQuery.isError ||
    sizesQuery.isError;

  const serverErrors =
    updateProduct.error instanceof ApiError
      ? updateProduct.error.errors
      : undefined;

  if (!validProductId) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="font-medium">Product not found</p>
        <Link
          href="/admin/products"
          className="mt-3 inline-block text-sm underline"
        >
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
          <h1 className="mt-2 font-heading text-2xl font-bold">
            Edit product
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {product
              ? `${product.name} · /${product.slug}`
              : "Update product details, imagery, and variants."}
          </p>
        </div>

        {product?.is_active && (
          <Link
            href={`/products/${product.id}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            View on storefront
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {isLoading && (
        <div className="h-72 animate-pulse rounded-lg bg-muted" />
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <p className="font-medium text-destructive">
            Unable to load this product.
          </p>
          <p className="mt-1 text-muted-foreground">
            Confirm the product still exists and that categories, colors, and
            sizes are available.
          </p>
        </div>
      )}

      {product && !isLoading && !isError && (
        <ProductForm
          key={product.id}
          product={product}
          categories={categoriesQuery.data ?? []}
          colors={colorsQuery.data ?? []}
          sizes={sizesQuery.data ?? []}
          submitLabel="Save changes"
          isSubmitting={updateProduct.isPending}
          imageActionPending={
            updateImage.isPending ||
            deleteImage.isPending ||
            reorderImages.isPending
          }
          serverErrors={serverErrors}
          onDeleteExistingImage={setImageToDelete}
          onSetPrimaryImage={(imageId) =>
            updateImage.mutate({
              imageId,
              data: { is_primary: true },
            })
          }
          onReorderImages={(images) => reorderImages.mutate(images)}
          onSubmit={(payload, images, primaryIndex) => {
            updateProduct.mutate(
              { payload, images, primaryIndex },
              {
                onSuccess: () => router.push("/admin/products"),
              }
            );
          }}
        />
      )}

      <ConfirmDialog
        open={imageToDelete !== null}
        title="Delete image"
        description="Remove this image from the product? The file is deleted from storage and cannot be recovered."
        confirmLabel="Delete image"
        isPending={deleteImage.isPending}
        onCancel={() => setImageToDelete(null)}
        onConfirm={() => {
          if (imageToDelete === null) return;

          deleteImage.mutate(imageToDelete, {
            onSuccess: () => setImageToDelete(null),
          });
        }}
      />
    </div>
  );
}
