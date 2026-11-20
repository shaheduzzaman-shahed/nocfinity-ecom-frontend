"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminReviewFiltersProps {
  search: string;
  status: string;
  rating: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onRatingChange: (val: string) => void;
  onReset: () => void;
}

export function AdminReviewFilters({
  search,
  status,
  rating,
  onSearchChange,
  onStatusChange,
  onRatingChange,
  onReset,
}: AdminReviewFiltersProps) {
  const hasFilters = Boolean(search || status || rating);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews, customer, product..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Review Status Select */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All Moderation Statuses</option>
          <option value="pending">Pending Moderation</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Rating Select */}
        <select
          value={rating}
          onChange={(e) => onRatingChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
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
