"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  Eye,
  Loader2,
  ShieldCheck,
  Star,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { AdminReviewStatusBadge } from "./admin-review-status-badge";
import {
  useUpdateReviewStatus,
  useDeleteReview,
} from "../hooks/use-admin-reviews";
import type { AdminReview } from "../types/admin-review.types";

interface AdminReviewDetailDialogProps {
  review: AdminReview | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canModerate?: boolean;
  canDelete?: boolean;
}

export function AdminReviewDetailDialog(props: AdminReviewDetailDialogProps) {
  if (!props.open || !props.review) return null;
  return (
    <AdminReviewDetailDialogContent
      key={props.review.id}
      {...props}
      review={props.review}
    />
  );
}

function AdminReviewDetailDialogContent({
  review,
  onOpenChange,
  canModerate = true,
  canDelete = true,
}: AdminReviewDetailDialogProps & { review: AdminReview }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const updateStatusMutation = useUpdateReviewStatus();
  const deleteMutation = useDeleteReview();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !updateStatusMutation.isPending &&
        !deleteMutation.isPending
      ) {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [updateStatusMutation.isPending, deleteMutation.isPending, onOpenChange]);

  const handleStatusChange = (status: "approved" | "rejected") => {
    updateStatusMutation.mutate(
      { id: review.id, status },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(review.id, {
      onSuccess: () => {
        setConfirmDelete(false);
        onOpenChange(false);
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs"
      role="presentation"
      onClick={() => {
        if (!updateStatusMutation.isPending && !deleteMutation.isPending) {
          onOpenChange(false);
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-detail-dialog-title"
        className="w-full max-w-xl rounded-2xl border bg-background p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2
                id="review-detail-dialog-title"
                className="font-heading text-lg font-bold text-foreground"
              >
                Review Moderation
              </h2>
              <AdminReviewStatusBadge status={review.status} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Review ID #{review.id} • Submitted on{" "}
              {new Date(review.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="size-8 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Product Info */}
        <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
            {review.product.primary_image ? (
              <Image
                src={review.product.primary_image}
                alt={review.product.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                No img
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-muted-foreground uppercase font-medium">Product</p>
            <h4 className="truncate text-sm font-semibold text-foreground">
              {review.product.name}
            </h4>
          </div>
          {review.product.slug && (
            <Link
              href={`/products/${review.product.slug}`}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "ghost", size: "sm", className: "h-8 text-xs" })}
            >
              <Eye className="mr-1.5 size-3.5" />
              View
            </Link>
          )}
        </div>

        {/* Customer & Verification */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border p-3">
            <span className="text-muted-foreground">Customer</span>
            <p className="font-semibold text-foreground mt-0.5">{review.customer.name}</p>
            <p className="text-muted-foreground truncate">{review.customer.email}</p>
          </div>
          <div className="rounded-xl border p-3">
            <span className="text-muted-foreground">Purchase Verification</span>
            <div className="mt-1 flex items-center gap-1.5">
              {review.is_verified_purchase ? (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-4" />
                  Verified Buyer
                </span>
              ) : (
                <span className="text-muted-foreground">Unverified Purchase</span>
              )}
            </div>
            {review.order_number && (
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Order: {review.order_number}
              </p>
            )}
          </div>
        </div>

        {/* Rating Stars & Comment */}
        <div className="space-y-2 rounded-xl border p-4 bg-muted/10">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`size-4 ${
                    star <= review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-foreground">
              {review.rating} / 5
            </span>
          </div>

          {review.title && (
            <h4 className="font-heading text-sm font-bold text-foreground pt-1">
              {review.title}
            </h4>
          )}

          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground pt-1">
            {review.comment}
          </p>
        </div>

        {/* Confirmation Prompt for Deletion */}
        {confirmDelete && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-xs">
            <p className="font-semibold text-destructive">
              Are you sure you want to permanently delete this review?
            </p>
            <p className="mt-1 text-muted-foreground">
              This action cannot be undone. Product rating scores will be recalculated immediately.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
                className="h-8 text-xs"
              >
                {deleteMutation.isPending && (
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                )}
                Confirm Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmDelete(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
          <div>
            {canDelete && !confirmDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(true)}
                className="h-9 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="mr-1.5 size-3.5" />
                Delete
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {canModerate && review.status !== "rejected" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={updateStatusMutation.isPending}
                onClick={() => handleStatusChange("rejected")}
                className="h-9 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30"
              >
                {updateStatusMutation.isPending ? (
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                ) : (
                  <XCircle className="mr-1.5 size-3.5" />
                )}
                Reject
              </Button>
            )}

            {canModerate && review.status !== "approved" && (
              <Button
                type="button"
                size="sm"
                disabled={updateStatusMutation.isPending}
                onClick={() => handleStatusChange("approved")}
                className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {updateStatusMutation.isPending ? (
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                ) : (
                  <CheckCircle className="mr-1.5 size-3.5" />
                )}
                Approve
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 text-xs"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
