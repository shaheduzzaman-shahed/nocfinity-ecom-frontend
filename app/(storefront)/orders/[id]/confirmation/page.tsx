"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Package,
  ShoppingBag,
  TicketPercent,
  Truck,
} from "lucide-react";
import { useOrderConfirmation } from "@/features/checkout/hooks/use-checkout";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button, buttonVariants } from "@/components/ui/button";

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const { data: order, isLoading, error } = useOrderConfirmation(orderId);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Loading order confirmation details...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Package className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Order Not Found
          </h1>
          <p className="text-sm text-muted-foreground">
            We could not locate this order or you do not have permission to view it.
          </p>
        </div>
        <Link
          href="/products"
          className={buttonVariants({ className: "rounded-full px-8" })}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20 pt-8">
      <div className="container max-w-4xl mx-auto px-4 space-y-8">
        {/* Header Banner */}
        <div className="rounded-3xl border bg-card p-6 sm:p-10 shadow-sm text-center space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Order Confirmed
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your order{" "}
              <span className="font-semibold text-foreground font-mono">
                {order.order_number}
              </span>{" "}
              has been recorded in pending fulfillment.
            </p>
          </div>

          <div className="inline-flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span
              suppressHydrationWarning
              className="rounded-full bg-muted px-3 py-1 font-medium text-foreground"
            >
              Order Date: {order.created_at ? formatDate(order.created_at) : "Today"}
            </span>
            <span className="rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold px-3 py-1 capitalize">
              Status: {order.order_status}
            </span>
            <span className="rounded-full bg-sky-500/10 text-sky-800 dark:text-sky-300 font-semibold px-3 py-1 capitalize">
              Payment: {order.payment_status}
            </span>
          </div>
        </div>

        {/* 2-column info: Shipping & Financials */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Shipping Address Snapshot */}
          <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-3.5">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <MapPin className="h-4 w-4" />
              <span>Shipping Information</span>
            </div>
            <div className="text-xs space-y-1.5 text-muted-foreground leading-relaxed">
              <p className="font-semibold text-sm text-foreground">
                {order.shipping_address.name}
              </p>
              <p>{order.shipping_address.address}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.state}{" "}
                {order.shipping_address.postal_code}
              </p>
              <p>{order.shipping_address.country}</p>
              <p className="pt-1 text-[11px] text-muted-foreground/80">
                Phone: {order.shipping_address.phone} • Email:{" "}
                {order.shipping_address.email}
              </p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-3.5">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Truck className="h-4 w-4" />
              <span>Payment & Summary</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(order.subtotal, order.currency)}
                </span>
              </div>

              {order.product_discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Product Discounts</span>
                  <span className="font-medium">
                    -{formatCurrency(order.product_discount, order.currency)}
                  </span>
                </div>
              )}

              {order.coupon_discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    <TicketPercent className="h-3.5 w-3.5" />
                    <span>Coupon ({order.coupon?.code ?? "Applied"})</span>
                  </span>
                  <span className="font-medium">
                    -{formatCurrency(order.coupon_discount, order.currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-medium text-foreground">
                  {order.shipping_charge > 0
                    ? formatCurrency(order.shipping_charge, order.currency)
                    : "Complimentary"}
                </span>
              </div>

              <div className="border-t pt-2 flex justify-between font-heading text-sm font-bold text-foreground">
                <span>Total Paid</span>
                <span className="text-base text-primary">
                  {formatCurrency(order.final_total, order.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Items Table */}
        <div className="rounded-3xl border bg-card p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-heading text-lg font-bold tracking-tight border-b pb-4">
            Items in this Order ({order.items?.length ?? 0})
          </h2>

          <div className="divide-y divide-border/60">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 text-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border bg-muted/40">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="size-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground/40">
                        <Package className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm line-clamp-1">
                      {item.product_name}
                    </p>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      SKU: {item.sku} • {item.color_name} • Size: {item.size_name}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Qty: {item.quantity} × {formatCurrency(item.unit_price, order.currency)}
                    </p>
                  </div>
                </div>

                <div className="text-right font-semibold text-sm">
                  {formatCurrency(item.line_subtotal, order.currency)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/products"
            className={buttonVariants({
              className: "w-full sm:w-auto rounded-full px-8 h-11",
            })}
          >
            <span>Continue Shopping</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/account"
            className={buttonVariants({
              variant: "outline",
              className: "w-full sm:w-auto rounded-full px-8 h-11",
            })}
          >
            View Account Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
