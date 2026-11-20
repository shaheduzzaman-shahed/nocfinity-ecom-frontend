"use client";

import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { AdminOrderFilters } from "@/features/admin-orders/components/admin-order-filters";
import { AdminOrderTable } from "@/features/admin-orders/components/admin-order-table";
import { AdminOrderStatusDialog } from "@/features/admin-orders/components/admin-order-status-dialog";
import {
  useAdminOrders,
  useUpdateOrderStatus,
} from "@/features/admin-orders/hooks/use-admin-orders";
import type {
  AdminOrder,
  AdminOrderStatus,
} from "@/features/admin-orders/types/admin-order.types";

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={<div className="h-72 animate-pulse rounded-lg bg-muted" />}
    >
      <OrdersGate />
    </Suspense>
  );
}

function OrdersGate() {
  const { permissions, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "orders.view")) {
    return <NoAccess />;
  }

  return <OrdersContent permissions={permissions} />;
}

function OrdersContent({ permissions }: { permissions: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTransition, setActiveTransition] = useState<{
    order: AdminOrder;
    target: AdminOrderStatus;
  } | null>(null);

  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const paymentStatus = searchParams.get("payment_status") ?? "";

  const queryParams = useMemo(
    () => ({
      page,
      search: search || undefined,
      status: status || undefined,
      payment_status: paymentStatus || undefined,
      per_page: 15,
    }),
    [page, search, status, paymentStatus]
  );

  const { data, isLoading, isError, error } = useAdminOrders(queryParams);
  const updateStatusMutation = useUpdateOrderStatus();

  const canUpdateStatus = hasPermission(permissions, "orders.update_status");

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

  const handleConfirmTransition = (payload: {
    status: string;
    note?: string;
    reason?: string;
  }) => {
    if (!activeTransition) return;

    updateStatusMutation.mutate(
      {
        id: activeTransition.order.id,
        payload,
      },
      {
        onSuccess: () => {
          setActiveTransition(null);
        },
      }
    );
  };

  const orders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Orders
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor incoming purchases, track status transitions, and manage order fulfillment.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <AdminOrderFilters
        search={search}
        status={status}
        paymentStatus={paymentStatus}
        onSearchChange={(val) => updateQuery({ search: val, page: "1" })}
        onStatusChange={(val) => updateQuery({ status: val, page: "1" })}
        onPaymentStatusChange={(val) =>
          updateQuery({ payment_status: val, page: "1" })
        }
        onReset={() =>
          updateQuery({
            search: undefined,
            status: undefined,
            payment_status: undefined,
            page: "1",
          })
        }
      />

      {/* Orders Table */}
      <AdminOrderTable
        orders={orders}
        isLoading={isLoading}
        canUpdateStatus={canUpdateStatus}
        onSelectTransition={(order, target) =>
          setActiveTransition({ order, target })
        }
      />

      {/* Pagination Controls */}
      {!isLoading && meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{meta.from ?? 0}</span> to{" "}
            <span className="font-medium text-foreground">{meta.to ?? 0}</span> of{" "}
            <span className="font-medium text-foreground">{meta.total}</span> orders
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.current_page <= 1}
              onClick={() => updateQuery({ page: String(meta.current_page - 1) })}
              className="h-8 gap-1 text-xs"
            >
              <ChevronLeft className="size-3.5" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => updateQuery({ page: String(meta.current_page + 1) })}
              className="h-8 gap-1 text-xs"
            >
              Next
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Status Transition Dialog */}
      <AdminOrderStatusDialog
        order={activeTransition?.order ?? null}
        targetStatus={activeTransition?.target ?? null}
        open={Boolean(activeTransition)}
        isPending={updateStatusMutation.isPending}
        onConfirm={handleConfirmTransition}
        onCancel={() => setActiveTransition(null)}
      />
    </div>
  );
}
