"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addressFormSchema,
  type AddressFormValues,
} from "../schemas/address.schema";
import type { AddressPayload, ShippingAddress } from "../types/address.types";

interface AddressFormProps {
  initialData?: ShippingAddress | null;
  submitLabel?: string;
  isSubmitting?: boolean;
  serverErrors?: Record<string, string[]>;
  onSubmit: (values: AddressPayload) => void;
  onCancel?: () => void;
}

const DEFAULT_VALUES: AddressPayload = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "United States",
  is_default: false,
};

export function AddressForm({
  initialData,
  submitLabel = "Save Address",
  isSubmitting = false,
  serverErrors,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
          address: initialData.address,
          city: initialData.city,
          state: initialData.state,
          postal_code: initialData.postal_code,
          country: initialData.country,
          is_default: initialData.is_default,
        }
      : DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!serverErrors) return;
    Object.entries(serverErrors).forEach(([field, messages]) => {
      if (messages?.[0]) {
        form.setError(field as keyof AddressFormValues, {
          type: "server",
          message: messages[0],
        });
      }
    });
  }, [serverErrors, form]);

  const handleSubmit = (values: AddressFormValues) => {
    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
      postal_code: values.postal_code.trim(),
      country: values.country.trim(),
      is_default: values.is_default,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      {/* Name & Phone Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="address-name" className="text-xs font-semibold">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="address-name"
            placeholder="Recipient's Name"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address-phone" className="text-xs font-semibold">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="address-phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...form.register("phone")}
          />
          {form.formState.errors.phone && (
            <p className="text-xs text-destructive">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="address-email" className="text-xs font-semibold">
          Delivery Contact Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address-email"
          type="email"
          placeholder="contact@example.com"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-xs text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {/* Street Address */}
      <div className="space-y-1.5">
        <Label htmlFor="address-street" className="text-xs font-semibold">
          Street Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address-street"
          placeholder="123 Fashion Blvd, Apt 4B"
          {...form.register("address")}
        />
        {form.formState.errors.address && (
          <p className="text-xs text-destructive">
            {form.formState.errors.address.message}
          </p>
        )}
      </div>

      {/* City, State, Postal Code Grid */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="address-city" className="text-xs font-semibold">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="address-city"
            placeholder="New York"
            {...form.register("city")}
          />
          {form.formState.errors.city && (
            <p className="text-xs text-destructive">
              {form.formState.errors.city.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address-state" className="text-xs font-semibold">
            State / Region <span className="text-destructive">*</span>
          </Label>
          <Input
            id="address-state"
            placeholder="NY"
            {...form.register("state")}
          />
          {form.formState.errors.state && (
            <p className="text-xs text-destructive">
              {form.formState.errors.state.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5 col-span-2 sm:col-span-1">
          <Label htmlFor="address-postal-code" className="text-xs font-semibold">
            Postal / ZIP <span className="text-destructive">*</span>
          </Label>
          <Input
            id="address-postal-code"
            placeholder="10001"
            {...form.register("postal_code")}
          />
          {form.formState.errors.postal_code && (
            <p className="text-xs text-destructive">
              {form.formState.errors.postal_code.message}
            </p>
          )}
        </div>
      </div>

      {/* Country */}
      <div className="space-y-1.5">
        <Label htmlFor="address-country" className="text-xs font-semibold">
          Country <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address-country"
          placeholder="United States"
          {...form.register("country")}
        />
        {form.formState.errors.country && (
          <p className="text-xs text-destructive">
            {form.formState.errors.country.message}
          </p>
        )}
      </div>

      {/* Set Default Checkbox */}
      <div className="flex items-center gap-2.5 pt-1">
        <input
          type="checkbox"
          id="address-is-default"
          {...form.register("is_default")}
          className="size-4 rounded border-input text-primary focus:ring-primary"
        />
        <Label
          htmlFor="address-is-default"
          className="cursor-pointer text-xs font-medium text-foreground"
        >
          Set as my default shipping address
        </Label>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
