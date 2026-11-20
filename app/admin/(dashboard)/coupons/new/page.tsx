"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { CouponForm } from "@/features/admin-coupons/components/coupon-form";
import { useCreateCoupon } from "@/features/admin-coupons/hooks/use-admin-coupons";
import type { CouponPayload } from "@/features/admin-coupons/types/admin-coupon.types";
import { ApiError } from "@/lib/api/error";
import { useState } from "react";

export default function NewCouponPage() {
  const router = useRouter();
  const { permissions, isLoading } = useAdminPermissions();
  const createCoupon = useCreateCoupon();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]> | undefined>();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "coupons.manage")) {
    return <NoAccess />;
  }

  const handleSubmit = (payload: CouponPayload) => {
    setServerErrors(undefined);
    createCoupon.mutate(payload, {
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
        <span className="text-foreground">New Coupon</span>
      </nav>

      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Create New Coupon
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure discount percentage or fixed savings with optional limits.
        </p>
      </div>

      <CouponForm
        submitLabel="Create Coupon"
        isSubmitting={createCoupon.isPending}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
