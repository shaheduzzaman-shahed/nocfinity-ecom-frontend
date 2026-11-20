"use client";

import { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { AdminReviewFilters } from "@/features/admin-reviews/components/admin-review-filters";
import { AdminReviewTable } from "@/features/admin-reviews/components/admin-review-table";
import { useAdminReviews } from "@/features/admin-reviews/hooks/use-admin-reviews";
import type { AdminReviewStatus } from "@/features/admin-reviews/types/admin-review.types";

export default function AdminReviewsPage() {
  return (
    <Suspense
      fallback={<div className="h-72 animate-pulse rounded-lg bg-muted" />}
    >
      <ReviewsGate />
    </Suspense>
  );
}

function ReviewsGate() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "reviews.view")) {
    return <NoAccess />;
  }

  return <ReviewsContent permissions={permissions} />;
}

function ReviewsContent({ permissions }: { permissions: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") as AdminReviewStatus | "") ?? "";
  const rating = searchParams.get("rating") ?? "";

  const queryParams = useMemo(
    () => ({
      page,
      search: search || undefined,
      status: (status || "all") as AdminReviewStatus | "all",
      rating: rating ? (Number(rating) as number) : ("all" as const),
      per_page: 15,
    }),
    [page, search, status, rating]
  );

  const { data, isLoading, isError, error } = useAdminReviews(queryParams);

  const canModerate = hasPermission(permissions, "reviews.manage");
  const canDelete = hasPermission(permissions, "reviews.delete");

  function updateQuery(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (!val) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
  }

  const reviews = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? reviews.length;
  const lastPage = meta?.last_page ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Star className="size-5 text-amber-500" />
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Customer Reviews
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Moderate customer ratings and reviews across your product catalog.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <AdminReviewFilters
          search={search}
          status={status}
          rating={rating}
          onSearchChange={(val) => updateQuery({ search: val, page: "1" })}
          onStatusChange={(val) => updateQuery({ status: val, page: "1" })}
          onRatingChange={(val) => updateQuery({ rating: val, page: "1" })}
          onReset={() =>
            router.replace(pathname)
          }
        />
      </div>

      {/* Table Container */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {isError ? (
          <div className="p-8 text-center text-sm text-destructive">
            Failed to load reviews.{" "}
            {error instanceof Error ? error.message : "Please try again."}
          </div>
        ) : (
          <>
            <AdminReviewTable
              reviews={reviews}
              isLoading={isLoading}
              canModerate={canModerate}
              canDelete={canDelete}
            />

            {/* Pagination Controls */}
            {!isLoading && reviews.length > 0 && (
              <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {(page - 1) * 15 + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-foreground">
                    {Math.min(page * 15, total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">{total}</span>{" "}
                  reviews
                </p>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => updateQuery({ page: String(page - 1) })}
                    className="h-8 gap-1 text-xs"
                  >
                    <ChevronLeft className="size-3.5" />
                    Previous
                  </Button>
                  <span className="px-2 text-xs font-medium text-muted-foreground">
                    Page {page} of {lastPage}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= lastPage}
                    onClick={() => updateQuery({ page: String(page + 1) })}
                    className="h-8 gap-1 text-xs"
                  >
                    Next
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
