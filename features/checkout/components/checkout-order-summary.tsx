"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Lock,
  Package,
  ShoppingBag,
  Tag,
  TicketPercent,
} from "lucide-react";
import type { CartItemData } from "@/features/cart/types/cart.types";
import type {
  CheckoutCouponData,
  CheckoutFinancialSummary,
} from "../types/checkout.types";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface CheckoutOrderSummaryProps {
  items: CartItemData[];
  summary: CheckoutFinancialSummary;
  coupon?: CheckoutCouponData | null;
  isLoading?: boolean;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onPlaceOrder: () => void;
  canPlaceOrder?: boolean;
}

export function CheckoutOrderSummary({
  items,
  summary,
  coupon,
  isLoading,
  isSubmitting,
  errorMessage,
  onPlaceOrder,
  canPlaceOrder = true,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="font-heading text-lg font-bold tracking-tight">
          Order Summary
        </h2>
        <span className="text-xs text-muted-foreground font-medium">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Items preview list */}
      <div className="max-h-72 overflow-y-auto space-y-3.5 pr-1 divide-y divide-border/60">
        {items.map((item) => {
          const imageUrl = item.primary_image ?? (item as any).image_url;

          return (
            <div key={item.id} className="flex gap-3.5 pt-3.5 first:pt-0">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border bg-muted/40">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={item.product_name}
                    className="size-full object-cover object-center"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground/40">
                    <Package className="h-6 w-6" />
                  </div>
                )}
              </div>

            <div className="flex flex-1 flex-col justify-between text-xs">
              <div>
                <p className="font-semibold text-foreground line-clamp-1">
                  {item.product_name}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-muted-foreground">
                  {item.color?.name && <span>{item.color.name}</span>}
                  {item.color?.name && item.size?.name && <span>•</span>}
                  {item.size?.name && <span>Size {item.size.name}</span>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 font-medium">
                <span className="text-muted-foreground">Qty: {item.quantity}</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(item.line_subtotal, summary.currency)}
                </span>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Breakdown */}
      <div className="space-y-3.5 border-t pt-5 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-medium text-foreground">
            {formatCurrency(summary.subtotal, summary.currency)}
          </span>
        </div>

        {summary.product_discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span>Product Discounts</span>
            <span className="font-medium">
              -{formatCurrency(summary.product_discount, summary.currency)}
            </span>
          </div>
        )}

        {summary.coupon_discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5">
              <TicketPercent className="h-4 w-4" />
              <span>Coupon ({coupon?.code ?? "Promo"})</span>
            </span>
            <span className="font-medium">
              -{formatCurrency(summary.coupon_discount, summary.currency)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-muted-foreground">
          <span>Shipping</span>
          <span className="font-medium text-foreground">
            {summary.shipping_charge > 0
              ? formatCurrency(summary.shipping_charge, summary.currency)
              : "Complimentary"}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t pt-4">
        <div className="flex items-baseline justify-between">
          <span className="font-heading text-base font-semibold">Total</span>
          <div className="text-right">
            <span className="font-heading text-2xl font-bold tracking-tight">
              {formatCurrency(summary.final_total, summary.currency)}
            </span>
            <p className="text-[11px] text-muted-foreground">
              Includes applicable taxes & shipping snapshot
            </p>
          </div>
        </div>
      </div>

      {/* Validation Error Alert */}
      {errorMessage && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Place Order CTA */}
      <div className="space-y-3 pt-2">
        <Button
          type="button"
          onClick={onPlaceOrder}
          disabled={!canPlaceOrder || isSubmitting || isLoading}
          className="h-12 w-full rounded-full text-sm font-semibold tracking-wide"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Order...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Place Order ({formatCurrency(summary.final_total, summary.currency)})
            </>
          )}
        </Button>

        <p className="text-center text-[11px] text-muted-foreground">
          By placing your order, you agree to our Terms of Service and Return Policy.
        </p>
      </div>
    </div>
  );
}
