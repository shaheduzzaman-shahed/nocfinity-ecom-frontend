"use client";

import { Check, Mail, MapPin, Pencil, Phone, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ShippingAddress } from "../types/address.types";

interface AddressCardProps {
  address: ShippingAddress;
  onEdit: (address: ShippingAddress) => void;
  onDelete: (address: ShippingAddress) => void;
  onSetDefault: (address: ShippingAddress) => void;
  isSettingDefault?: boolean;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isSettingDefault = false,
}: AddressCardProps) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-sm transition-all ${
        address.is_default
          ? "border-primary/50 ring-1 ring-primary/20 bg-primary/[0.02]"
          : "hover:border-foreground/20"
      }`}
    >
      <div className="space-y-3">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-heading font-semibold text-foreground">
              {address.name}
            </span>
          </div>

          {address.is_default && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              <Check className="h-3 w-3" />
              Default
            </span>
          )}
        </div>

        {/* Street & Location */}
        <div className="space-y-1 text-xs text-muted-foreground leading-relaxed">
          <p className="text-foreground/90 font-medium">{address.address}</p>
          <p>
            {address.city}, {address.state} {address.postal_code}
          </p>
          <p>{address.country}</p>
        </div>

        {/* Contact Details */}
        <div className="space-y-1 pt-1 border-t text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-muted-foreground/70 shrink-0" />
            <span>{address.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground/70 shrink-0" />
            <span className="truncate">{address.email}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 mt-3 border-t text-xs">
        <div>
          {!address.is_default && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSettingDefault}
              onClick={() => onSetDefault(address)}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <Star className="mr-1 h-3.5 w-3.5" />
              Set as Default
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(address)}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(address)}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
