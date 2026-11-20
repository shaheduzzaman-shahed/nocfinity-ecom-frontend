import Link from "next/link";
import { Package, ChevronRight, Ban } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrderStatusBadge, PaymentStatusBadge } from "./order-status-badge";
import type { Order } from "../types/order.types";

interface OrderCardProps {
  order: Order;
  onCancelRequest?: (order: Order) => void;
}

export function OrderCard({ order, onCancelRequest }: OrderCardProps) {
  const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const previewItems = order.items.slice(0, 3);
  const remainingCount = Math.max(0, order.items.length - 3);

  return (
    <Card className="overflow-hidden border bg-card transition-all hover:shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/20 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase font-medium">Order</span>
            <span className="font-mono text-sm font-bold text-foreground">
              {order.order_number}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">• Placed on {formattedDate}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.order_status} />
          <PaymentStatusBadge status={order.payment_status} />
        </div>
      </div>

      {/* Body: Items Preview */}
      <div className="p-5">
        <div className="space-y-3">
          {previewItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3.5">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border bg-muted/30">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="size-full object-cover object-center"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <Package className="size-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.product_name}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span>{item.color_name}</span>
                  <span>•</span>
                  <span>Size {item.size_name}</span>
                  <span>•</span>
                  <span>Qty: {item.quantity}</span>
                </div>
              </div>

              <div className="text-right text-sm font-semibold text-foreground shrink-0">
                {order.currency} {Number(item.line_subtotal).toFixed(2)}
              </div>
            </div>
          ))}

          {remainingCount > 0 && (
            <p className="text-xs text-muted-foreground pt-1">
              +{remainingCount} more {remainingCount === 1 ? "item" : "items"}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t bg-muted/10 px-5 py-3.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground font-medium">Total:</span>
          <span className="text-base font-bold text-foreground">
            {order.currency} {Number(order.final_total).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {order.can_cancel && onCancelRequest && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40 text-xs h-8 gap-1.5"
              onClick={() => onCancelRequest(order)}
            >
              <Ban className="size-3.5" />
              Cancel Order
            </Button>
          )}

          <Link
            href={`/account/orders/${order.id}`}
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "text-xs h-8 gap-1 font-medium",
            })}
          >
            <span>View Details</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
