import { cn } from "cn";
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  CheckCheck,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type { OrderStatus, PaymentStatus } from "../types/order.types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const configs: Record<
    OrderStatus,
    { label: string; icon: typeof Clock; style: string }
  > = {
    pending: {
      label: "Pending",
      icon: Clock,
      style:
        "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    },
    paid: {
      label: "Paid",
      icon: CheckCircle2,
      style:
        "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
    },
    processing: {
      label: "Processing",
      icon: Package,
      style:
        "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800",
    },
    shipped: {
      label: "Shipped",
      icon: Truck,
      style:
        "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800",
    },
    delivered: {
      label: "Delivered",
      icon: CheckCheck,
      style:
        "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      style:
        "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
    },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-xs transition-colors",
        config.style,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </span>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  const configs: Record<
    PaymentStatus,
    { label: string; icon: typeof Clock; style: string }
  > = {
    pending: {
      label: "Payment Pending",
      icon: Clock,
      style:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900",
    },
    paid: {
      label: "Payment Verified",
      icon: CheckCircle2,
      style:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900",
    },
    failed: {
      label: "Payment Failed",
      icon: AlertCircle,
      style:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900",
    },
    refunded: {
      label: "Refunded",
      icon: AlertCircle,
      style:
        "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700",
    },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border",
        config.style,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </span>
  );
}
