"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AddressForm } from "./address-form";
import type { AddressPayload, ShippingAddress } from "../types/address.types";

interface AddressDialogProps {
  open: boolean;
  initialData?: ShippingAddress | null;
  isSubmitting?: boolean;
  serverErrors?: Record<string, string[]>;
  onClose: () => void;
  onSubmit: (payload: AddressPayload) => void;
}

export function AddressDialog({
  open,
  initialData,
  isSubmitting = false,
  serverErrors,
  onClose,
  onSubmit,
}: AddressDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, isSubmitting, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-dialog-title"
        className="relative w-full max-w-lg rounded-2xl border bg-background p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 id="address-dialog-title" className="font-heading text-lg font-bold">
            {initialData ? "Edit Shipping Address" : "Add New Shipping Address"}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="pt-4">
          <AddressForm
            initialData={initialData}
            submitLabel={initialData ? "Update Address" : "Save Address"}
            isSubmitting={isSubmitting}
            serverErrors={serverErrors}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
