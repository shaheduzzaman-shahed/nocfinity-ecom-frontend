"use client";

import { CreditCard, Lock, ShieldCheck } from "lucide-react";

export function CheckoutPaymentSection() {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8 space-y-6">
      <div className="border-b pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold tracking-tight">
              2. Payment Method
            </h2>
            <p className="text-xs text-muted-foreground">
              All transactions are encrypted and processed securely.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border-2 border-primary bg-primary/[0.02] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-card border shadow-xs text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Credit or Debit Card</p>
                <p className="text-xs text-muted-foreground">
                  Powered by Stripe Test Mode
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="rounded-md border bg-card px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground">
                VISA
              </span>
              <span className="rounded-md border bg-card px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground">
                MC
              </span>
              <span className="rounded-md border bg-card px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground">
                AMEX
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
            <Lock className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Order details and authoritative totals are generated on the server.
              Payment authorization and card entry will be collected securely via Stripe Elements.
            </span>
          </div>
        </div>

        {/* Trust features */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>256-Bit SSL Encryption</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-2.5">
            <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>PCI-DSS Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
