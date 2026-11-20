"use client";

import Link from "next/link";
import { Check, Copy, Pencil, Plus, TicketPercent, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { formatCurrency, formatDate } from "@/lib/format";
import type { AdminCoupon } from "../types/admin-coupon.types";

interface CouponTableProps {
  coupons: AdminCoupon[];
  canManage: boolean;
  togglingCouponId: number | null;
  onDelete: (coupon: AdminCoupon) => void;
  onToggleStatus: (coupon: AdminCoupon) => void;
}

export function CouponTable({
  coupons,
  canManage,
  togglingCouponId,
  onDelete,
  onToggleStatus,
}: CouponTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (coupons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <TicketPercent className="h-5 w-5 text-muted-foreground" />
        </div>
        <h2 className="mt-4 font-heading text-lg font-semibold">
          No coupons found
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Create promotional discounts and coupon codes for your customers.
        </p>
        {canManage && (
          <div className="mt-4">
            <Link
              href="/admin/coupons/new"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Create Coupon
            </Link>
          </div>
        )}
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Coupon Code</th>
            <th className="px-4 py-3 font-medium">Discount</th>
            <th className="px-4 py-3 font-medium">Min Order</th>
            <th className="px-4 py-3 font-medium">Usage</th>
            <th className="px-4 py-3 font-medium">Validity</th>
            <th className="px-4 py-3 font-medium">Status</th>
            {canManage && (
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y">
          {coupons.map((coupon) => {
            const isExpired =
              coupon.valid_until && new Date(coupon.valid_until) < now;
            const isFuture =
              coupon.valid_from && new Date(coupon.valid_from) > now;
            const isExhausted =
              coupon.usage_limit !== null &&
              coupon.usage_count >= coupon.usage_limit;

            return (
              <tr key={coupon.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted border">
                      {coupon.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(coupon.code)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy code"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="font-semibold text-foreground">
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : formatCurrency(coupon.value, "USD")}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">
                    {coupon.type === "percentage" ? "off" : "fixed discount"}
                  </span>
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {coupon.min_order_amount > 0
                    ? formatCurrency(coupon.min_order_amount, "USD")
                    : "No minimum"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground">
                      {coupon.usage_count}
                    </span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground">
                      {coupon.usage_limit !== null
                        ? coupon.usage_limit
                        : "Unlimited"}
                    </span>
                    {isExhausted && (
                      <span className="ml-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                        Maxed
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {coupon.valid_from || coupon.valid_until ? (
                    <div>
                      {coupon.valid_from && (
                        <div>From: {formatDate(coupon.valid_from)}</div>
                      )}
                      {coupon.valid_until && (
                        <div>Until: {formatDate(coupon.valid_until)}</div>
                      )}
                      {isExpired && (
                        <span className="inline-block mt-0.5 rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-medium text-rose-600 dark:text-rose-400">
                          Expired
                        </span>
                      )}
                      {isFuture && (
                        <span className="inline-block mt-0.5 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                          Scheduled
                        </span>
                      )}
                    </div>
                  ) : (
                    <span>No expiration</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  {canManage ? (
                    <button
                      type="button"
                      disabled={togglingCouponId === coupon.id}
                      onClick={() => onToggleStatus(coupon)}
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                        coupon.is_active
                          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {coupon.is_active ? "Active" : "Inactive"}
                    </button>
                  ) : (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        coupon.is_active
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {coupon.is_active ? "Active" : "Inactive"}
                    </span>
                  )}
                </td>

                {canManage && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/coupons/${coupon.id}/edit`}
                        className={buttonVariants({
                          variant: "ghost",
                          size: "sm",
                          className: "h-8 w-8 p-0 text-muted-foreground hover:text-foreground",
                        })}
                        title="Edit coupon"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(coupon)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete coupon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
