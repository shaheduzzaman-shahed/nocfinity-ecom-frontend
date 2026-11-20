"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { StorefrontCategory } from "@/features/categories/types/category.types";
import type {
  PublicColorData,
  PublicSizeData,
} from "@/features/products/types/product.types";
import { Button } from "@/components/ui/button";

interface StorefrontProductFiltersProps {
  categories: StorefrontCategory[];
  colors: PublicColorData[];
  sizes: PublicSizeData[];
  totalProducts?: number;
}

export function StorefrontProductFilters({
  categories,
  colors,
  sizes,
  totalProducts,
}: StorefrontProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Read current filter values from URL
  const currentSearch = searchParams.get("search") ?? "";
  const currentCategoryId = searchParams.get("category_id") ?? "";
  const currentMinPrice = searchParams.get("min_price") ?? "";
  const currentMaxPrice = searchParams.get("max_price") ?? "";
  const currentColorId = searchParams.get("color_id") ?? "";
  const currentSizeId = searchParams.get("size_id") ?? "";
  const currentAvailability = searchParams.get("availability") ?? "";
  const currentSort = searchParams.get("sort") ?? "newest";

  // Local state for search & price inputs
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);

  function updateQuery(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    // Reset pagination to page 1 whenever any filter changes
    params.delete("page");

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateQuery({ search: searchInput.trim() || null });
  }

  function handlePriceApply(e: React.FormEvent) {
    e.preventDefault();
    updateQuery({
      min_price: minPriceInput ? String(Number(minPriceInput)) : null,
      max_price: maxPriceInput ? String(Number(maxPriceInput)) : null,
    });
  }

  function clearAllFilters() {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }

  const activeFilterCount = [
    currentSearch,
    currentCategoryId,
    currentMinPrice,
    currentMaxPrice,
    currentColorId,
    currentSizeId,
    currentAvailability,
  ].filter(Boolean).length;

  // Find names for active chips
  const activeColor = colors.find((c) => String(c.id) === currentColorId);
  const activeSize = sizes.find((s) => String(s.id) === currentSizeId);

  // Flatten categories to find selected category name
  function findCategoryName(items: StorefrontCategory[], id: string): string | null {
    for (const cat of items) {
      if (String(cat.id) === id) return cat.name;
      if (cat.children?.length) {
        const found = findCategoryName(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  }
  const activeCategoryName = currentCategoryId
    ? findCategoryName(categories, currentCategoryId)
    : null;

  return (
    <div className="space-y-6">
      {/* Top Filter Bar: Search, Sort & Mobile Filter Button */}
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 sm:max-w-xs md:max-w-sm"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search within products..."
            className="h-10 w-full rounded-full border bg-muted/40 pl-9 pr-8 text-sm placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                updateQuery({ search: null });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {/* Mobile Filter Trigger Button */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full border bg-background px-4 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Sort Selector Dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="product-sort"
              className="text-xs font-medium text-muted-foreground hidden sm:inline"
            >
              Sort by:
            </label>
            <div className="relative">
              <select
                id="product-sort"
                value={currentSort}
                onChange={(e) => updateQuery({ sort: e.target.value })}
                className="h-10 appearance-none rounded-full border bg-background pl-4 pr-9 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips / Tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-muted-foreground">
            Active filters:
          </span>

          {currentSearch && (
            <span className="inline-flex items-center gap-1 rounded-full border bg-muted/60 px-3 py-1 text-xs text-foreground">
              Search: &ldquo;{currentSearch}&rdquo;
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  updateQuery({ search: null });
                }}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                aria-label="Remove search filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeCategoryName && (
            <span className="inline-flex items-center gap-1 rounded-full border bg-muted/60 px-3 py-1 text-xs text-foreground">
              Category: {activeCategoryName}
              <button
                type="button"
                onClick={() => updateQuery({ category_id: null })}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                aria-label="Remove category filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {(currentMinPrice || currentMaxPrice) && (
            <span className="inline-flex items-center gap-1 rounded-full border bg-muted/60 px-3 py-1 text-xs text-foreground">
              Price: ${currentMinPrice || "0"} – ${currentMaxPrice || "Any"}
              <button
                type="button"
                onClick={() => {
                  setMinPriceInput("");
                  setMaxPriceInput("");
                  updateQuery({ min_price: null, max_price: null });
                }}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                aria-label="Remove price filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeColor && (
            <span className="inline-flex items-center gap-1 rounded-full border bg-muted/60 px-3 py-1 text-xs text-foreground">
              <span
                className="size-2.5 rounded-full border"
                style={{ backgroundColor: activeColor.hex_code ?? "#ccc" }}
              />
              Color: {activeColor.name}
              <button
                type="button"
                onClick={() => updateQuery({ color_id: null })}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                aria-label="Remove color filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeSize && (
            <span className="inline-flex items-center gap-1 rounded-full border bg-muted/60 px-3 py-1 text-xs text-foreground">
              Size: {activeSize.name}
              <button
                type="button"
                onClick={() => updateQuery({ size_id: null })}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                aria-label="Remove size filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {currentAvailability && (
            <span className="inline-flex items-center gap-1 rounded-full border bg-muted/60 px-3 py-1 text-xs text-foreground">
              {currentAvailability === "in_stock" ? "In Stock" : "Out of Stock"}
              <button
                type="button"
                onClick={() => updateQuery({ availability: null })}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                aria-label="Remove availability filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <RotateCcw className="h-3 w-3" /> Clear all
          </button>
        </div>
      )}

      {/* Mobile Filters Slide-Out Drawer (390px Figma reference) */}
      {mobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex bg-background/80 backdrop-blur-sm lg:hidden"
        >
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <h3 className="font-heading text-lg font-bold">Filters</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="rounded-full p-1.5 hover:bg-muted"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 py-6">
              {renderFilterControls({
                categories,
                colors,
                sizes,
                currentCategoryId,
                currentMinPrice,
                currentMaxPrice,
                currentColorId,
                currentSizeId,
                currentAvailability,
                minPriceInput,
                setMinPriceInput,
                maxPriceInput,
                setMaxPriceInput,
                updateQuery: (updates) => {
                  updateQuery(updates);
                },
                handlePriceApply,
              })}
            </div>

            <div className="border-t pt-4 space-y-2">
              <Button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full rounded-full"
              >
                View {totalProducts !== undefined ? `${totalProducts} results` : "results"}
              </Button>
              {activeFilterCount > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    clearAllFilters();
                    setMobileDrawerOpen(false);
                  }}
                  className="w-full rounded-full text-xs"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Filter Panel for Desktop Sidebar or Mobile Drawer
export function StorefrontFilterSidebar({
  categories,
  colors,
  sizes,
  searchParams,
}: {
  categories: StorefrontCategory[];
  colors: PublicColorData[];
  sizes: PublicSizeData[];
  searchParams: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const currentCategoryId = searchParams.category_id ?? "";
  const currentMinPrice = searchParams.min_price ?? "";
  const currentMaxPrice = searchParams.max_price ?? "";
  const currentColorId = searchParams.color_id ?? "";
  const currentSizeId = searchParams.size_id ?? "";
  const currentAvailability = searchParams.availability ?? "";

  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);

  function updateQuery(updates: Record<string, string | null>) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val && key !== "page") {
        params.set(key, val);
      }
    });

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  function handlePriceApply(e: React.FormEvent) {
    e.preventDefault();
    updateQuery({
      min_price: minPriceInput ? String(Number(minPriceInput)) : null,
      max_price: maxPriceInput ? String(Number(maxPriceInput)) : null,
    });
  }

  return (
    <aside className="hidden lg:block w-64 shrink-0 space-y-8 pr-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="font-heading text-base font-bold tracking-tight">
          Filter by
        </h2>
        {(currentCategoryId ||
          currentMinPrice ||
          currentMaxPrice ||
          currentColorId ||
          currentSizeId ||
          currentAvailability) && (
          <button
            type="button"
            onClick={() => {
              setMinPriceInput("");
              setMaxPriceInput("");
              router.push(pathname, { scroll: false });
            }}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        )}
      </div>

      {renderFilterControls({
        categories,
        colors,
        sizes,
        currentCategoryId,
        currentMinPrice,
        currentMaxPrice,
        currentColorId,
        currentSizeId,
        currentAvailability,
        minPriceInput,
        setMinPriceInput,
        maxPriceInput,
        setMaxPriceInput,
        updateQuery,
        handlePriceApply,
      })}
    </aside>
  );
}

interface FilterControlParams {
  categories: StorefrontCategory[];
  colors: PublicColorData[];
  sizes: PublicSizeData[];
  currentCategoryId: string;
  currentMinPrice: string;
  currentMaxPrice: string;
  currentColorId: string;
  currentSizeId: string;
  currentAvailability: string;
  minPriceInput: string;
  setMinPriceInput: (v: string) => void;
  maxPriceInput: string;
  setMaxPriceInput: (v: string) => void;
  updateQuery: (updates: Record<string, string | null>) => void;
  handlePriceApply: (e: React.FormEvent) => void;
}

function renderFilterControls({
  categories,
  colors,
  sizes,
  currentCategoryId,
  currentMinPrice: _minP,
  currentMaxPrice: _maxP,
  currentColorId,
  currentSizeId,
  currentAvailability,
  minPriceInput,
  setMinPriceInput,
  maxPriceInput,
  setMaxPriceInput,
  updateQuery,
  handlePriceApply,
}: FilterControlParams) {
  return (
    <div className="space-y-7 text-sm">
      {/* 1. Category Filter (Hierarchical) */}
      <div className="space-y-3">
        <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </h3>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => updateQuery({ category_id: null })}
            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
              !currentCategoryId
                ? "bg-muted font-semibold text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <span>All Categories</span>
            {!currentCategoryId && <Check className="h-3.5 w-3.5" />}
          </button>

          {categories.map((cat) => {
            const isSelected = currentCategoryId === String(cat.id);
            const children = cat.children ?? [];

            return (
              <div key={cat.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => updateQuery({ category_id: String(cat.id) })}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                    isSelected
                      ? "bg-muted font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <span>{cat.name}</span>
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                </button>

                {children.length > 0 && (
                  <div className="ml-3 space-y-1 border-l pl-2">
                    {children.map((child) => {
                      const isChildSelected =
                        currentCategoryId === String(child.id);
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() =>
                            updateQuery({ category_id: String(child.id) })
                          }
                          className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-[11px] text-left transition-colors ${
                            isChildSelected
                              ? "bg-muted font-semibold text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span>{child.name}</span>
                          {isChildSelected && <Check className="h-3 w-3" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Filter */}
      <div className="space-y-3">
        <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price Range ($)
        </h3>
        <form onSubmit={handlePriceApply} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="h-9 w-full rounded-lg border bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <span className="text-muted-foreground text-xs">–</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="h-9 w-full rounded-lg border bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <Button type="submit" variant="outline" size="sm" className="w-full text-xs h-8">
            Apply Price
          </Button>
        </form>
      </div>

      {/* 3. Color Filter (Color swatches) */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Color
          </h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = currentColorId === String(color.id);

              return (
                <button
                  key={color.id}
                  type="button"
                  title={color.name}
                  onClick={() =>
                    updateQuery({
                      color_id: isSelected ? null : String(color.id),
                    })
                  }
                  className={`relative flex size-7 items-center justify-center rounded-full border transition-transform hover:scale-110 ${
                    isSelected
                      ? "ring-2 ring-primary ring-offset-2"
                      : "border-border"
                  }`}
                  style={{
                    backgroundColor: color.hex_code ?? "#f3f4f6",
                  }}
                >
                  {isSelected && (
                    <Check
                      className="h-3 w-3"
                      style={{
                        color:
                          color.hex_code &&
                          ["#ffffff", "#fff", "#f8f9fa", "#f5f5f5"].includes(
                            color.hex_code.toLowerCase()
                          )
                            ? "#000000"
                            : "#ffffff",
                      }}
                    />
                  )}
                  <span className="sr-only">{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Size Filter (Size buttons) */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Size
          </h3>
          <div className="grid grid-cols-3 gap-1.5">
            {sizes.map((size) => {
              const isSelected = currentSizeId === String(size.id);

              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() =>
                    updateQuery({
                      size_id: isSelected ? null : String(size.id),
                    })
                  }
                  className={`flex h-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {size.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Product Availability Filter */}
      <div className="space-y-3">
        <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Availability
        </h3>
        <div className="space-y-1.5">
          {[
            { label: "All Items", value: "" },
            { label: "In Stock Only", value: "in_stock" },
            { label: "Out of Stock", value: "out_of_stock" },
          ].map((opt) => {
            const isSelected = currentAvailability === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  updateQuery({
                    availability: opt.value || null,
                  })
                }
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                  isSelected
                    ? "bg-muted font-semibold text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
