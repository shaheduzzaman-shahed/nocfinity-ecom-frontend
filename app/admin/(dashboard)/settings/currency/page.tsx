"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { CurrencyForm } from "@/features/admin-currency/components/currency-form";
import {
  useAdminCurrencySettings,
  useUpdateCurrencySettings,
} from "@/features/admin-currency/hooks/use-admin-currency";
import { ApiError } from "@/lib/api/error";

export default function CurrencySettingsPage() {
  return (
    <Suspense
      fallback={<div className="h-72 animate-pulse rounded-lg bg-muted" />}
    >
      <CurrencyGate />
    </Suspense>
  );
}

function CurrencyGate() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "currency.view")) {
    return <NoAccess />;
  }

  return (
    <CurrencyContent canManage={hasPermission(permissions, "currency.manage")} />
  );
}

function CurrencyContent({ canManage }: { canManage: boolean }) {
  const currencyQuery = useAdminCurrencySettings();
  const updateSettings = useUpdateCurrencySettings();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]> | undefined>();

  if (currencyQuery.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-80 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (currencyQuery.isError || !currencyQuery.data) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
        Failed to load currency configuration. Please refresh and try again.
      </div>
    );
  }

  const settings = currencyQuery.data;

  const handleSubmit = (values: { currency: string }) => {
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
        <span className="text-foreground font-medium">Currency</span>
      </nav>

      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Currency Configuration
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your store operating currency and Stripe payment presentment.
        </p>
      </div>

      <CurrencyForm
        settings={settings}
        canManage={canManage}
        isSubmitting={updateSettings.isPending}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
