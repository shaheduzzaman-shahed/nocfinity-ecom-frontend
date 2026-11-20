"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import type {
  AdminProductImage,
  ImageReorder,
} from "../types/admin-product.types";
import { orderedProductImages } from "../lib/admin-product-utils";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_IMAGES = 8;

interface ProductImageManagerProps {
  existingImages: AdminProductImage[];
  newImages: File[];
  primaryNewIndex: number | null;
  disabled: boolean;
  isBusy?: boolean;
  serverError?: string | null;
  onNewImagesChange: (files: File[]) => void;
  onPrimaryNewIndexChange: (index: number | null) => void;
  onDeleteExisting?: (imageId: number) => void;
  onSetPrimaryExisting?: (imageId: number) => void;
  onReorderImages?: (images: ImageReorder[]) => void;
}

export function ProductImageManager({
  existingImages,
  newImages,
  primaryNewIndex,
  disabled,
  isBusy = false,
  serverError,
  onNewImagesChange,
  onPrimaryNewIndexChange,
  onDeleteExisting,
  onSetPrimaryExisting,
  onReorderImages,
}: ProductImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const orderedExisting = orderedProductImages(existingImages);
  const totalCount = existingImages.length + newImages.length;
  const busy = disabled || isBusy;

  const previews = useMemo(
    () => newImages.map((file) => URL.createObjectURL(file)),
    [newImages]
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    const invalid = files.find(
      (file) =>
        !ACCEPTED_IMAGE_TYPES.includes(file.type) ||
        file.size > MAX_IMAGE_BYTES
    );

    if (invalid) {
      setFileError("Use JPG, PNG, or WebP images up to 4 MB each.");
      return;
    }

    const available = MAX_IMAGES - totalCount;

    if (available <= 0) {
      setFileError(`A product can have at most ${MAX_IMAGES} images.`);
      return;
    }

    if (files.length > available) {
      setFileError(
        `Only ${available} more image${available === 1 ? "" : "s"} can be added.`
      );
    } else {
      setFileError(null);
    }

    onNewImagesChange([...newImages, ...files.slice(0, available)]);
  }

  function removeNewImage(index: number) {
    onNewImagesChange(newImages.filter((_, itemIndex) => itemIndex !== index));

    if (primaryNewIndex === null) return;

    if (primaryNewIndex === index) {
      onPrimaryNewIndexChange(null);
    } else if (primaryNewIndex > index) {
      onPrimaryNewIndexChange(primaryNewIndex - 1);
    }
  }

  function moveExisting(imageId: number, direction: -1 | 1) {
    if (!onReorderImages) return;

    const ordered = [...orderedExisting];
    const index = ordered.findIndex((image) => image.id === imageId);
    const target = index + direction;

    if (index < 0 || target < 0 || target >= ordered.length) return;

    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];

    onReorderImages(
      ordered.map((image, sortOrder) => ({
        id: image.id,
        sort_order: sortOrder,
      }))
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold">Images</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload up to {MAX_IMAGES} images. The primary image is used on
            product cards and as the first gallery image.
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {totalCount} / {MAX_IMAGES}
        </span>
      </div>

      {(orderedExisting.length > 0 || newImages.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {orderedExisting.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "overflow-hidden rounded-2xl border bg-muted",
                image.is_primary && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <div className="relative aspect-[4/5]">
                {image.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No preview
                  </div>
                )}
                {image.is_primary && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                    <Star className="h-3 w-3 fill-current" />
                    Primary
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 p-2">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Move image up"
                    onClick={() => moveExisting(image.id, -1)}
                    disabled={busy || index === 0 || !onReorderImages}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Move image down"
                    onClick={() => moveExisting(image.id, 1)}
                    disabled={
                      busy ||
                      index === orderedExisting.length - 1 ||
                      !onReorderImages
                    }
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  {!image.is_primary && onSetPrimaryExisting && (
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => onSetPrimaryExisting(image.id)}
                      disabled={busy}
                    >
                      Make primary
                    </Button>
                  )}
                  {onDeleteExisting && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete image"
                      onClick={() => onDeleteExisting(image.id)}
                      disabled={busy}
                    >
                      {isBusy ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {newImages.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className={cn(
                "overflow-hidden rounded-2xl border bg-muted",
                primaryNewIndex === index &&
                  "ring-2 ring-primary ring-offset-2"
              )}
            >
              <div className="relative aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previews[index]}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-medium">
                  New
                </span>
                {primaryNewIndex === index && (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                    <Star className="h-3 w-3 fill-current" />
                    Primary
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 p-2">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => onPrimaryNewIndexChange(index)}
                  disabled={busy}
                >
                  {primaryNewIndex === index ? "Primary" : "Make primary"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeNewImage(index)}
                  disabled={busy}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalCount === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
          <ImagePlus className="h-7 w-7 text-muted-foreground" />
          <p className="mt-3 font-medium">No images yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add product photography to make this product ready for the
            storefront.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor="product-images"
          className={buttonVariants({ variant: "outline", size: "sm" })}
          aria-disabled={busy || totalCount >= MAX_IMAGES}
        >
          <ImagePlus className="h-4 w-4" />
          Add images
        </label>
        <input
          ref={fileInputRef}
          id="product-images"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleFiles}
          disabled={busy || totalCount >= MAX_IMAGES}
        />
        <p className="text-xs text-muted-foreground">
          JPG, PNG, or WebP up to 4 MB each.
        </p>
      </div>

      {(fileError || serverError) && (
        <p className="text-sm text-destructive">{fileError ?? serverError}</p>
      )}
    </div>
  );
}
