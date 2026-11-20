"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, TicketPercent } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { CouponFilters } from "@/features/admin-coupons/components/coupon-filters";
import { CouponTable } from "@/features/admin-coupons/components/coupon-table";
import {
  useAdminCoupons,
  useDeleteCoupon,
  useToggleCouponStatus,
} from "@/features/admin-coupons/hooks/use-admin-coupons";
import type { AdminCoupon } from "@/features/admin-coupons/types/admin-coupon.types";

export default function AdminCouponsPage() {
  return (
    <Suspense
      fallback={<div className="h-72 animate-pulse rounded-lg bg-muted" />}
    >
      <CouponsGate />
    </Suspense>
  );
}

function CouponsGate() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "coupons.view")) {
    return <NoAccess />;
  }

  return <CouponsContent permissions={permissions} />;
}

function CouponsContent({ permissions }: { permissions: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [couponToDelete, setCouponToDelete] = useState<AdminCoupon | null>(null);

  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const search = searchParams.get("search") ?? "";
  const type = searchParams.get("type") ?? "";
  const isActive = searchParams.get("is_active") ?? "";

  const queryParams = useMemo(
    () => ({
      page,
      search: search || undefined,
      type: type || undefined,
      is_active: isActive || undefined,
    }),
    [page, search, type, isActive]
  );

  const couponsQuery = useAdminCoupons(queryParams);
  const toggleStatus = useToggleCouponStatus();
  const deleteCoupon = useDeleteCoupon();

  const canManage = hasPermission(permissions, "coupons.manage");

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    router.replace(`${pathname}?${next.toString()}`);
  };

  const hasFilters = Boolean(search || type || isActive);
  const coupons = couponsQuery.data?.data ?? [];
  const meta = couponsQuery.data?.meta;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Coupons & Discounts
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage percentage and fixed promotional discounts for store checkout.
          </p>
        </div>

        {canManage && (
          <Link
            href="/admin/coupons/new"
            className={buttonVariants({ variant: "default" })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <CouponFilters
        initialSearch={search}
        type={type}
        isActive={isActive}
        hasFilters={hasFilters}
        onSearchSubmit={(val) => updateParams({ search: val || null, page: "1" })}
        onTypeChange={(val) => updateParams({ type: val || null, page: "1" })}
        onStatusChange={(val) => updateParams({ is_active: val || null, page: "1" })}
        onClear={() =>
          router.replace(pathname)
        }
      />

      {/* Coupons Table */}
      {couponsQuery.isLoading ? (
        <div className="h-72 animate-pulse rounded-lg bg-muted" />
      ) : couponsQuery.isError ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-center text-sm text-destructive">
          Failed to load coupons. Please try again.
        </div>
      ) : (
        <>
          <CouponTable
            coupons={coupons}
            canManage={canManage}
            togglingCouponId={toggleStatus.isPending ? (toggleStatus.variables?.id ?? null) : null}
            onDelete={setCouponToDelete}
            onToggleStatus={(coupon) =>
              toggleStatus.mutate({
                id: coupon.id,
                isActive: !coupon.is_active,
              })
            }
          />

          {meta && meta.total > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Showing {meta.from ?? 0}–{meta.to ?? 0} of {meta.total} coupons
                {couponsQuery.isFetching && (
                  <span className="ml-2 text-xs">Updating…</span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateParams({ page: String(page - 1) })}
                  disabled={page <= 1 || couponsQuery.isFetching}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateParams({ page: String(page + 1) })}
                  disabled={page >= meta.last_page || couponsQuery.isFetching}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={couponToDelete !== null}
        title="Delete Coupon"
        description={`Are you sure you want to delete coupon code “${couponToDelete?.code ?? ""}”? This action cannot be undone.`}
        confirmLabel="Delete Coupon"
        isPending={deleteCoupon.isPending}
        onCancel={() => setCouponToDelete(null)}
        onConfirm={() => {
          if (!couponToDelete) return;
          deleteCoupon.mutate(couponToDelete.id, {
            onSettled: () => setCouponToDelete(null),
          });
        }}
      />
    </div>
  );
}
