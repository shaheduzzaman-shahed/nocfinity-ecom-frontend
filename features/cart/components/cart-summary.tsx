"use client";

import Link from "next/link";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import type { CartSummaryData } from "../types/cart.types";
import { formatCurrency } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";

export function CartSummary({
  summary,
  disabled = false,
}: {
  summary: CartSummaryData;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8 space-y-6">
      <h2 className="font-heading text-lg font-bold tracking-tight">
        Order Summary
      </h2>

      <div className="space-y-3.5 text-sm border-b pb-6">
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
            <span>Coupon Discount</span>
            <span className="font-medium">
              -{formatCurrency(summary.coupon_discount, summary.currency)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-muted-foreground">
          <span>Estimated Shipping</span>
          <span className="font-medium text-foreground">
            {summary.shipping_estimate > 0
              ? formatCurrency(summary.shipping_estimate, summary.currency)
              : "Complimentary"}
          </span>
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <span className="font-heading text-base font-semibold">Total</span>
        <div className="text-right">
          <span className="font-heading text-2xl font-bold tracking-tight">
            {formatCurrency(summary.final_total, summary.currency)}
          </span>
          <p className="text-[11px] text-muted-foreground">
            Including taxes & delivery charges
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Link
          href={disabled ? "#" : "/checkout"}
          aria-disabled={disabled}
          className={buttonVariants({
            size: "lg",
            className: `h-12 w-full rounded-full text-sm font-semibold tracking-wide ${
              disabled ? "pointer-events-none opacity-50" : ""
            }`,
          })}
        >
          Proceed to Checkout
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          href="/products"
          className="block text-center text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Continue shopping
        </Link>
      </div>

      <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Powered by Stripe Payments</span>
        </div>
      </div>
    </div>
  );
}
