"use client";

import Link from "next/link";
import { ChevronRight, Eye, MoreHorizontal, ArrowRight, Ban } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  AdminOrderStatusBadge,
  AdminPaymentStatusBadge,
} from "./admin-order-status-badge";
import type { AdminOrder, AdminOrderStatus } from "../types/admin-order.types";

interface AdminOrderTableProps {
  orders: AdminOrder[];
  isLoading: boolean;
  canUpdateStatus: boolean;
  onSelectTransition?: (order: AdminOrder, target: AdminOrderStatus) => void;
}

export function AdminOrderTable({
  orders,
  isLoading,
  canUpdateStatus,
  onSelectTransition,
}: AdminOrderTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded-lg bg-muted/40"
            />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-12 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No orders found matching the criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-2xs">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/40 text-xs uppercase font-medium text-muted-foreground">
          <tr>
            <th className="px-4 py-3.5">Order</th>
            <th className="px-4 py-3.5">Customer</th>
            <th className="px-4 py-3.5">Items</th>
            <th className="px-4 py-3.5">Total</th>
            <th className="px-4 py-3.5">Payment</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {orders.map((order) => {
            const formattedDate = new Date(order.created_at).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );

            // Determine primary next transition action
            const primaryNext = order.permitted_transitions.find(
              (t) => t !== "cancelled"
            );

            return (
              <tr
                key={order.id}
                className="transition-colors hover:bg-muted/20"
              >
                {/* Order Number & Date */}
                <td className="px-4 py-3.5">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-mono text-xs font-semibold text-primary hover:underline"
                  >
                    {order.order_number}
                  </Link>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formattedDate}
                  </p>
                </td>

                {/* Customer */}
                <td className="px-4 py-3.5">
                  <p className="font-medium text-xs text-foreground">
                    {order.customer.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                    {order.customer.email}
                  </p>
                </td>

                {/* Items */}
                <td className="px-4 py-3.5 text-xs text-muted-foreground">
                  <span>{order.items_count} {order.items_count === 1 ? "item" : "items"}</span>
                </td>

                {/* Total */}
                <td className="px-4 py-3.5 text-xs font-semibold text-foreground">
                  {order.currency} {Number(order.final_total).toFixed(2)}
                </td>

                {/* Payment */}
                <td className="px-4 py-3.5">
                  <AdminPaymentStatusBadge status={order.payment_status} />
                </td>

                {/* Order Status */}
                <td className="px-4 py-3.5">
                  <AdminOrderStatusBadge status={order.order_status} />
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Quick stage transition button */}
                    {canUpdateStatus && primaryNext && onSelectTransition && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] px-2 capitalize gap-1 font-medium"
                        onClick={() => onSelectTransition(order, primaryNext)}
                      >
                        <span>{primaryNext}</span>
                        <ArrowRight className="size-3" />
                      </Button>
                    )}

                    {/* Quick cancel button if permitted */}
                    {canUpdateStatus && order.can_cancel && onSelectTransition && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 text-[11px] px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        onClick={() => onSelectTransition(order, "cancelled")}
                        title="Cancel Order"
                      >
                        <Ban className="size-3.5" />
                      </Button>
                    )}

                    <Link
                      href={`/admin/orders/${order.id}`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                        className: "h-7 w-7 p-0 text-muted-foreground hover:text-foreground",
                      })}
                      title="View Details"
                    >
                      <Eye className="size-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
