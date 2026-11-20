import type { RatingBreakdown } from "../types/product.types";
import { RatingStars } from "./rating-stars";

interface RatingBreakdownProps {
  averageRating: number;
  reviewsCount: number;
  breakdown: RatingBreakdown | null;
}

export function RatingBreakdown({
  averageRating,
  reviewsCount,
  breakdown,
}: RatingBreakdownProps) {
  const total =
    reviewsCount ||
    Object.values(breakdown ?? {}).reduce((sum, count) => sum + count, 0);

  return (
    <div className="grid gap-6 rounded-2xl border p-6 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="text-center sm:text-left">
        <p className="font-heading text-4xl font-semibold">
          {averageRating.toFixed(1)}
        </p>
        <RatingStars
          rating={averageRating}
          className="mt-1 justify-center sm:justify-start"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {reviewsCount} approved {reviewsCount === 1 ? "review" : "reviews"}
        </p>
      </div>

      <div className="space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = breakdown?.[String(star)] ?? 0;
          const percent = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3 text-xs">
              <span className="w-8 text-muted-foreground">{star} star</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-6 text-right text-muted-foreground">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
