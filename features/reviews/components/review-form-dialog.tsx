"use client";

import { useEffect, useState } from "react";
import { Star, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "cn";
import type { ProductReview, ReviewPayload } from "../types/review.types";

interface ReviewFormDialogProps {
  open: boolean;
  initialReview?: ProductReview | null;
  productName: string;
  isPending: boolean;
  onSubmit: (payload: ReviewPayload) => void;
  onCancel: () => void;
}

export function ReviewFormDialog(props: ReviewFormDialogProps) {
  if (!props.open) return null;
  return (
    <ReviewFormDialogContent
      key={props.initialReview?.id ?? "new"}
      {...props}
    />
  );
}

function ReviewFormDialogContent({
  initialReview,
  productName,
  isPending,
  onSubmit,
  onCancel,
}: ReviewFormDialogProps) {
  const [rating, setRating] = useState<number>(initialReview?.rating ?? 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState(initialReview?.title ?? "");
  const [comment, setComment] = useState(initialReview?.comment ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPending, onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      setError("Please select a star rating between 1 and 5.");
      return;
    }

    if (comment.trim().length < 3) {
      setError("Please provide a review comment of at least 3 characters.");
      return;
    }

    if (comment.trim().length > 2000) {
      setError("Review comment cannot exceed 2000 characters.");
      return;
    }

    setError(null);
    onSubmit({
      rating,
      title: title.trim() || undefined,
      comment: comment.trim(),
    });
  };

  const isEditing = Boolean(initialReview);
  const activeRating = hoverRating ?? rating;

  const ratingLabels: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs"
      role="presentation"
      onClick={() => {
        if (!isPending) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-form-title"
        className="w-full max-w-lg rounded-2xl border bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b pb-4">
          <h2 id="review-form-title" className="font-heading text-lg font-bold text-foreground">
            {isEditing ? "Edit Your Review" : "Write a Product Review"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground truncate">
            Sharing your experience for <span className="font-medium text-foreground">{productName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Star Rating Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Overall Rating <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(null)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className="p-1 text-muted-foreground transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`Rate ${star} out of 5 stars`}
                  >
                    <Star
                      className={cn(
                        "size-6 transition-colors",
                        star <= activeRating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-transparent text-muted-foreground/30"
                      )}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-medium text-foreground">
                {ratingLabels[activeRating] || `${activeRating} stars`}
              </span>
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <Label htmlFor="review-title" className="text-xs font-medium text-foreground">
              Review Title (optional)
            </Label>
            <Input
              id="review-title"
              placeholder="e.g., Great quality and true to size!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              maxLength={255}
              className="text-sm"
            />
          </div>

          {/* Comment Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="review-comment" className="text-xs font-medium text-foreground">
                Review Comment <span className="text-destructive">*</span>
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {comment.length} / 2000
              </span>
            </div>
            <textarea
              id="review-comment"
              rows={4}
              placeholder="Describe the fit, material quality, and how it feels..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isPending}
              maxLength={2000}
              required
              className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-xs font-medium text-destructive">{error}</p>
          )}

          {/* Moderation notice */}
          <div className="flex items-start gap-2 rounded-xl border bg-muted/30 p-3 text-xs text-muted-foreground">
            <Info className="size-4 shrink-0 text-muted-foreground mt-0.5" />
            <span>
              All reviews are subject to moderation to protect community standards. New and edited reviews appear publicly once approved by store staff.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
