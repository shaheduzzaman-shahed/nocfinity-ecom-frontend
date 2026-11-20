"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categoryParentOptions } from "../lib/category-tree";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "../schemas/admin-category.schema";
import type {
  AdminCategory,
  CategoryPayload,
} from "../types/admin-category.types";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

interface CategoryFormProps {
  categories: AdminCategory[];
  excludeCategoryId?: number | null;
  defaultValues?: {
    name: string;
    description: string | null;
    parent_id: number | null;
    is_active: boolean;
    sort_order: number;
    image: string | null;
  };
  submitLabel: string;
  isSubmitting: boolean;
  serverErrors?: Record<string, string[]>;
  onSubmit: (payload: CategoryPayload) => void;
}

const EMPTY_DEFAULTS = {
  name: "",
  description: null,
  parent_id: null,
  is_active: true,
  sort_order: 0,
  image: null,
};

export function CategoryForm({
  categories,
  excludeCategoryId = null,
  defaultValues = EMPTY_DEFAULTS,
  submitLabel,
  isSubmitting,
  serverErrors,
  onSubmit,
}: CategoryFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultValues.image
  );
  const [fileError, setFileError] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: defaultValues.name,
      description: defaultValues.description ?? "",
      parent_id:
        defaultValues.parent_id === null ? "" : String(defaultValues.parent_id),
      is_active: defaultValues.is_active,
      sort_order: String(defaultValues.sort_order),
    },
  });

  const parentOptions = categoryParentOptions(categories, excludeCategoryId);

  useEffect(() => {
    if (!serverErrors) return;

    const fieldMap: Array<[string, keyof CategoryFormValues]> = [
      ["name", "name"],
      ["description", "description"],
      ["parent_id", "parent_id"],
      ["sort_order", "sort_order"],
    ];

    fieldMap.forEach(([serverField, formField]) => {
      const message = serverErrors[serverField]?.[0];

      if (message) {
        form.setError(formField, { type: "server", message });
      }
    });
  }, [serverErrors, form]);

  const displayedFileError = fileError ?? serverErrors?.image?.[0] ?? null;

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFileError("Use a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setFileError("Image must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }

    setFileError(null);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearSelectedImage() {
    setImageFile(null);
    setFileError(null);
    setPreviewUrl(defaultValues.image);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const submit = form.handleSubmit((values) => {
    onSubmit({
      name: values.name.trim(),
      description: values.description?.trim() || null,
      parent_id: values.parent_id ? Number(values.parent_id) : null,
      is_active: values.is_active,
      sort_order: Number(values.sort_order),
      image: imageFile,
    });
  });

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category details</CardTitle>
          <CardDescription>
            The slug used in storefront URLs is generated from the name
            automatically and updates when the name changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category name</Label>
            <Input
              id="name"
              placeholder="e.g. Outerwear"
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
            <Label htmlFor="parent_id">Parent category</Label>
            <select
              id="parent_id"
              className="h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
              {...form.register("parent_id")}
              disabled={isSubmitting}
            >
              <option value="">No parent (top level)</option>
              {parentOptions.map(({ category, depth }) => (
                <option key={category.id} value={String(category.id)}>
                  {`${"— ".repeat(depth)}${category.name}`}
                </option>
              ))}
            </select>
            {form.formState.errors.parent_id && (
              <p className="text-sm text-destructive">
                {form.formState.errors.parent_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Short promotional copy shown on the storefront."
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Storefront appearance</CardTitle>
          <CardDescription>
            Control visibility, ordering, and the image used in category
            navigation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="image">Category image</Label>
            <div className="overflow-hidden rounded-2xl border bg-muted">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Category preview"
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/9] flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                  <ImagePlus className="h-6 w-6" />
                  No image selected
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="image"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Choose image
              </label>
              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              {imageFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSelectedImage}
                  disabled={isSubmitting}
                >
                  Remove new image
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, or WebP up to 2 MB.
            </p>
            {displayedFileError && (
              <p className="text-sm text-destructive">{displayedFileError}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort order</Label>
              <Input
                id="sort_order"
                type="number"
                min={0}
                inputMode="numeric"
                {...form.register("sort_order")}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first in navigation.
              </p>
              {form.formState.errors.sort_order && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.sort_order.message}
                </p>
              )}
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
                  Active categories appear in storefront navigation and
                  listings.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          render={<Link href="/admin/categories" />}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
