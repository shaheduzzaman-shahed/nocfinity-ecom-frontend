"use client";

import { Check, MapPin, Plus } from "lucide-react";
import type { ShippingAddress } from "../types/address.types";

interface AddressSelectorProps {
  addresses: ShippingAddress[];
  selectedAddressId: number | null;
  onSelectAddress: (address: ShippingAddress) => void;
  onAddNewAddress?: () => void;
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
}: AddressSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {addresses.map((address) => {
          const isSelected = selectedAddressId === address.id;

          return (
            <button
              type="button"
              key={address.id}
              onClick={() => onSelectAddress(address)}
              className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/[0.03] ring-2 ring-primary/20 shadow-sm"
                  : "border-border hover:border-foreground/30 bg-card"
              }`}
            >
              <div className="space-y-1.5 pr-6">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">
                    {address.name}
                  </span>
                  {address.is_default && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {address.address}, {address.city}, {address.state}{" "}
                  {address.postal_code}
                </p>
                <p className="text-[11px] text-muted-foreground/80">
                  {address.phone} • {address.email}
                </p>
              </div>

              {/* Selection Indicator */}
              <div
                className={`absolute top-4 right-4 flex size-5 items-center justify-center rounded-full border transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 bg-background"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}

        {onAddNewAddress && (
          <button
            type="button"
            onClick={onAddNewAddress}
            className="flex min-h-[110px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 p-4 text-center transition-colors hover:border-foreground/40 hover:bg-muted/30"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-muted">
              <Plus className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-xs font-semibold text-foreground">
              Add New Shipping Address
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
