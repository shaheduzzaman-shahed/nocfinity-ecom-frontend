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
  User,
  ArrowRight,
  Ban,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import {
  AdminOrderStatusBadge,
  AdminPaymentStatusBadge,
} from "@/features/admin-orders/components/admin-order-status-badge";
import { AdminOrderStatusDialog } from "@/features/admin-orders/components/admin-order-status-dialog";
import {
  useAdminOrder,
  useUpdateOrderStatus,
} from "@/features/admin-orders/hooks/use-admin-orders";
import type { AdminOrderStatus } from "@/features/admin-orders/types/admin-order.types";

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const { permissions, isLoading: permissionsLoading } = useAdminPermissions();

  if (permissionsLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "orders.view")) {
    return <NoAccess />;
  }

  return (
    <OrderDetailContent
      orderId={orderId}
      canUpdateStatus={hasPermission(permissions, "orders.update_status")}
    />
  );
}

function OrderDetailContent({
  orderId,
  canUpdateStatus,
}: {
  orderId: string;
  canUpdateStatus: boolean;
}) {
  const [selectedTargetStatus, setSelectedTargetStatus] =
    useState<AdminOrderStatus | null>(null);

  const { data: order, isLoading, isError, error } = useAdminOrder(orderId);
  const updateStatusMutation = useUpdateOrderStatus();

  const handleConfirmTransition = (payload: {
    status: string;
    note?: string;
    reason?: string;
  }) => {
    if (!order || !selectedTargetStatus) return;

    updateStatusMutation.mutate(
      {
        id: order.id,
        payload,
      },
      {
        onSuccess: () => {
          setSelectedTargetStatus(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-36 animate-pulse rounded-md bg-muted/60" />
        <div className="h-14 w-full animate-pulse rounded-2xl bg-muted/40" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-64 animate-pulse rounded-2xl bg-muted/30" />
            <div className="h-40 animate-pulse rounded-2xl bg-muted/30" />
          </div>
          <div className="space-y-6">
            <div className="h-56 animate-pulse rounded-2xl bg-muted/30" />
            <div className="h-44 animate-pulse rounded-2xl bg-muted/30" />
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
          {error instanceof Error
            ? error.message
            : "The requested order could not be loaded."}
        </p>
        <Link
          href="/admin/orders"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "mt-4 gap-1.5 text-xs",
          })}
        >
          <ArrowLeft className="size-3.5" />
          Back to Orders
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
      {/* Back button */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to Orders
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {order.order_number}
            </h1>
            <AdminOrderStatusBadge status={order.order_status} />
            <AdminPaymentStatusBadge status={order.payment_status} />
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

        {/* Permitted Action Buttons */}
        {canUpdateStatus && order.permitted_transitions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {order.permitted_transitions.map((nextStatus) => {
              const isCancel = nextStatus === "cancelled";

              return (
                <Button
                  key={nextStatus}
                  type="button"
                  variant={isCancel ? "destructive" : "default"}
                  size="sm"
                  className="gap-1.5 text-xs capitalize font-medium"
                  onClick={() => setSelectedTargetStatus(nextStatus)}
                >
                  {isCancel ? (
                    <>
                      <Ban className="size-3.5" />
                      <span>Cancel Order</span>
                    </>
                  ) : (
                    <>
                      <span>Mark {nextStatus}</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Line Items, Customer & Payment */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items Snapshot Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h2 className="font-heading text-base font-semibold text-foreground">
                Line Items ({order.items.length})
              </h2>
              <span className="text-xs text-muted-foreground">
                Immutable Order Snapshot
              </span>
            </div>

            <div className="divide-y divide-border/60">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border bg-muted/40">
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

          {/* Customer & Payment Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Customer Details */}
            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 border-b pb-3">
                <User className="size-4 text-muted-foreground" />
                <h2 className="font-heading text-base font-semibold text-foreground">
                  Customer
                </h2>
              </div>
              <div className="text-xs space-y-1.5 text-muted-foreground">
                <p className="font-semibold text-foreground text-sm">
                  {order.customer.name}
                </p>
                <p>Email: {order.customer.email}</p>
                {order.customer.phone && <p>Phone: {order.customer.phone}</p>}
                <p className="text-[11px] font-mono text-muted-foreground/80 pt-1">
                  User ID: #{order.user_id}
                </p>
              </div>
            </Card>

            {/* Payment Details */}
            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 border-b pb-3">
                <CreditCard className="size-4 text-muted-foreground" />
                <h2 className="font-heading text-base font-semibold text-foreground">
                  Payment
                </h2>
              </div>
              <div className="text-xs space-y-1.5 text-muted-foreground">
                <p className="font-semibold text-foreground text-sm">
                  {order.payment?.provider
                    ? `Card Payment (${order.payment.provider})`
                    : "Stripe Card Payment"}
                </p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span>Status:</span>
                  <AdminPaymentStatusBadge status={order.payment_status} />
                </div>
                {order.payment?.stripe_payment_intent_id && (
                  <p className="font-mono text-[11px] text-muted-foreground/80 pt-1 truncate">
                    Intent ID: {order.payment.stripe_payment_intent_id}
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Financial Summary & Shipping Address */}
        <div className="space-y-6">
          {/* Order Financial Breakdown */}
          <Card className="p-6 space-y-4">
            <h2 className="font-heading text-base font-semibold text-foreground border-b pb-3">
              Financial Summary
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
                <span>Shipping Fee</span>
                <span>
                  {order.shipping_charge > 0
                    ? `${order.currency} ${Number(order.shipping_charge).toFixed(2)}`
                    : "Complimentary"}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-base text-foreground">
                <span>Final Total</span>
                <span>
                  {order.currency} {Number(order.final_total).toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* Shipping Address Snapshot */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-2 border-b pb-3">
              <MapPin className="size-4 text-muted-foreground" />
              <h2 className="font-heading text-base font-semibold text-foreground">
                Shipping Destination
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

      {/* Status Transition Dialog */}
      <AdminOrderStatusDialog
        order={order}
        targetStatus={selectedTargetStatus}
        open={Boolean(selectedTargetStatus)}
        isPending={updateStatusMutation.isPending}
        onConfirm={handleConfirmTransition}
        onCancel={() => setSelectedTargetStatus(null)}
      />
    </div>
  );
}
