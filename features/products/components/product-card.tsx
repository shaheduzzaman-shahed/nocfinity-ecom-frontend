import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { ProductCardData } from "../types/product.types";
import { RatingStars } from "./rating-stars";

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount =
    product.discount_percentage !== null &&
    product.effective_price < product.regular_price;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        {product.primary_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.primary_image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-200 via-stone-300 to-stone-400 text-3xl font-semibold tracking-widest text-stone-600">
            {product.name.slice(0, 2).toUpperCase()}
          </div>
        )}

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-background">
            -{product.discount_percentage}%
          </span>
        )}

        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="rounded-full bg-background px-3 py-1 text-xs font-medium uppercase tracking-wide">
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        {product.category && (
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.category.name}
          </p>
        )}
        <h3 className="line-clamp-2 font-heading text-base font-medium leading-snug">
          {product.name}
        </h3>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-semibold">
            {formatCurrency(product.effective_price, product.currency)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatCurrency(product.regular_price, product.currency)}
            </span>
          )}
        </div>

        {product.reviews_count > 0 && (
          <RatingStars
            rating={product.average_rating}
            count={product.reviews_count}
            className="pt-0.5"
          />
        )}
      </div>
    </Link>
  );
}
