"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminCategory } from "@/features/admin-categories/types/admin-category.types";
import { flattenCategoryTree } from "@/features/admin-categories/lib/category-tree";
import type { AdminColor } from "@/features/admin-colors/types/admin-color.types";
import type { AdminSize } from "@/features/admin-sizes/types/admin-size.types";
import {
  productFormSchema,
  type ProductFormValues,
} from "../schemas/admin-product.schema";
import {
  emptyProductFormValues,
  formValuesToPayload,
  productToFormValues,
} from "../lib/admin-product-utils";
import type {
  AdminProduct,
  ImageReorder,
  ProductPayload,
} from "../types/admin-product.types";
import { ProductImageManager } from "./product-image-manager";
import { VariantEditor } from "./variant-editor";

interface ProductFormProps {
  categories: AdminCategory[];
  colors: AdminColor[];
  sizes: AdminSize[];
  product?: AdminProduct;
  submitLabel: string;
  isSubmitting: boolean;
  imageActionPending?: boolean;
  serverErrors?: Record<string, string[]>;
  onDeleteExistingImage?: (imageId: number) => void;
  onSetPrimaryImage?: (imageId: number) => void;
  onReorderImages?: (images: ImageReorder[]) => void;
  onSubmit: (
    payload: ProductPayload,
    newImages: File[],
    primaryIndex: number | null
  ) => void;
}

export function ProductForm({
  categories,
  colors,
  sizes,
  product,
  submitLabel,
  isSubmitting,
  imageActionPending = false,
  serverErrors,
  onDeleteExistingImage,
  onSetPrimaryImage,
  onReorderImages,
  onSubmit,
}: ProductFormProps) {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [primaryNewIndex, setPrimaryNewIndex] = useState<number | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? productToFormValues(product)
      : emptyProductFormValues(),
  });

  const existingImages = product?.images ?? [];

  useEffect(() => {
    if (!serverErrors) return;

    Object.entries(serverErrors).forEach(([field, messages]) => {
      const message = messages?.[0];

      if (!message || field.startsWith("images")) return;

      const mapped = field.replace(
        /^variants\.(\d+)\.id$/,
        "variants.$1.variant_id"
      );

      form.setError(mapped as FieldPath<ProductFormValues>, {
        type: "server",
        message,
      });
    });
  }, [serverErrors, form]);

  function handleNewImagesChange(files: File[]) {
    setNewImages(files);
    setPrimaryNewIndex((current) => {
      if (files.length === 0) return null;
      if (current !== null && current >= files.length) return 0;
      if (current === null && existingImages.length === 0) return 0;

      return current;
    });
  }

  const categoryOptions = flattenCategoryTree(categories);

  const submit = form.handleSubmit((values) => {
    onSubmit(formValuesToPayload(values), newImages, primaryNewIndex);
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={submit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product details</CardTitle>
            <CardDescription>
              The storefront slug is generated from the name and updates when
              the name changes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product name</Label>
              <Input
                id="name"
                placeholder="e.g. Classic Cotton Crew Neck"
                {...form.register("name")}
                disabled={isSubmitting}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <select
                id="category_id"
                className="h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
                {...form.register("category_id")}
                disabled={isSubmitting}
              >
                <option value="">Choose a category</option>
                {categoryOptions.map(({ category, depth }) => (
                  <option key={category.id} value={String(category.id)}>
                    {`${"— ".repeat(depth)}${category.name}${
                      category.is_active ? "" : " (inactive)"
                    }`}
                  </option>
                ))}
              </select>
              {form.formState.errors.category_id && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.category_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={6}
                placeholder="Describe the fit, fabric, and care instructions."
                className="w-full rounded-2xl border border-input bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
                {...form.register("description")}
                disabled={isSubmitting}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="regular_price">Regular price</Label>
                <Input
                  id="regular_price"
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  {...form.register("regular_price")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.regular_price && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.regular_price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount_price">Discount price</Label>
                <Input
                  id="discount_price"
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  placeholder="Optional"
                  {...form.register("discount_price")}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank for no product-level discount.
                </p>
                {form.formState.errors.discount_price && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.discount_price.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border p-4">
              <input
                id="is_active"
                type="checkbox"
                className="mt-0.5 size-4 accent-primary"
                {...form.register("is_active")}
                disabled={isSubmitting}
              />
              <div>
                <Label htmlFor="is_active">Active</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Active products are visible on the storefront.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <ProductImageManager
              existingImages={existingImages}
              newImages={newImages}
              primaryNewIndex={primaryNewIndex}
              disabled={isSubmitting}
              isBusy={imageActionPending}
              serverError={
                serverErrors?.images?.[0] ??
                serverErrors?.["images.0"]?.[0] ??
                null
              }
              onNewImagesChange={handleNewImagesChange}
              onPrimaryNewIndexChange={setPrimaryNewIndex}
              onDeleteExisting={onDeleteExistingImage}
              onSetPrimaryExisting={onSetPrimaryImage}
              onReorderImages={onReorderImages}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <VariantEditor
              colors={colors}
              sizes={sizes}
              disabled={isSubmitting}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/admin/products" />}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
