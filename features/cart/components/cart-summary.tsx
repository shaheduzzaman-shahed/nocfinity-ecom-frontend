"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Loader2,
  Lock,
  ShieldCheck,
  Tag,
  TicketPercent,
  X,
} from "lucide-react";
import type { AppliedCouponData, CartSummaryData } from "../types/cart.types";
import { formatCurrency } from "@/lib/format";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApplyCoupon, useRemoveCoupon } from "../hooks/use-cart";
import { useAuthStore } from "@/stores/auth.store";

export function CartSummary({
  summary,
  coupon,
  disabled = false,
}: {
  summary: CartSummaryData;
  coupon?: AppliedCouponData | null;
  disabled?: boolean;
}) {
  const [couponCode, setCouponCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const applyCouponMutation = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim();
    if (!cleanCode) return;

    setErrorMessage(null);
    applyCouponMutation.mutate(cleanCode.toUpperCase(), {
      onSuccess: () => {
        setCouponCode("");
        setErrorMessage(null);
      },
      onError: (err: any) => {
        setErrorMessage(err.message || "Invalid or ineligible coupon code.");
      },
    });
  };

  const handleRemoveCoupon = () => {
    setErrorMessage(null);
    removeCouponMutation.mutate();
  };

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8 space-y-6">
      <h2 className="font-heading text-lg font-bold tracking-tight">
        Order Summary
      </h2>

      {/* Breakdown */}
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
            <span className="flex items-center gap-1.5">
              <TicketPercent className="h-4 w-4" />
              <span>Coupon Discount</span>
            </span>
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

      {/* Coupon Application / Applied Pill */}
      <div className="border-b pb-6 space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" />
          <span>Promotion Code</span>
        </label>

        {coupon ? (
          <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-sm">
            <div className="flex items-center gap-2">
              <TicketPercent className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="font-semibold text-emerald-950 dark:text-emerald-200 tracking-wider text-xs">
                  {coupon.code}
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  {coupon.type === "percentage"
                    ? `${coupon.value}% off applied`
                    : `${formatCurrency(coupon.value, summary.currency)} off applied`}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={removeCouponMutation.isPending}
              onClick={handleRemoveCoupon}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
              title="Remove coupon"
            >
              {removeCouponMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="PROMOCODE"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                disabled={applyCouponMutation.isPending}
                className="h-10 text-xs uppercase tracking-wider font-mono placeholder:tracking-normal placeholder:font-sans"
              />
              <Button
                type="submit"
                variant="outline"
                disabled={!couponCode.trim() || applyCouponMutation.isPending}
                className="h-10 px-4 text-xs font-semibold shrink-0"
              >
                {applyCouponMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>

            {errorMessage && (
              <p className="text-xs text-destructive font-medium pl-1">
                {errorMessage}
              </p>
            )}

            {mounted && !isAuthenticated && (
              <p className="text-[11px] text-muted-foreground pl-1">
                <Link
                  href="/login?redirect=/cart"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Sign in
                </Link>{" "}
                to redeem member coupons on your order.
              </p>
            )}
          </form>
        )}
      </div>

      {/* Final Total */}
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
