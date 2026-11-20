"use client";

import { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { AdminCustomerFilters } from "@/features/admin-customers/components/admin-customer-filters";
import { AdminCustomerTable } from "@/features/admin-customers/components/admin-customer-table";
import { useAdminCustomers } from "@/features/admin-customers/hooks/use-admin-customers";

export default function AdminCustomersPage() {
  return (
    <Suspense
      fallback={<div className="h-72 animate-pulse rounded-lg bg-muted" />}
    >
      <CustomersGate />
    </Suspense>
  );
}

function CustomersGate() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "customers.view")) {
    return <NoAccess />;
  }

  return <CustomersContent />;
}

function CustomersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const search = searchParams.get("search") ?? "";
  const sortBy = searchParams.get("sort_by") ?? "created_at";

  const queryParams = useMemo(
    () => ({
      page,
      search: search || undefined,
      sort_by: sortBy as "created_at" | "name" | "orders_count" | "total_spent",
      sort_order: (sortBy === "name" ? "asc" : "desc") as "asc" | "desc",
      per_page: 15,
    }),
    [page, search, sortBy]
  );

  const { data, isLoading, isError, error } = useAdminCustomers(queryParams);

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

  const customers = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? customers.length;
  const lastPage = meta?.last_page ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Customer Accounts
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            View registered customer profiles, purchase activity, and order records.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <AdminCustomerFilters
          search={search}
          sortBy={sortBy}
          onSearchChange={(val) => updateQuery({ search: val, page: "1" })}
          onSortChange={(val) => updateQuery({ sort_by: val, page: "1" })}
          onReset={() => router.replace(pathname)}
        />
      </div>

      {/* Table Container */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {isError ? (
          <div className="p-8 text-center text-sm text-destructive">
            Failed to load customers.{" "}
            {error instanceof Error ? error.message : "Please try again."}
          </div>
        ) : (
          <>
            <AdminCustomerTable customers={customers} isLoading={isLoading} />

            {/* Pagination Controls */}
            {!isLoading && customers.length > 0 && (
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
                  customers
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
