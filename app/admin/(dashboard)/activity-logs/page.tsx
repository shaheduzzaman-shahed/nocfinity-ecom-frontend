"use client";

import { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Activity } from "lucide-react";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { ActivityLogFiltersBar } from "@/features/admin-activity-logs/components/activity-log-filters";
import { ActivityLogTable } from "@/features/admin-activity-logs/components/activity-log-table";
import {
  useAdminActivityLogs,
  useAdminActivityLogActions,
} from "@/features/admin-activity-logs/hooks/use-admin-activity-logs";

export default function AdminActivityLogsPage() {
  return (
    <Suspense
      fallback={<div className="h-72 animate-pulse rounded-lg bg-muted" />}
    >
      <ActivityLogsGate />
    </Suspense>
  );
}

function ActivityLogsGate() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "activity_logs.view")) {
    return <NoAccess />;
  }

  return <ActivityLogsContent />;
}

function ActivityLogsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const search = searchParams.get("search") ?? "";
  const accountType = searchParams.get("account_type") ?? "";
  const action = searchParams.get("action") ?? "";

  const queryParams = useMemo(
    () => ({
      page,
      search: search || undefined,
      account_type: (accountType as "customer" | "staff" | "") || undefined,
      action: action || undefined,
      per_page: 20,
    }),
    [page, search, accountType, action]
  );

  const { data, isLoading } = useAdminActivityLogs(queryParams);
  const { data: actionsList = [] } = useAdminActivityLogActions();

  function updateQuery(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Activity & Audit Logs
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Review system events, administrative changes, and user activities across the platform.
        </p>
      </div>

      {/* Filter controls */}
      <ActivityLogFiltersBar
        search={search}
        accountType={accountType}
        selectedAction={action}
        actionsList={actionsList}
        onSearchChange={(val) => updateQuery({ search: val, page: "1" })}
        onAccountTypeChange={(val) => updateQuery({ account_type: val, page: "1" })}
        onActionChange={(val) => updateQuery({ action: val, page: "1" })}
        onReset={() => updateQuery({ search: "", account_type: "", action: "", page: "1" })}
      />

      {/* Logs Data Table */}
      <ActivityLogTable
        logs={data?.data ?? []}
        isLoading={isLoading}
        currentPage={data?.meta?.current_page ?? 1}
        lastPage={data?.meta?.last_page ?? 1}
        total={data?.meta?.total ?? 0}
        onPageChange={(p) => updateQuery({ page: String(p) })}
      />
    </div>
  );
}
