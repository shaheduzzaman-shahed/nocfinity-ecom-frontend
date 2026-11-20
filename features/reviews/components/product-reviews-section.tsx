"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, MessageSquarePlus, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { RatingBreakdown } from "@/features/products/components/rating-breakdown";
import { useAuthStore } from "@/stores/auth.store";
import {
  useProductReviews,
  useSubmitReview,
  useUpdateReview,
  useDeleteReview,
} from "../hooks/use-reviews";
import { ReviewItem } from "./review-item";
import { ReviewFormDialog } from "./review-form-dialog";
import type {
  ProductReview,
  ReviewPayload,
  ReviewListParams,
} from "../types/review.types";

interface ProductReviewsSectionProps {
  productId: number;
  productName: string;
}

export function ProductReviewsSection({
  productId,
  productName,
}: ProductReviewsSectionProps) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<ReviewListParams["sort"]>("newest");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ProductReview | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useProductReviews(productId, {
    page,
    sort,
    per_page: 5,
  });

  const submitMutation = useSubmitReview(productId);
  const updateMutation = useUpdateReview(productId);
  const deleteMutation = useDeleteReview(productId);

  const reviews = data?.data ?? [];
  const meta = data?.meta;
  const aggregate = data?.aggregate;
  const userReview = data?.user_review;

  const handleFormSubmit = (payload: ReviewPayload) => {
    if (editingReview) {
      updateMutation.mutate(
        { reviewId: editingReview.id, payload },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingReview(null);
          },
        }
      );
    } else {
      submitMutation.mutate(payload, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingReviewId) return;

    deleteMutation.mutate(deletingReviewId, {
      onSuccess: () => {
        setDeletingReviewId(null);
      },
    });
  };

  // Convert distribution to string-indexed object for RatingBreakdown
  const breakdownObject = aggregate?.rating_distribution
    ? Object.fromEntries(
        Object.entries(aggregate.rating_distribution).map(([k, v]) => [k, Number(v)])
      )
    : null;

  return (
    <section id="reviews" className="mt-16 scroll-mt-24 lg:mt-20">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Customer Feedback
          </p>
          <h2 className="mt-1.5 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Reviews & Ratings
          </h2>
        </div>

        {/* Action Button */}
        <div>
          {!isAuthenticated ? (
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "gap-1.5 text-xs font-medium",
              })}
            >
              Sign in to write a review
            </Link>
          ) : userReview ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingReview(userReview);
                setIsFormOpen(true);
              }}
              className="gap-1.5 text-xs font-medium"
            >
              Edit Your Review
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setEditingReview(null);
                setIsFormOpen(true);
              }}
              className="gap-1.5 text-xs font-medium"
            >
              <MessageSquarePlus className="size-3.5" />
              Write a Review
            </Button>
          )}
        </div>
      </div>

      {/* Aggregate Score & Distribution Breakdown */}
      <div className="mt-8">
        <RatingBreakdown
          averageRating={aggregate?.average_rating ?? 0}
          reviewsCount={aggregate?.total_reviews ?? 0}
          breakdown={breakdownObject}
        />
      </div>

      {/* Current Customer's Existing Review Banner */}
      {userReview && (
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold text-foreground">
              Your Review
            </h3>
            <span className="text-xs text-muted-foreground">
              {userReview.status === "approved"
                ? "Published on storefront"
                : "Awaiting staff approval"}
            </span>
          </div>
          <ReviewItem
            review={userReview}
            isOwner
            onEdit={(r) => {
              setEditingReview(r);
              setIsFormOpen(true);
            }}
            onDelete={(r) => setDeletingReviewId(r.id)}
          />
        </div>
      )}

      {/* Reviews Feed Section */}
      <div className="mt-10 space-y-6">
        {/* Controls Bar: Count & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <h3 className="font-heading text-base font-semibold text-foreground">
            Approved Community Reviews ({aggregate?.total_reviews ?? 0})
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpDown className="size-3" />
              Sort:
            </span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as ReviewListParams["sort"]);
                setPage(1);
              }}
              className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="newest">Newest First</option>
              <option value="highest_rating">Highest Rating</option>
              <option value="lowest_rating">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 w-full animate-pulse rounded-2xl border bg-muted/30"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && reviews.length === 0 && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="font-medium text-foreground">No approved reviews yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to share your experience with this piece!
            </p>
          </div>
        )}

        {/* Review Cards List */}
        {!isLoading && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review) => {
              const isOwner = Boolean(user && user.id === review.user?.id);

              return (
                <ReviewItem
                  key={review.id}
                  review={review}
                  isOwner={isOwner}
                  onEdit={
                    isOwner
                      ? (r) => {
                          setEditingReview(r);
                          setIsFormOpen(true);
                        }
                      : undefined
                  }
                  onDelete={
                    isOwner
                      ? (r) => setDeletingReviewId(r.id)
                      : undefined
                  }
                />
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Page <span className="font-medium text-foreground">{meta.current_page}</span> of{" "}
              <span className="font-medium text-foreground">{meta.last_page}</span>
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={meta.current_page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 gap-1 text-xs"
              >
                <ChevronLeft className="size-3.5" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                className="h-8 gap-1 text-xs"
              >
                Next
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Review Submission & Edit Dialog */}
      <ReviewFormDialog
        open={isFormOpen}
        initialReview={editingReview}
        productName={productName}
        isPending={submitMutation.isPending || updateMutation.isPending}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingReview(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deletingReviewId)}
        title="Delete Review"
        description="Are you sure you want to delete your review? This action cannot be undone."
        confirmLabel="Delete Review"
        cancelLabel="Keep Review"
        isPending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingReviewId(null)}
      />
    </section>
  );
}
