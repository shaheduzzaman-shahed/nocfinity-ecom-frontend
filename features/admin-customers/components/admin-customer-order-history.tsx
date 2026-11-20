"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye, Package, ShoppingBag } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { AdminOrderStatusBadge } from "@/features/admin-orders/components/admin-order-status-badge";
import { useAdminCustomerOrders } from "../hooks/use-admin-customers";

interface AdminCustomerOrderHistoryProps {
  customerId: string | number;
  page: number;
  onPageChange: (page: number) => void;
}

export function AdminCustomerOrderHistory({
  customerId,
  page,
  onPageChange,
}: AdminCustomerOrderHistoryProps) {
  const { data, isLoading, isError, error } = useAdminCustomerOrders(
    customerId,
    page,
    10
  );

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-muted/60" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-xs text-destructive">
        Failed to load customer orders.{" "}
        {error instanceof Error ? error.message : "Please try again."}
      </div>
    );
  }

  const orders = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? orders.length;
  const lastPage = meta?.last_page ?? 1;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ShoppingBag className="size-5" />
        </div>
        <h4 className="mt-3 text-sm font-semibold text-foreground">
          No orders yet
        </h4>
        <p className="mt-1 text-xs text-muted-foreground">
          This customer has not placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b bg-muted/40 text-muted-foreground">
            <tr>
              <th className="py-2.5 px-3 font-medium">Order #</th>
              <th className="py-2.5 px-3 font-medium">Date</th>
              <th className="py-2.5 px-3 font-medium">Status</th>
              <th className="py-2.5 px-3 font-medium">Items</th>
              <th className="py-2.5 px-3 font-medium">Total</th>
              <th className="py-2.5 px-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-foreground">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="hover:underline"
                  >
                    {order.order_number}
                  </Link>
                </td>
                <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                  {new Date(order.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="py-2.5 px-3">
                  <AdminOrderStatusBadge status={order.order_status} />
                </td>
                <td className="py-2.5 px-3 text-muted-foreground">
                  {order.items_count} {order.items_count === 1 ? "item" : "items"}
                </td>
                <td className="py-2.5 px-3 font-semibold text-foreground">
                  ${order.final_total.toFixed(2)}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground",
                    })}
                  >
                    <Eye className="mr-1 size-3" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-between border-t px-3 py-2 text-xs">
          <span className="text-muted-foreground">
            Page {page} of {lastPage} ({total} total)
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-7 px-2 text-xs"
            >
              <ChevronLeft className="size-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= lastPage}
              onClick={() => onPageChange(page + 1)}
              className="h-7 px-2 text-xs"
            >
              <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
