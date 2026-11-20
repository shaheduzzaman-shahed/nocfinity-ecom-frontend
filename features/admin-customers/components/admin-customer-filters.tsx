"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminCustomerFiltersProps {
  search: string;
  sortBy: string;
  onSearchChange: (val: string) => void;
  onSortChange: (val: string) => void;
  onReset: () => void;
}

export function AdminCustomerFilters({
  search,
  sortBy,
  onSearchChange,
  onSortChange,
  onReset,
}: AdminCustomerFiltersProps) {
  const hasFilters = Boolean(search || (sortBy && sortBy !== "created_at"));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Sort By Select */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="created_at">Recently Registered</option>
          <option value="name">Name (A-Z)</option>
          <option value="orders_count">Most Orders</option>
          <option value="total_spent">Highest Spend</option>
        </select>

        {/* Reset */}
        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1.5 size-3.5" />
            Reset filters
          </Button>
        )}
      </div>
    </div>
  );
}
