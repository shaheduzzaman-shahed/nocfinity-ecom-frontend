"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Coins, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  currencySettingsSchema,
  type CurrencySettingsFormValues,
} from "../schemas/admin-currency.schema";
import type { CurrencySettings } from "../types/admin-currency.types";
import { formatCurrency } from "@/lib/format";

interface CurrencyFormProps {
  settings: CurrencySettings;
  canManage: boolean;
  isSubmitting: boolean;
  serverErrors?: Record<string, string[]>;
  onSubmit: (values: { currency: string }) => void;
}

export function CurrencyForm({
  settings,
  canManage,
  isSubmitting,
  serverErrors,
  onSubmit,
}: CurrencyFormProps) {
  const form = useForm<CurrencySettingsFormValues>({
    resolver: zodResolver(currencySettingsSchema),
    defaultValues: {
      currency: settings.currency ?? "USD",
    },
  });

  const selectedCurrency = useWatch({ control: form.control, name: "currency" });

  useEffect(() => {
    form.reset({
      currency: settings.currency ?? "USD",
    });
  }, [settings, form]);

  useEffect(() => {
    if (!serverErrors) return;
    Object.entries(serverErrors).forEach(([field, messages]) => {
      if (messages?.[0]) {
        form.setError(field as keyof CurrencySettingsFormValues, {
          type: "server",
          message: messages[0],
        });
      }
    });
  }, [serverErrors, form]);

  const handleSubmit = (values: CurrencySettingsFormValues) => {
    onSubmit({
      currency: values.currency.trim().toUpperCase(),
    });
  };

  const activeCurrencyInfo = settings.supported_currencies.find(
    (c) => c.code === settings.currency
  );

  const selectedCurrencyInfo = settings.supported_currencies.find(
    (c) => c.code === selectedCurrency
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <Coins className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Storefront Currency</CardTitle>
              <CardDescription>
                Configure the primary currency for prices, cart subtotals, and Stripe checkout payments.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Active Currency Live Preview Banner */}
          <div className="flex flex-col gap-2 rounded-xl border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Store Currency
              </p>
              <p className="font-semibold text-foreground text-base">
                {activeCurrencyInfo
                  ? `${activeCurrencyInfo.name} (${activeCurrencyInfo.code})`
                  : settings.currency}
              </p>
              <p className="text-xs text-muted-foreground">
                Display Preview:{" "}
                <span className="font-semibold text-primary">
                  {formatCurrency(149.99, settings.currency)}
                </span>
              </p>
            </div>

            <span className="inline-flex items-center self-start sm:self-auto rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Live on Storefront
            </span>
          </div>

          {/* Currency Selector */}
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-sm font-semibold">
              Select Operating Currency <span className="text-destructive">*</span>
            </Label>
            <div className="max-w-md">
              <select
                id="currency"
                disabled={!canManage || isSubmitting}
                {...form.register("currency")}
                className="h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
              >
                {settings.supported_currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} — {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>
            {form.formState.errors.currency && (
              <p className="text-xs text-destructive font-medium">
                {form.formState.errors.currency.message}
              </p>
            )}
            {selectedCurrencyInfo && selectedCurrency !== settings.currency && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium pt-1">
                Changing currency to {selectedCurrencyInfo.name} ({selectedCurrencyInfo.code}). Sample price: {formatCurrency(149.99, selectedCurrency)}
              </p>
            )}
          </div>

          {/* Compliance & Policy Callouts */}
          <div className="grid gap-3 pt-2 sm:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
              <CreditCard className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground">Stripe Supported:</strong>{" "}
                Every currency listed is fully supported by Stripe for payment intent generation and card transactions.
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground">Order Immutability:</strong>{" "}
                Changing the store currency applies to future carts and checkouts immediately. Historical order records retain their original transaction currency.
              </div>
            </div>
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
