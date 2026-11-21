"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";
import type { StorefrontCategory } from "../types/category.types";
import { CategoryCard } from "./category-card";

interface CategorySliderProps {
  categories: StorefrontCategory[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
  className?: string;
}

export function CategorySlider({
  categories,
  title = "Shop by category",
  subtitle = "Collections",
  viewAllHref = "/categories",
  viewAllText = "All categories",
  className,
}: CategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    // Allow a 2px tolerance for subpixel rounding
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    const container = scrollRef.current;
    if (!container) return;

    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateScrollState();
      });
      resizeObserver.observe(container);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, [updateScrollState, categories]);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>("[data-category-card]");
    const cardWidth = firstCard?.offsetWidth ?? 320;
    const gap = 24; // 1.5rem (gap-6)
    // Scroll by ~1 card on mobile, or ~2 cards on desktop
    const scrollAmount = Math.max(
      cardWidth + gap,
      Math.min(container.clientWidth * 0.75, (cardWidth + gap) * 2)
    );

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header with Title and Controls */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          {subtitle && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {subtitle}
            </p>
          )}
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              {viewAllText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          {/* Slider Prev / Next Controls */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5" aria-label="Category navigation">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous categories"
                className="flex size-9 items-center justify-center rounded-full border bg-background text-foreground shadow-xs transition-all hover:bg-muted active:scale-95 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Next categories"
                className="flex size-9 items-center justify-center rounded-full border bg-background text-foreground shadow-xs transition-all hover:bg-muted active:scale-95 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Categories Content */}
      {categories.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed p-12 text-center">
          <p className="font-heading text-lg font-semibold">
            The catalog is being prepared
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Categories will appear here as soon as they are published.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="-mx-4 flex gap-6 overflow-x-auto px-4 pb-4 pt-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scroll-smooth snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((category) => (
              <div
                key={category.id}
                data-category-card
                className="w-[280px] shrink-0 snap-start sm:w-[320px] lg:w-[360px]"
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
