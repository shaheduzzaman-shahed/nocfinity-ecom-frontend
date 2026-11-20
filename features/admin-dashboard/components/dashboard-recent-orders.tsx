"use client";

import Link from "next/link";
import { ArrowRight, Eye, Package } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AdminOrderStatusBadge } from "@/features/admin-orders/components/admin-order-status-badge";
import type { RecentOrder } from "../types/dashboard.types";

interface DashboardRecentOrdersProps {
  orders: RecentOrder[] | undefined;
  isLoading: boolean;
}

export function DashboardRecentOrders({
  orders,
  isLoading,
}: DashboardRecentOrdersProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-muted/60" />
          ))}
        </div>
      </div>
    );
  }

  const orderList = orders ?? [];

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <div className="flex items-center gap-2">
            <Package className="size-4 text-primary" />
            <h3 className="font-heading text-base font-bold text-foreground">
              Recent Orders
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Latest customer transactions placed through the storefront.
          </p>
        </div>

        <Link
          href="/admin/orders"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "h-8 gap-1 text-xs text-muted-foreground hover:text-foreground",
          })}
        >
          View all orders
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {orderList.length === 0 ? (
        <div className="p-10 text-center text-xs text-muted-foreground">
          No orders placed yet.
        </div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-muted/40 text-muted-foreground">
              <tr>
                <th className="py-2.5 px-4 font-medium">Order #</th>
                <th className="py-2.5 px-4 font-medium">Customer</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium">Total</th>
                <th className="py-2.5 px-4 font-medium">Date</th>
                <th className="py-2.5 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orderList.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-foreground">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:underline"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground">{order.customer.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                      {order.customer.email}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <AdminOrderStatusBadge status={order.order_status} />
                  </td>
                  <td className="py-3 px-4 font-semibold text-foreground">
                    ${order.final_total.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                        className: "h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground",
                      })}
                    >
                      <Eye className="size-3 mr-1" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
