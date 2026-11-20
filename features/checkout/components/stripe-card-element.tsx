"use client";

import { CardElement } from "@stripe/react-stripe-js";
import { CreditCard, Info } from "lucide-react";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#1c1917",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "14px",
      "::placeholder": {
        color: "#a8a29e",
      },
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
  hidePostalCode: true,
};

interface StripeCardInputProps {
  error?: string | null;
  onChange?: (complete: boolean) => void;
}

export function StripeCardElement({ error, onChange }: StripeCardInputProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-primary" />
            <span>Card Information *</span>
          </span>
          <span className="text-[11px] font-normal lowercase tracking-normal text-muted-foreground">
            Number, Exp, CVC
          </span>
        </label>

        <div className="rounded-xl border bg-background px-3.5 py-3 shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={(e) => {
              onChange?.(e.complete);
            }}
          />
        </div>

        {error && <p className="text-xs text-destructive font-medium pl-1">{error}</p>}
      </div>

      {/* Test Card Quick Helper Pill */}
      <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-[11px] text-amber-900 dark:text-amber-200">
        <Info className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="font-semibold">Stripe Test Card:</span>
          <code className="font-mono bg-amber-500/20 px-1 py-0.5 rounded text-[10px]">
            4242 • 4242 • 4242 • 4242
          </code>
          <span>Exp: any future date • CVC: any 3 digits</span>
        </div>
      </div>
    </div>
  );
}
