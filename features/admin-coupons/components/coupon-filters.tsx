"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CouponFiltersProps {
  initialSearch: string;
  type: string;
  isActive: string;
  hasFilters: boolean;
  onSearchSubmit: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

export function CouponFilters({
  initialSearch,
  type,
  isActive,
  hasFilters,
  onSearchSubmit,
  onTypeChange,
  onStatusChange,
  onClear,
}: CouponFiltersProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          onSearchSubmit(String(formData.get("search") ?? "").trim());
        }}
      >
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="coupon-search" className="text-xs">
            Search Code
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              key={initialSearch}
              id="coupon-search"
              name="search"
              defaultValue={initialSearch}
              placeholder="e.g. WELCOME10, SUMMER..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="w-full space-y-1.5 sm:w-44">
          <Label htmlFor="coupon-type" className="text-xs">
            Discount Type
          </Label>
          <select
            id="coupon-type"
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">All Types</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>
        </div>

        <div className="w-full space-y-1.5 sm:w-40">
          <Label htmlFor="coupon-status" className="text-xs">
            Status
          </Label>
          <select
            id="coupon-status"
            value={isActive}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" variant="secondary" size="sm" className="h-9">
            Apply
          </Button>

          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-9 text-xs"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
