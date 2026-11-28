"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminOrderStatusBadge } from "./admin-order-status-badge";
import type { AdminOrder, AdminOrderStatus } from "../types/admin-order.types";

interface AdminOrderStatusDialogProps {
  order: AdminOrder | null;
  targetStatus: AdminOrderStatus | null;
  open: boolean;
  isPending: boolean;
  onConfirm: (payload: { status: string; note?: string; reason?: string }) => void;
  onCancel: () => void;
}

export function AdminOrderStatusDialog({
  order,
  targetStatus,
  open,
  isPending,
  onConfirm,
  onCancel,
}: AdminOrderStatusDialogProps) {
  const [note, setNote] = useState("");

  const handleCancel = useCallback(() => {
    setNote("");
    onCancel();
  }, [onCancel]);

  const handleConfirm = useCallback(() => {
    if (!targetStatus) return;
    onConfirm({
      status: targetStatus,
      note: note.trim() || undefined,
      reason: note.trim() || undefined,
    });
    setNote("");
  }, [note, onConfirm, targetStatus]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        handleCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, isPending, handleCancel]);

  if (!open || !order || !targetStatus) return null;

  const isCancellation = targetStatus === "cancelled";
  const willRestoreStock =
    isCancellation && (order.order_status === "paid" || order.order_status === "processing");

  const getTitle = () => {
    if (isCancellation) return `Cancel Order ${order.order_number}`;
    return `Update Order Status to ${targetStatus.toUpperCase()}`;
  };

  const getDescription = () => {
    if (isCancellation) {
      if (willRestoreStock) {
        return "This order was previously paid/processing. Cancelling it will immediately restore the reserved variant inventory back to stock and notify the customer.";
      }
      return "This order is unpaid and pending. Cancelling it will void the order immediately without altering inventory.";
    }

    switch (targetStatus) {
      case "processing":
        return "Acknowledge order for warehouse fulfillment. Customer will be notified that items are being picked and packed.";
      case "shipped":
        return "Mark order as dispatched to carrier. Customer will receive a shipment notification email.";
      case "delivered":
        return "Mark order as delivered to customer destination. This is a terminal lifecycle state.";
      default:
        return "Update order status according to permitted lifecycle state machine.";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs"
      role="presentation"
      onClick={() => {
        if (!isPending) handleCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-status-dialog-title"
        className="w-full max-w-lg rounded-xl border bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          {isCancellation ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ArrowRight className="h-5 w-5" />
            </div>
          )}

          <div>
            <h2
              id="admin-status-dialog-title"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              {getTitle()}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Current:</span>
              <AdminOrderStatusBadge status={order.order_status} />
              <span>&rarr;</span>
              <span>New:</span>
              <AdminOrderStatusBadge status={targetStatus} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{getDescription()}</p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <Label htmlFor="admin-status-note" className="text-sm font-medium">
            {isCancellation ? "Reason for cancellation" : "Fulfillment / Courier note (optional)"}
          </Label>
          <Input
            id="admin-status-note"
            placeholder={
              isCancellation
                ? "e.g., Customer requested via phone / Out of stock..."
                : "e.g., Courier tracking number: DHL-1234567..."
            }
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isPending}
            maxLength={300}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={isCancellation ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isCancellation ? "Confirm Cancellation" : "Update Status"}
          </Button>
        </div>
      </div>
    </div>
  );
}
