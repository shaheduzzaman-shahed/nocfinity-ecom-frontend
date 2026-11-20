"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle,
  Eye,
  Loader2,
  ShieldCheck,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminReviewStatusBadge } from "./admin-review-status-badge";
import { AdminReviewDetailDialog } from "./admin-review-detail-dialog";
import { useUpdateReviewStatus, useDeleteReview } from "../hooks/use-admin-reviews";
import type { AdminReview } from "../types/admin-review.types";

interface AdminReviewTableProps {
  reviews: AdminReview[];
  isLoading: boolean;
  canModerate?: boolean;
  canDelete?: boolean;
}

export function AdminReviewTable({
  reviews,
  isLoading,
  canModerate = true,
  canDelete = true,
}: AdminReviewTableProps) {
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const updateStatusMutation = useUpdateReviewStatus();
  const deleteMutation = useDeleteReview();

  const handleOpenDetail = (review: AdminReview) => {
    setSelectedReview(review);
    setIsDetailOpen(true);
  };

  const handleQuickStatus = (review: AdminReview, status: "approved" | "rejected") => {
    updateStatusMutation.mutate({ id: review.id, status });
  };

  const handleQuickDelete = (review: AdminReview) => {
    if (confirm(`Are you sure you want to permanently delete review #${review.id}?`)) {
      deleteMutation.mutate(review.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-muted/60" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Star className="size-6" />
        </div>
        <h3 className="mt-4 font-heading text-lg font-semibold">No reviews found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          No customer reviews match your selected filter criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b bg-muted/40 text-muted-foreground">
            <tr>
              <th className="py-3 px-4 font-medium">Product</th>
              <th className="py-3 px-4 font-medium">Customer</th>
              <th className="py-3 px-4 font-medium">Rating</th>
              <th className="py-3 px-4 font-medium">Review Snippet</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Date</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-muted/30 transition-colors">
                {/* Product */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                      {review.product.primary_image ? (
                        <Image
                          src={review.product.primary_image}
                          alt={review.product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                          —
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 max-w-[180px]">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {review.product.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Customer & Verification */}
                <td className="py-3 px-4">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-foreground">
                        {review.customer.name}
                      </span>
                      {review.is_verified_purchase && (
                        <span title="Verified Purchase">
                          <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground max-w-[150px]">
                      {review.customer.email}
                    </p>
                  </div>
                </td>

                {/* Rating */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`size-3 ${
                            star <= review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {review.rating}
                    </span>
                  </div>
                </td>

                {/* Review Snippet */}
                <td className="py-3 px-4">
                  <div
                    onClick={() => handleOpenDetail(review)}
                    className="cursor-pointer group max-w-[280px]"
                  >
                    {review.title && (
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary truncate">
                        {review.title}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {review.comment}
                    </p>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="py-3 px-4">
                  <AdminReviewStatusBadge status={review.status} />
                </td>

                {/* Date */}
                <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(review.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDetail(review)}
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                      title="View Details"
                    >
                      <Eye className="size-3.5 mr-1" />
                      View
                    </Button>

                    {canModerate && review.status !== "approved" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => handleQuickStatus(review, "approved")}
                        className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        title="Approve Review"
                      >
                        <CheckCircle className="size-3.5 mr-1" />
                        Approve
                      </Button>
                    )}

                    {canModerate && review.status !== "rejected" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => handleQuickStatus(review, "rejected")}
                        className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Reject Review"
                      >
                        <XCircle className="size-3.5 mr-1" />
                        Reject
                      </Button>
                    )}

                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deleteMutation.isPending}
                        onClick={() => handleQuickDelete(review)}
                        className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                        title="Delete Review"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminReviewDetailDialog
        review={selectedReview}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        canModerate={canModerate}
        canDelete={canDelete}
      />
    </>
  );
}
