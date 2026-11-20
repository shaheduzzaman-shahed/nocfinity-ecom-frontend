"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { CouponForm } from "@/features/admin-coupons/components/coupon-form";
import {
  useAdminCoupon,
  useUpdateCoupon,
} from "@/features/admin-coupons/hooks/use-admin-coupons";
import type { CouponPayload } from "@/features/admin-coupons/types/admin-coupon.types";
import { ApiError } from "@/lib/api/error";

export default function EditCouponPage() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "coupons.manage")) {
    return <NoAccess />;
  }

  return <EditCouponContent />;
}

function EditCouponContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const couponId = Number(params.id);
  const validCouponId = Number.isInteger(couponId) ? couponId : null;

  const couponQuery = useAdminCoupon(validCouponId ?? 0);
  const updateCoupon = useUpdateCoupon(validCouponId ?? 0);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]> | undefined>();

  const backLink = (
    <Link
      href="/admin/coupons"
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to coupons
    </Link>
  );

  if (!validCouponId) {
    return (
      <div className="space-y-4">
        {backLink}
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
          Invalid coupon ID.
        </div>
      </div>
    );
  }

  if (couponQuery.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {backLink}
        <div className="h-72 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (couponQuery.isError || !couponQuery.data) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {backLink}
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
          Coupon not found or failed to load.
        </div>
      </div>
    );
  }

  const coupon = couponQuery.data;

  const handleSubmit = (payload: CouponPayload) => {
    setServerErrors(undefined);
    updateCoupon.mutate(payload, {
      onSuccess: () => {
        router.push("/admin/coupons");
      },
      onError: (error) => {
        if (error instanceof ApiError && error.isValidation) {
          setServerErrors(error.errors);
        }
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/admin/coupons" className="hover:text-foreground">
          Coupons
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Edit Coupon</span>
      </nav>

      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Edit Coupon: {coupon.code}
        </h1>
        <p className="text-sm text-muted-foreground">
          Update discount rate, rules, limits, or validity period.
        </p>
      </div>

      <CouponForm
        defaultValues={{
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          min_order_amount: coupon.min_order_amount,
          usage_limit: coupon.usage_limit,
          valid_from: coupon.valid_from,
          valid_until: coupon.valid_until,
          is_active: coupon.is_active,
        }}
        submitLabel="Save Changes"
        isSubmitting={updateCoupon.isPending}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
