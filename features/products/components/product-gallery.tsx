"use client";

import { useState } from "react";
import { cn } from "cn";
import type { ProductImageData } from "../types/product.types";

interface ProductGalleryProps {
  images: ProductImageData[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const usableImages = images.filter((image) => image.url);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = usableImages[activeIndex] ?? usableImages[0] ?? null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        {active?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={active.url}
            alt={productName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-200 via-stone-300 to-stone-400 text-5xl font-semibold tracking-widest text-stone-600">
            {productName.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {usableImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {usableImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${usableImages.length}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative aspect-[4/5] overflow-hidden rounded-lg border-2 bg-muted transition-colors",
                index === activeIndex
                  ? "border-foreground"
                  : "border-transparent hover:border-muted-foreground/40"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url as string}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
