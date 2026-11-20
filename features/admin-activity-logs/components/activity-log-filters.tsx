"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ActivityLogFiltersProps {
  search: string;
  accountType: string;
  selectedAction: string;
  actionsList: string[];
  onSearchChange: (val: string) => void;
  onAccountTypeChange: (val: string) => void;
  onActionChange: (val: string) => void;
  onReset: () => void;
}

export function ActivityLogFiltersBar({
  search,
  accountType,
  selectedAction,
  actionsList,
  onSearchChange,
  onAccountTypeChange,
  onActionChange,
  onReset,
}: ActivityLogFiltersProps) {
  const hasFilters = Boolean(search || accountType || selectedAction);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {/* Search input */}
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search action, IP, user name/email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8.5 h-9 text-xs"
          />
        </div>

        {/* Account Type Filter */}
        <select
          value={accountType}
          onChange={(e) => onAccountTypeChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All Account Types</option>
          <option value="staff">Staff Only</option>
          <option value="customer">Customers Only</option>
        </select>

        {/* Action Slug Filter */}
        <select
          value={selectedAction}
          onChange={(e) => onActionChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring max-w-[220px]"
        >
          <option value="">All Action Types</option>
          {actionsList.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
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
