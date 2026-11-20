"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { ShippingForm } from "@/features/admin-shipping/components/shipping-form";
import {
  useAdminShippingSettings,
  useUpdateShippingSettings,
} from "@/features/admin-shipping/hooks/use-admin-shipping";
import { ApiError } from "@/lib/api/error";

export default function ShippingSettingsPage() {
  return (
    <Suspense
      fallback={<div className="h-72 animate-pulse rounded-lg bg-muted" />}
    >
      <ShippingGate />
    </Suspense>
  );
}

function ShippingGate() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "shipping.view")) {
    return <NoAccess />;
  }

  return (
    <ShippingContent canManage={hasPermission(permissions, "shipping.manage")} />
  );
}

function ShippingContent({ canManage }: { canManage: boolean }) {
  const shippingQuery = useAdminShippingSettings();
  const updateSettings = useUpdateShippingSettings();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]> | undefined>();

  if (shippingQuery.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-80 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (shippingQuery.isError || !shippingQuery.data) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
        Failed to load shipping configuration. Please refresh and try again.
      </div>
    );
  }

  const settings = shippingQuery.data;

  const handleSubmit = (values: {
    shipping_fee: number;
    shipping_enabled: boolean;
  }) => {
    setServerErrors(undefined);
    updateSettings.mutate(values, {
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
        <span className="text-muted-foreground">Settings</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Shipping</span>
      </nav>

      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Shipping Configuration
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your store delivery fees and free shipping options.
        </p>
      </div>

      <ShippingForm
        settings={settings}
        canManage={canManage}
        isSubmitting={updateSettings.isPending}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
