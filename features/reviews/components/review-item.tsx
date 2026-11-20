import { CheckCircle2, Edit2, Trash2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/features/products/components/rating-stars";
import type { ProductReview } from "../types/review.types";

interface ReviewItemProps {
  review: ProductReview;
  isOwner?: boolean;
  onEdit?: (review: ProductReview) => void;
  onDelete?: (review: ProductReview) => void;
}

export function ReviewItem({
  review,
  isOwner = false,
  onEdit,
  onDelete,
}: ReviewItemProps) {
  const formattedDate = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl border bg-card p-5 sm:p-6 transition-all hover:border-border/80">
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Left: Author & Stars */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm text-foreground">
              {review.user?.name || "Verified Customer"}
            </span>

            {review.is_verified_purchase && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                <CheckCircle2 className="size-3" />
                Verified Purchase
              </span>
            )}

            {/* Moderation status badge if owner and not approved */}
            {isOwner && review.status === "pending" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
                <Clock className="size-3" />
                Pending Moderation
              </span>
            )}

            {isOwner && review.status === "rejected" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                <AlertCircle className="size-3" />
                Rejected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <RatingStars rating={review.rating} />
            <span className="text-xs text-muted-foreground">• {formattedDate}</span>
          </div>
        </div>

        {/* Right: Actions for owner */}
        {isOwner && (onEdit || onDelete) && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(review)}
                title="Edit review"
              >
                <Edit2 className="size-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(review)}
                title="Delete review"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Title & Comment */}
      <div className="mt-3.5 space-y-1.5">
        {review.title && (
          <h4 className="font-semibold text-sm text-foreground tracking-tight">
            {review.title}
          </h4>
        )}
        <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
          {review.comment}
        </p>
      </div>
    </div>
  );
}
