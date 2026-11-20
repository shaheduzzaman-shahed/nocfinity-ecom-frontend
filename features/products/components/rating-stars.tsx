import { Star } from "lucide-react";
import { cn } from "cn";

interface RatingStarsProps {
  rating: number;
  count?: number;
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  count,
  showValue = false,
  className,
}: RatingStarsProps) {
  const filled = Math.round(rating);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              "h-3.5 w-3.5",
              index < filled
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/40"
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-medium">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">
          ({count} {count === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
}
