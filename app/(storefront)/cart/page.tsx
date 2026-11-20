"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, ChevronRight, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, useClearCart } from "@/features/cart/hooks/use-cart";
import { CartItemRow } from "@/features/cart/components/cart-item-row";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { buttonVariants } from "@/components/ui/button";

export default function CartPage() {
  const { cart, isLoading } = useCart();
  const clearCartMutation = useClearCart();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-6 w-32 bg-muted animate-pulse rounded-md" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <div className="h-28 bg-muted animate-pulse rounded-2xl" />
            <div className="h-28 bg-muted animate-pulse rounded-2xl" />
          </div>
          <div className="h-72 bg-muted animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const isEmpty = items.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span aria-current="page" className="font-medium text-foreground">
          Shopping Bag
        </span>
      </nav>

      {/* Page Title */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Shopping Bag
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEmpty
              ? "Your bag is empty."
              : `Review your selections (${cart?.total_quantity ?? 0} ${
                  (cart?.total_quantity ?? 0) === 1 ? "item" : "items"
                })`}
          </p>
        </div>

        {!isEmpty && (
          <button
            type="button"
            disabled={clearCartMutation.isPending}
            onClick={() => clearCartMutation.mutate()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear bag
          </button>
        )}
      </div>

      {/* Cart Warnings if any returned by backend */}
      {cart?.warnings && cart.warnings.length > 0 && (
        <div className="mt-6 space-y-2">
          {cart.warnings.map((warning, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Cart Content */}
      {isEmpty ? (
        <div className="mt-12 rounded-[2.5rem] border border-dashed p-12 text-center sm:p-16">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="mt-5 font-heading text-2xl font-bold tracking-tight">
            Your bag is empty
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Looks like you haven&apos;t added any pieces yet. Explore our latest
            arrivals and timeless wardrobe essentials.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className={buttonVariants({
                size: "lg",
                className: "rounded-full inline-flex items-center gap-2",
              })}
            >
              Explore collections
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-12">
          {/* Left Column: Line Items */}
          <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
            <div className="divide-y">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  currency={cart?.summary.currency}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          {cart && (
            <div className="sticky top-24">
              <CartSummary
                summary={cart.summary}
                disabled={items.some((i) => !i.in_stock)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
