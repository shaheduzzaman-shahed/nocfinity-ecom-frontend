"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { cn } from "cn";
import type {
  ProductColorData,
  ProductDetailData,
  ProductSizeData,
} from "../types/product.types";

export function ProductPurchasePanel({
  product,
}: {
  product: ProductDetailData;
}) {
  const variants = product.variants;

  const colors = variants.reduce<ProductColorData[]>((list, variant) => {
    if (variant.color && !list.some((color) => color.id === variant.color?.id)) {
      list.push(variant.color);
    }

    return list;
  }, []);

  const sizes = variants
    .reduce<ProductSizeData[]>((list, variant) => {
      if (variant.size && !list.some((size) => size.id === variant.size?.id)) {
        list.push(variant.size);
      }

      return list;
    }, [])
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));

  const initialVariant = variants.find((variant) => variant.stock > 0) ?? variants[0] ?? null;
  const [colorId, setColorId] = useState<number | null>(
    initialVariant?.color?.id ?? null
  );
  const [sizeId, setSizeId] = useState<number | null>(
    initialVariant?.size?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant =
    variants.find(
      (variant) =>
        variant.color?.id === colorId && variant.size?.id === sizeId
    ) ?? null;
  const selectedColor = colors.find((color) => color.id === colorId) ?? null;
  const stock = selectedVariant?.stock ?? 0;
  const price = selectedVariant?.effective_price ?? product.effective_price;
  const hasDiscount = price < product.regular_price;
  const displayQuantity = Math.min(quantity, Math.max(stock, 1));

  function isColorAvailable(colorIdToCheck: number): boolean {
    return variants.some(
      (variant) =>
        variant.color?.id === colorIdToCheck && variant.stock > 0
    );
  }

  function isSizeAvailable(sizeIdToCheck: number): boolean {
    return variants.some(
      (variant) =>
        variant.color?.id === colorId &&
        variant.size?.id === sizeIdToCheck &&
        variant.stock > 0
    );
  }

  function chooseColor(nextColorId: number) {
    setColorId(nextColorId);
    setQuantity(1);

    const colorVariants = variants.filter(
      (variant) => variant.color?.id === nextColorId
    );
    const currentSizeStillAvailable = colorVariants.find(
      (variant) => variant.size?.id === sizeId && variant.stock > 0
    );

    if (!currentSizeStillAvailable) {
      const nextVariant =
        colorVariants.find((variant) => variant.stock > 0) ?? colorVariants[0];
      setSizeId(nextVariant?.size?.id ?? null);
    }
  }

  const canAddToCart = selectedVariant !== null && stock > 0;
  const buttonLabel = !selectedVariant
    ? "Select options"
    : stock <= 0
      ? "Out of stock"
      : "Add to cart";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-heading text-2xl font-semibold">
            {formatCurrency(price, product.currency)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.regular_price, product.currency)}
            </span>
          )}
          {product.discount_percentage !== null && hasDiscount && (
            <span className="rounded-full bg-foreground px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-background">
              Save {product.discount_percentage}%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Final price is confirmed by the store at checkout.
        </p>
      </div>

      {colors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">
              Color
              {selectedColor && (
                <span className="ml-2 font-normal text-muted-foreground">
                  {selectedColor.name}
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const available = isColorAvailable(color.id);
              const selected = color.id === colorId;

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => chooseColor(color.id)}
                  disabled={!available}
                  aria-label={`${color.name}${available ? "" : " (unavailable)"}`}
                  aria-pressed={selected}
                  title={color.name}
                  className={cn(
                    "relative flex size-9 items-center justify-center rounded-full border-2 transition-all",
                    selected
                      ? "border-foreground ring-2 ring-foreground/20 ring-offset-2"
                      : "border-border hover:border-foreground/50",
                    !available && "cursor-not-allowed opacity-35"
                  )}
                >
                  <span
                    className="size-6 rounded-full border border-black/10"
                    style={{
                      backgroundColor: color.hex_code ?? "#d6d3d1",
                    }}
                  />
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="h-px w-8 rotate-45 bg-foreground/60" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Size</p>
            <p className="text-xs text-muted-foreground">
              Unavailable sizes are crossed out.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {sizes.map((size) => {
              const available = isSizeAvailable(size.id);
              const selected = size.id === sizeId;

              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => {
                    setSizeId(size.id);
                    setQuantity(1);
                  }}
                  disabled={!available}
                  aria-pressed={selected}
                  className={cn(
                    "flex h-11 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                    selected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground",
                    !available &&
                      "cursor-not-allowed border-border/60 text-muted-foreground/50 line-through hover:border-border/60"
                  )}
                >
                  {size.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span
          className={cn(
            "font-medium",
            stock > 0
              ? stock <= 5
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground"
          )}
        >
          {stock > 0
            ? stock <= 5
              ? `Only ${stock} left`
              : "In stock"
            : "Out of stock"}
        </span>
        {!selectedVariant && variants.length > 0 && (
          <span className="text-muted-foreground">
            This color and size combination is unavailable.
          </span>
        )}
        {selectedVariant && (
          <span className="text-xs text-muted-foreground">
            SKU: {selectedVariant.sku}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex h-11 items-center rounded-full border">
          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                Math.max(
                  1,
                  Math.min(current, Math.max(stock, 1)) - 1
                )
              )
            }
            disabled={displayQuantity <= 1 || stock <= 0}
            aria-label="Decrease quantity"
            className="flex h-full w-11 items-center justify-center rounded-l-full transition-colors hover:bg-muted disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-10 text-center text-sm font-medium">
            {displayQuantity}
          </span>
          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                Math.min(
                  Math.max(stock, 1),
                  Math.max(current, 1) + 1
                )
              )
            }
            disabled={displayQuantity >= stock || stock <= 0}
            aria-label="Increase quantity"
            className="flex h-full w-11 items-center justify-center rounded-r-full transition-colors hover:bg-muted disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          type="button"
          size="lg"
          className="h-11 flex-1 rounded-full"
          disabled={!canAddToCart}
          onClick={() => {
            if (!canAddToCart) return;

            toast.info("The shopping bag is coming in the next step.");
          }}
        >
          {buttonLabel}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {variants.length === 0
          ? "This product is not available for purchase yet."
          : "Stock is checked again when the order is placed."}
      </p>
    </div>
  );
}
