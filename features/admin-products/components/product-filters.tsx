"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminCategory } from "@/features/admin-categories/types/admin-category.types";
import { flattenCategoryTree } from "@/features/admin-categories/lib/category-tree";

interface ProductFiltersProps {
  initialSearch: string;
  categoryId: string;
  isActive: string;
  categories: AdminCategory[];
  hasFilters: boolean;
  onSearchSubmit: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

export function ProductFilters({
  initialSearch,
  categoryId,
  isActive,
  categories,
  hasFilters,
  onSearchSubmit,
  onCategoryChange,
  onStatusChange,
  onClear,
}: ProductFiltersProps) {
  const categoryOptions = flattenCategoryTree(categories);

  return (
    <div className="rounded-lg border bg-card p-4">
      <form
        className="flex flex-col gap-3 lg:flex-row lg:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          onSearchSubmit(String(formData.get("search") ?? "").trim());
        }}
      >
        <div className="flex-1 space-y-2">
          <Label htmlFor="product-search" className="text-xs">
            Search
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              key={initialSearch}
              id="product-search"
              name="search"
              defaultValue={initialSearch}
              placeholder="Search by name or slug"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2 sm:w-60">
          <Label htmlFor="product-category-filter" className="text-xs">
            Category
          </Label>
          <select
            id="product-category-filter"
            value={categoryId}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <option value="">All categories</option>
            {categoryOptions.map(({ category, depth }) => (
              <option key={category.id} value={String(category.id)}>
                {`${"— ".repeat(depth)}${category.name}`}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 sm:w-40">
          <Label htmlFor="product-status-filter" className="text-xs">
            Status
          </Label>
          <select
            id="product-status-filter"
            value={isActive}
            onChange={(event) => onStatusChange(event.target.value)}
            className="h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <option value="">All statuses</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" size="sm">
            Search
          </Button>
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
