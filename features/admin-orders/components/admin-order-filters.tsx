"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminOrderFiltersProps {
  search: string;
  status: string;
  paymentStatus: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onPaymentStatusChange: (val: string) => void;
  onReset: () => void;
}

export function AdminOrderFilters({
  search,
  status,
  paymentStatus,
  onSearchChange,
  onStatusChange,
  onPaymentStatusChange,
  onReset,
}: AdminOrderFiltersProps) {
  const hasFilters = Boolean(search || status || paymentStatus);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search order #, customer, email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Order Status Select */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All Order Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Payment Status Select */}
        <select
          value={paymentStatus}
          onChange={(e) => onPaymentStatusChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All Payment Statuses</option>
          <option value="pending">Pending Payment</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
