"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, MapPin, Plus, ShieldCheck } from "lucide-react";
import type { ShippingAddress } from "@/features/addresses/types/address.types";
import { AddressSelector } from "@/features/addresses/components/address-selector";
import {
  newAddressCheckoutSchema,
  type NewAddressCheckoutValues,
} from "../schemas/checkout.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";

interface CheckoutAddressSectionProps {
  addresses: ShippingAddress[];
  selectedAddressId: number | null;
  onSelectSavedAddress: (addressId: number) => void;
  onNewAddressChange: (data: NewAddressCheckoutValues | null) => void;
}

export function CheckoutAddressSection({
  addresses,
  selectedAddressId,
  onSelectSavedAddress,
  onNewAddressChange,
}: CheckoutAddressSectionProps) {
  const user = useAuthStore((s) => s.user);
  const [mode, setMode] = useState<"saved" | "new">(
    addresses.length > 0 ? "saved" : "new"
  );

  const {
    register,
    watch,
    getValues,
    formState: { errors },
    setValue,
  } = useForm<NewAddressCheckoutValues>({
    resolver: zodResolver(newAddressCheckoutSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "United States",
    },
    mode: "onChange",
  });

  const onNewAddressChangeRef = useRef(onNewAddressChange);
  useEffect(() => {
    onNewAddressChangeRef.current = onNewAddressChange;
  });

  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
  }, [user, setValue]);

  useEffect(() => {
    if (mode === "saved") {
      onNewAddressChangeRef.current(null);
      return;
    }

    onNewAddressChangeRef.current(getValues());

    const subscription = watch((value) => {
      onNewAddressChangeRef.current(value as NewAddressCheckoutValues);
    });

    return () => subscription.unsubscribe();
  }, [mode, watch, getValues]);

  const handleSelectAddress = (addr: ShippingAddress) => {
    setMode("saved");
    onSelectSavedAddress(addr.id);
  };

  const handleSwitchToNew = () => {
    setMode("new");
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
  };

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold tracking-tight">
              1. Shipping Address
            </h2>
            <p className="text-xs text-muted-foreground">
              Where should we deliver your order?
            </p>
          </div>
        </div>

        {addresses.length > 0 && mode === "new" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setMode("saved")}
            className="text-xs font-semibold text-primary hover:text-primary/80"
          >
            Use Saved Address
          </Button>
        )}
      </div>

      {mode === "saved" && addresses.length > 0 ? (
        <div className="space-y-4">
          <AddressSelector
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={handleSelectAddress}
            onAddNewAddress={handleSwitchToNew}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="checkout-name" className="text-xs font-semibold">
                Full Name *
              </Label>
              <Input
                id="checkout-name"
                placeholder="Jane Doe"
                {...register("name")}
                aria-invalid={Boolean(errors.name)}
                className="h-10 text-sm"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="checkout-email" className="text-xs font-semibold">
                Email Address *
              </Label>
              <Input
                id="checkout-email"
                type="email"
                placeholder="jane@example.com"
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
                className="h-10 text-sm"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="checkout-phone" className="text-xs font-semibold">
                Phone Number *
              </Label>
              <Input
                id="checkout-phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register("phone")}
                aria-invalid={Boolean(errors.phone)}
                className="h-10 text-sm"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="checkout-address" className="text-xs font-semibold">
                Street Address *
              </Label>
              <Input
                id="checkout-address"
                placeholder="123 Fashion Blvd, Apt 4B"
                {...register("address")}
                aria-invalid={Boolean(errors.address)}
                className="h-10 text-sm"
              />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="checkout-city" className="text-xs font-semibold">
                City *
              </Label>
              <Input
                id="checkout-city"
                placeholder="New York"
                {...register("city")}
                aria-invalid={Boolean(errors.city)}
                className="h-10 text-sm"
              />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="checkout-state" className="text-xs font-semibold">
                  State / Region *
                </Label>
                <Input
                  id="checkout-state"
                  placeholder="NY"
                  {...register("state")}
                  aria-invalid={Boolean(errors.state)}
                  className="h-10 text-sm"
                />
                {errors.state && (
                  <p className="text-xs text-destructive">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="checkout-zip" className="text-xs font-semibold">
                  Postal Code *
                </Label>
                <Input
                  id="checkout-zip"
                  placeholder="10001"
                  {...register("postal_code")}
                  aria-invalid={Boolean(errors.postal_code)}
                  className="h-10 text-sm"
                />
                {errors.postal_code && (
                  <p className="text-xs text-destructive">
                    {errors.postal_code.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="checkout-country" className="text-xs font-semibold">
                Country *
              </Label>
              <Input
                id="checkout-country"
                placeholder="United States"
                {...register("country")}
                aria-invalid={Boolean(errors.country)}
                className="h-10 text-sm"
              />
              {errors.country && (
                <p className="text-xs text-destructive">{errors.country.message}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
