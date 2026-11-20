"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, TicketPercent } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
  couponFormSchema,
  type CouponFormValues,
} from "../schemas/admin-coupon.schema";
import type { CouponPayload } from "../types/admin-coupon.types";

interface CouponFormProps {
  defaultValues?: Partial<CouponPayload>;
  submitLabel: string;
  isSubmitting: boolean;
  serverErrors?: Record<string, string[]>;
  onSubmit: (payload: CouponPayload) => void;
}

const EMPTY_DEFAULTS: CouponPayload = {
  code: "",
  type: "percentage",
  value: 10,
  min_order_amount: 0,
  usage_limit: null,
  valid_from: null,
  valid_until: null,
  is_active: true,
};

function formatIsoToLocalInput(isoString?: string | null): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().slice(0, 16);
}

export function CouponForm({
  defaultValues = EMPTY_DEFAULTS,
  submitLabel,
  isSubmitting,
  serverErrors,
  onSubmit,
}: CouponFormProps) {
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: defaultValues.code ?? "",
      type: defaultValues.type ?? "percentage",
      value: defaultValues.value !== undefined ? String(defaultValues.value) : "10",
      min_order_amount:
        defaultValues.min_order_amount !== undefined && defaultValues.min_order_amount !== null
          ? String(defaultValues.min_order_amount)
          : "0",
      usage_limit:
        defaultValues.usage_limit !== undefined && defaultValues.usage_limit !== null
          ? String(defaultValues.usage_limit)
          : "",
      valid_from: formatIsoToLocalInput(defaultValues.valid_from),
      valid_until: formatIsoToLocalInput(defaultValues.valid_until),
      is_active: defaultValues.is_active ?? true,
    },
  });

  const selectedType = useWatch({ control: form.control, name: "type" });

  useEffect(() => {
    if (!serverErrors) return;
    Object.entries(serverErrors).forEach(([field, messages]) => {
      if (messages?.[0]) {
        form.setError(field as keyof CouponFormValues, {
          type: "server",
          message: messages[0],
        });
      }
    });
  }, [serverErrors, form]);

  const handleSubmit = (values: CouponFormValues) => {
    const payload: CouponPayload = {
      code: values.code.trim().toUpperCase(),
      type: values.type,
      value: Number(values.value),
      min_order_amount:
        values.min_order_amount && Number(values.min_order_amount) > 0
          ? Number(values.min_order_amount)
          : 0,
      usage_limit:
        values.usage_limit && Number(values.usage_limit) > 0
          ? Math.floor(Number(values.usage_limit))
          : null,
      valid_from: values.valid_from ? new Date(values.valid_from).toISOString() : null,
      valid_until: values.valid_until ? new Date(values.valid_until).toISOString() : null,
      is_active: values.is_active,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <TicketPercent className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Coupon Details</CardTitle>
              <CardDescription>
                Define the coupon code, discount rules, and usage constraints.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Coupon Code */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Coupon Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              placeholder="e.g. WELCOME10, SUMMER25"
              {...form.register("code", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
              className="font-mono text-sm uppercase tracking-wider"
            />
            {form.formState.errors.code && (
              <p className="text-xs text-destructive">
                {form.formState.errors.code.message}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Codes are unique and automatically capitalized.
            </p>
          </div>

          {/* Discount Type & Value Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">
                Discount Type <span className="text-destructive">*</span>
              </Label>
              <select
                id="type"
                {...form.register("type")}
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
              {form.formState.errors.type && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">
                Discount Value <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {selectedType === "fixed" ? "$" : "%"}
                </span>
                <Input
                  id="value"
                  type="text"
                  placeholder={selectedType === "percentage" ? "10" : "15.00"}
                  {...form.register("value")}
                  className="pl-8"
                />
              </div>
              {form.formState.errors.value && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.value.message}
                </p>
              )}
            </div>
          </div>

          {/* Min Order Amount & Usage Limit */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="min_order_amount">Minimum Order Subtotal ($)</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id="min_order_amount"
                  type="text"
                  placeholder="0.00"
                  {...form.register("min_order_amount")}
                  className="pl-8"
                />
              </div>
              {form.formState.errors.min_order_amount && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.min_order_amount.message}
                </p>
              )}
              <p className="text-[11px] text-muted-foreground">
                Set to 0 or leave empty for no minimum order requirement.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usage_limit">Global Usage Limit</Label>
              <Input
                id="usage_limit"
                type="text"
                placeholder="Leave blank for unlimited"
                {...form.register("usage_limit")}
              />
              {form.formState.errors.usage_limit && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.usage_limit.message}
                </p>
              )}
              <p className="text-[11px] text-muted-foreground">
                Total times this coupon can be redeemed across all customers.
              </p>
            </div>
          </div>

          {/* Validity Period */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="valid_from">Valid From</Label>
              <Input
                id="valid_from"
                type="datetime-local"
                {...form.register("valid_from")}
              />
              {form.formState.errors.valid_from && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.valid_from.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valid_until">Valid Until (Expiration)</Label>
              <Input
                id="valid_until"
                type="datetime-local"
                {...form.register("valid_until")}
              />
              {form.formState.errors.valid_until && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.valid_until.message}
                </p>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_active"
              {...form.register("is_active")}
              className="size-4 rounded border-input text-primary focus:ring-primary"
            />
            <div>
              <Label htmlFor="is_active" className="cursor-pointer font-medium">
                Active
              </Label>
              <p className="text-[11px] text-muted-foreground">
                When active, eligible customers can redeem this coupon at checkout.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/coupons"
          className={buttonVariants({ variant: "outline" })}
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
