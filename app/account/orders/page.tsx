"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCustomerOrders, useCancelOrder } from "@/features/orders/hooks/use-orders";
import { OrderCard } from "@/features/orders/components/order-card";
import { CancelOrderDialog } from "@/features/orders/components/cancel-order-dialog";
import type { Order, OrderStatus } from "@/features/orders/types/order.types";

export default function CustomerOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<Order | null>(null);

  const { data, isLoading, isError, error } = useCustomerOrders({
    page,
    per_page: 10,
  });

  const cancelMutation = useCancelOrder();

  const handleConfirmCancel = (reason?: string) => {
    if (!selectedOrderToCancel) return;

    cancelMutation.mutate(
      { id: selectedOrderToCancel.id, reason },
      {
        onSuccess: () => {
          setSelectedOrderToCancel(null);
        },
      }
    );
  };

  const orders = data?.orders ?? [];
  const meta = data?.meta;

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.order_status === statusFilter);

  const filterTabs: { id: string; label: string }[] = [
    { id: "all", label: "All Orders" },
    { id: "pending", label: "Pending" },
    { id: "paid", label: "Paid" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Orders
          </h1>
          <p className="text-sm text-muted-foreground">
            View your order history, track status, and manage active purchases.
          </p>
        </div>

        <Link
          href="/products"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "w-fit gap-1.5 text-xs font-medium",
          })}
        >
          <ShoppingBag className="size-3.5" />
          Continue Shopping
        </Link>
      </div>

      {/* Filter Tabs */}
      {!isLoading && orders.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => {
            const count =
              tab.id === "all"
                ? orders.length
                : orders.filter((o) => o.order_status === tab.id).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${
                      statusFilter === tab.id
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background text-muted-foreground border"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 w-full animate-pulse rounded-2xl border bg-muted/30"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && isError && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <p className="text-sm font-medium text-destructive">
            {error instanceof Error ? error.message : "Failed to load orders."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 text-xs"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
            <Package className="size-7" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            No orders placed yet
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            You haven&apos;t placed any orders yet. Discover our latest collections and find your style today.
          </p>
          <Link
            href="/products"
            className={buttonVariants({
              variant: "default",
              className: "mt-6 gap-2 text-sm",
            })}
          >
            <ShoppingBag className="size-4" />
            Start Shopping
          </Link>
        </div>
      )}

      {/* Filtered Empty State */}
      {!isLoading && !isError && orders.length > 0 && filteredOrders.length === 0 && (
        <div className="rounded-2xl border border-dashed py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No {statusFilter} orders found in your current page.
          </p>
          <Button
            variant="link"
            size="sm"
            className="mt-2 text-xs"
            onClick={() => setStatusFilter("all")}
          >
            Clear status filter
          </Button>
        </div>
      )}

      {/* Orders List */}
      {!isLoading && !isError && filteredOrders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancelRequest={(o) => setSelectedOrderToCancel(o)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Showing page <span className="font-medium text-foreground">{meta.current_page}</span> of{" "}
            <span className="font-medium text-foreground">{meta.last_page}</span> ({meta.total} total orders)
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.current_page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 gap-1 text-xs"
            >
              <ChevronLeft className="size-3.5" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              className="h-8 gap-1 text-xs"
            >
              Next
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Cancellation Dialog Modal */}
      <CancelOrderDialog
        order={selectedOrderToCancel}
        open={Boolean(selectedOrderToCancel)}
        isPending={cancelMutation.isPending}
        onConfirm={handleConfirmCancel}
        onCancel={() => setSelectedOrderToCancel(null)}
      />
    </div>
  );
}
