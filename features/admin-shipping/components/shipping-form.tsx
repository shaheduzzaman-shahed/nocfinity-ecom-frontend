"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  shippingSettingsSchema,
  type ShippingSettingsFormValues,
} from "../schemas/admin-shipping.schema";
import type { ShippingSettings } from "../types/admin-shipping.types";
import { formatCurrency } from "@/lib/format";

interface ShippingFormProps {
  settings: ShippingSettings;
  canManage: boolean;
  isSubmitting: boolean;
  serverErrors?: Record<string, string[]>;
  onSubmit: (values: { shipping_fee: number; shipping_enabled: boolean }) => void;
}

export function ShippingForm({
  settings,
  canManage,
  isSubmitting,
  serverErrors,
  onSubmit,
}: ShippingFormProps) {
  const form = useForm<ShippingSettingsFormValues>({
    resolver: zodResolver(shippingSettingsSchema),
    defaultValues: {
      shipping_fee: String(settings.shipping_fee ?? 5.0),
      shipping_enabled: settings.shipping_enabled ?? true,
    },
  });

  const feeValue = useWatch({ control: form.control, name: "shipping_fee" });
  const isEnabled = useWatch({ control: form.control, name: "shipping_enabled" });

  useEffect(() => {
    form.reset({
      shipping_fee: String(settings.shipping_fee ?? 5.0),
      shipping_enabled: settings.shipping_enabled ?? true,
    });
  }, [settings, form]);

  useEffect(() => {
    if (!serverErrors) return;
    Object.entries(serverErrors).forEach(([field, messages]) => {
      if (messages?.[0]) {
        form.setError(field as keyof ShippingSettingsFormValues, {
          type: "server",
          message: messages[0],
        });
      }
    });
  }, [serverErrors, form]);

  const handleSubmit = (values: ShippingSettingsFormValues) => {
    onSubmit({
      shipping_fee: Number(values.shipping_fee),
      shipping_enabled: values.shipping_enabled,
    });
  };

  const previewFee = Number(feeValue);
  const validPreview = !isNaN(previewFee) && previewFee >= 0;

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Shipping Fee Configuration</CardTitle>
              <CardDescription>
                Configure the flat-rate delivery fee applied to customer checkouts and order totals.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Live Status Banner */}
          <div className="flex flex-col gap-2 rounded-xl border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Checkout Rule
              </p>
              <p className="font-medium text-foreground">
                {isEnabled ? (
                  validPreview ? (
                    <span>
                      Standard Delivery Fee:{" "}
                      <strong className="text-primary">
                        {formatCurrency(previewFee, "USD")}
                      </strong>
                    </span>
                  ) : (
                    "Standard Delivery Fee"
                  )
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Complimentary Free Delivery ($0.00)
                  </span>
                )}
              </p>
            </div>

            <span
              className={`inline-flex items-center self-start sm:self-auto rounded-full px-3 py-1 text-xs font-semibold ${
                isEnabled
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400"
              }`}
            >
              <Check className="mr-1.5 h-3.5 w-3.5" />
              {isEnabled ? "Shipping Active" : "Free Shipping Mode"}
            </span>
          </div>

          {/* Shipping Enabled Switch */}
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <input
              type="checkbox"
              id="shipping_enabled"
              disabled={!canManage || isSubmitting}
              {...form.register("shipping_enabled")}
              className="mt-0.5 size-4 rounded border-input text-primary focus:ring-primary disabled:opacity-50"
            />
            <div className="space-y-1">
              <Label
                htmlFor="shipping_enabled"
                className="cursor-pointer font-semibold text-foreground text-sm"
              >
                Enable Shipping Charges
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When enabled, the configured shipping fee is automatically applied to orders during cart and checkout calculations. When disabled, customers enjoy complimentary free shipping ($0.00).
              </p>
            </div>
          </div>

          {/* Shipping Fee Input */}
          <div className="space-y-2">
            <Label htmlFor="shipping_fee" className="text-sm font-semibold">
              Standard Shipping Fee ($) <span className="text-destructive">*</span>
            </Label>
            <div className="relative max-w-sm">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">
                $
              </span>
              <Input
                id="shipping_fee"
                type="text"
                placeholder="5.00"
                disabled={!canManage || isSubmitting}
                {...form.register("shipping_fee")}
                className="pl-8 text-base font-medium tracking-tight"
              />
            </div>
            {form.formState.errors.shipping_fee && (
              <p className="text-xs text-destructive font-medium">
                {form.formState.errors.shipping_fee.message}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Enter a non-negative decimal amount (e.g. 5.00 or 12.50).
            </p>
          </div>

          {/* Snapshot Policy Notice */}
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p>
              <strong>Historical Order Immutability:</strong> The shipping fee active at the moment of checkout is permanently snapshotted onto each customer order. Updating this configuration affects future checkout calculations immediately without modifying previous order records.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Action */}
      {canManage && (
        <div className="flex items-center justify-end">
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Configuration
          </Button>
        </div>
      )}
    </form>
  );
}
