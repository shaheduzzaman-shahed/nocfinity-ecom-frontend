"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  Tag,
  Ban,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCustomerOrder, useCancelOrder } from "@/features/orders/hooks/use-orders";
import { OrderStatusBadge, PaymentStatusBadge } from "@/features/orders/components/order-status-badge";
import { CancelOrderDialog } from "@/features/orders/components/cancel-order-dialog";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const { data: order, isLoading, isError, error } = useCustomerOrder(orderId);
  const cancelMutation = useCancelOrder();

  const handleConfirmCancel = (reason?: string) => {
    if (!order) return;

    cancelMutation.mutate(
      { id: order.id, reason },
      {
        onSuccess: () => {
          setIsCancelOpen(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-36 animate-pulse rounded-md bg-muted/60" />
        <div className="h-10 w-64 animate-pulse rounded-md bg-muted/60" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-64 animate-pulse rounded-2xl border bg-muted/30" />
            <div className="h-32 animate-pulse rounded-2xl border bg-muted/30" />
          </div>
          <div className="space-y-6">
            <div className="h-56 animate-pulse rounded-2xl border bg-muted/30" />
            <div className="h-44 animate-pulse rounded-2xl border bg-muted/30" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <h2 className="text-base font-semibold text-destructive">
          Order Not Found
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "The requested order could not be located."}
        </p>
        <Link
          href="/account/orders"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "mt-4 gap-1.5 text-xs",
          })}
        >
          <ArrowLeft className="size-3.5" />
          Back to My Orders
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to Orders
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {order.order_number}
            </h1>
            <OrderStatusBadge status={order.order_status} />
            <PaymentStatusBadge status={order.payment_status} />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              Placed on {formattedDate}
            </span>
            {order.paid_at && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                Paid on {new Date(order.paid_at).toLocaleDateString()}
              </span>
            )}
            {order.cancelled_at && (
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <Clock className="size-3.5" />
                Cancelled on {new Date(order.cancelled_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {order.can_cancel && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setIsCancelOpen(true)}
            className="w-full sm:w-auto gap-1.5 text-xs font-medium"
          >
            <Ban className="size-3.5" />
            Cancel Order
          </Button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Items & Payment */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h2 className="font-heading text-base font-semibold text-foreground">
                Items Ordered ({order.items.length})
              </h2>
              <span className="text-xs text-muted-foreground">
                Immutable Order Snapshots
              </span>
            </div>

            <div className="divide-y divide-border/60">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="relative size-18 shrink-0 overflow-hidden rounded-xl border bg-muted/40">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="size-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <Package className="size-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {item.product_name}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">
                        SKU: {item.sku}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="rounded-md bg-muted px-2 py-0.5 font-medium">
                          {item.color_name}
                        </span>
                        <span className="rounded-md bg-muted px-2 py-0.5 font-medium">
                          Size {item.size_name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span>
                        {order.currency} {Number(item.unit_price).toFixed(2)} × {item.quantity}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {order.currency} {Number(item.line_subtotal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Payment Details Card */}
          <Card className="p-6">
            <h2 className="font-heading text-base font-semibold text-foreground mb-4">
              Payment Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-3 rounded-xl border bg-muted/20 p-3.5">
                <CreditCard className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Payment Method</p>
                  <p className="text-muted-foreground mt-0.5">
                    {order.payment?.provider ? `Credit/Debit Card (${order.payment.provider})` : "Stripe Card Payment"}
                  </p>
                  {order.payment?.stripe_payment_intent_id && (
                    <p className="font-mono text-[11px] text-muted-foreground/80 mt-1">
                      ID: {order.payment.stripe_payment_intent_id}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border bg-muted/20 p-3.5">
                <ShieldCheck className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Payment Status</p>
                  <p className="text-muted-foreground capitalize mt-0.5">
                    {order.payment_status}
                  </p>
                  <p className="text-[11px] text-muted-foreground/80 mt-1">
                    Processed securely via Stripe Test Mode
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Financial Summary & Shipping Address */}
        <div className="space-y-6">
          {/* Order Summary Card */}
          <Card className="p-6 space-y-4">
            <h2 className="font-heading text-base font-semibold text-foreground border-b pb-3">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>
                  {order.currency} {Number(order.subtotal).toFixed(2)}
                </span>
              </div>

              {order.product_discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Product Discounts</span>
                  <span>
                    -{order.currency} {Number(order.product_discount).toFixed(2)}
                  </span>
                </div>
              )}

              {order.coupon_discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <Tag className="size-3.5" />
                    Coupon {order.coupon?.code ? `(${order.coupon.code})` : ""}
                  </span>
                  <span>
                    -{order.currency} {Number(order.coupon_discount).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>
                  {order.shipping_charge > 0
                    ? `${order.currency} ${Number(order.shipping_charge).toFixed(2)}`
                    : "Complimentary"}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-base text-foreground">
                <span>Total</span>
                <span>
                  {order.currency} {Number(order.final_total).toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* Shipping Address Card */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-2 border-b pb-3">
              <MapPin className="size-4 text-muted-foreground" />
              <h2 className="font-heading text-base font-semibold text-foreground">
                Shipping Address
              </h2>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground text-sm">
                {order.shipping_address.name}
              </p>
              <p>{order.shipping_address.address}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.state}{" "}
                {order.shipping_address.postal_code}
              </p>
              <p>{order.shipping_address.country}</p>
              <p className="pt-2 text-muted-foreground">
                Phone: {order.shipping_address.phone}
              </p>
              {order.shipping_address.email && (
                <p>Email: {order.shipping_address.email}</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Cancellation Dialog */}
      <CancelOrderDialog
        order={order}
        open={isCancelOpen}
        isPending={cancelMutation.isPending}
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsCancelOpen(false)}
      />
    </div>
  );
}
