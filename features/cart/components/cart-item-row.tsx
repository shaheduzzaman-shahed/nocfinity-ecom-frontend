"use client";

import Link from "next/link";
import { AlertCircle, Minus, Plus, Trash2 } from "lucide-react";
import type { CartItemData } from "../types/cart.types";
import { formatCurrency } from "@/lib/format";
import { useRemoveCartItem, useUpdateCartItem } from "../hooks/use-cart";

export function CartItemRow({
  item,
  currency = "USD",
}: {
  item: CartItemData;
  currency?: string;
}) {
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();

  const isUpdating = updateMutation.isPending;
  const isRemoving = removeMutation.isPending;

  function handleDecrement() {
    if (item.quantity <= 1) {
      removeMutation.mutate({
        itemId: item.id,
        variantId: item.product_variant_id,
      });
      return;
    }
    updateMutation.mutate({
      itemId: item.id,
      variantId: item.product_variant_id,
      quantity: item.quantity - 1,
    });
  }

  function handleIncrement() {
    if (item.quantity >= item.stock) {
      return;
    }
    updateMutation.mutate({
      itemId: item.id,
      variantId: item.product_variant_id,
      quantity: item.quantity + 1,
    });
  }

  function handleRemove() {
    removeMutation.mutate({
      itemId: item.id,
      variantId: item.product_variant_id,
    });
  }

  const productHref = item.product_id
    ? `/products/${item.product_id}`
    : "#";

  return (
    <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between border-b last:border-b-0">
      {/* Left: Product Thumbnail & Info */}
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        <Link
          href={productHref}
          className="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-xl border bg-muted"
        >
          {item.primary_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.primary_image}
              alt={item.product_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-semibold text-muted-foreground">
              {item.product_name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </Link>

        {/* Details */}
        <div className="space-y-1 min-w-0">
          <Link
            href={productHref}
            className="font-heading text-sm font-semibold text-foreground hover:underline line-clamp-1"
          >
            {item.product_name}
          </Link>

          {/* Color & Size */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {item.color && (
              <span className="inline-flex items-center gap-1">
                <span
                  className="size-2 rounded-full border"
                  style={{ backgroundColor: item.color.hex_code ?? "#999" }}
                />
                {item.color.name}
              </span>
            )}
            {item.color && item.size && <span>•</span>}
            {item.size && <span>Size: {item.size.name}</span>}
          </div>

          {/* SKU */}
          {item.sku && (
            <p className="font-mono text-[11px] text-muted-foreground/70">
              SKU: {item.sku}
            </p>
          )}

          {/* Stock warnings */}
          {!item.in_stock && (
            <div className="flex items-center gap-1 text-xs text-destructive pt-1">
              <AlertCircle className="h-3 w-3" />
              <span>Out of stock</span>
            </div>
          )}

          {item.in_stock && !item.is_sufficient_stock && (
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 pt-1">
              <AlertCircle className="h-3 w-3" />
              <span>Only {item.stock} left in stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Quantity Controls, Subtotal & Remove Action */}
      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 pt-2 sm:pt-0">
        {/* Quantity Controls */}
        <div className="flex items-center rounded-full border bg-muted/30">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={isUpdating || isRemoving}
            className="flex size-8 items-center justify-center rounded-l-full hover:bg-muted disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-8 text-center text-xs font-semibold">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={isUpdating || isRemoving || item.quantity >= item.stock}
            className="flex size-8 items-center justify-center rounded-r-full hover:bg-muted disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Pricing */}
        <div className="text-right min-w-20">
          <p className="font-heading text-sm font-bold">
            {formatCurrency(item.line_subtotal, currency)}
          </p>
          {item.has_discount && (
            <p className="text-[11px] text-muted-foreground line-through">
              {formatCurrency(item.regular_price * item.quantity, currency)}
            </p>
          )}
          <p className="text-[10px] text-muted-foreground">
            {formatCurrency(item.unit_price, currency)} each
          </p>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
          aria-label="Remove item"
          title="Remove item"
          className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
