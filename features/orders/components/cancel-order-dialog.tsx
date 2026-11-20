"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Order } from "../types/order.types";

interface CancelOrderDialogProps {
  order: Order | null;
  open: boolean;
  isPending: boolean;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export function CancelOrderDialog({
  order,
  open,
  isPending,
  onConfirm,
  onCancel,
}: CancelOrderDialogProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) {
      setReason("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, isPending, onCancel]);

  if (!open || !order) return null;

  const isPaid = order.order_status === "paid";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      role="presentation"
      onClick={() => {
        if (!isPending) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-dialog-title"
        className="w-full max-w-lg rounded-xl border bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="cancel-dialog-title"
              className="text-lg font-semibold tracking-tight"
            >
              Cancel Order {order.order_number}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isPaid
                ? "This order has already been paid. Cancelling it will immediately restore the reserved stock to inventory. Any manual payment refund will follow standard store procedures."
                : "This order is unpaid and pending. Cancelling it will void the order immediately."}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <Label htmlFor="cancel-reason" className="text-sm font-medium">
            Reason for cancellation (optional)
          </Label>
          <Input
            id="cancel-reason"
            placeholder="e.g., Ordered wrong size, changed mind..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isPending}
            maxLength={250}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Keep Order
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => onConfirm(reason.trim() || undefined)}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Cancellation
          </Button>
        </div>
      </div>
    </div>
  );
}
