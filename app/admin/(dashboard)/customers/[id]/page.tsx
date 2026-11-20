"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  User,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import { useAdminCustomer } from "@/features/admin-customers/hooks/use-admin-customers";
import { AdminCustomerOrderHistory } from "@/features/admin-customers/components/admin-customer-order-history";

interface AdminCustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminCustomerDetailPage({
  params,
}: AdminCustomerDetailPageProps) {
  const resolvedParams = use(params);
  const customerId = resolvedParams.id;

  const { permissions, isLoading: permissionsLoading } = useAdminPermissions();

  if (permissionsLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (!hasPermission(permissions, "customers.view")) {
    return <NoAccess />;
  }

  return <CustomerDetailContent customerId={customerId} />;
}

function CustomerDetailContent({ customerId }: { customerId: string }) {
  const [orderPage, setOrderPage] = useState(1);
  const { data: customer, isLoading, isError, error } = useAdminCustomer(customerId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/customers"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Customers
        </Link>
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
          Customer not found or failed to load.{" "}
          {error instanceof Error ? error.message : ""}
        </div>
      </div>
    );
  }

  const initials = customer.name
    ? customer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const addresses = customer.shipping_addresses ?? [];

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/customers"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "gap-1.5 text-xs text-muted-foreground hover:text-foreground",
          })}
        >
          <ArrowLeft className="size-3.5" />
          Back to Customers
        </Link>

        <span className="text-xs text-muted-foreground">
          Customer ID #{customer.id}
        </span>
      </div>

      {/* Customer Profile Card */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                  {customer.name}
                </h1>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Customer Account
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Mail className="size-3.5" />
                  {customer.email}
                </span>
                {customer.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="size-3.5" />
                    {customer.phone}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  Member since{" "}
                  {new Date(customer.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Orders</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShoppingBag className="size-4" />
            </div>
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-foreground">
            {customer.orders_count}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Lifetime orders placed
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Spent</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="size-4" />
            </div>
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-foreground">
            ${customer.total_spent.toFixed(2)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Completed paid purchases
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Saved Addresses</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <MapPin className="size-4" />
            </div>
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-foreground">
            {addresses.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Shipping destinations
          </p>
        </div>
      </div>

      {/* Main Content: Orders History (Left 2 cols) & Addresses (Right 1 col) */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Order History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-foreground">
              Order History
            </h3>
            <span className="text-xs text-muted-foreground">
              {customer.orders_count} {customer.orders_count === 1 ? "order" : "orders"}
            </span>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <AdminCustomerOrderHistory
              customerId={customer.id}
              page={orderPage}
              onPageChange={setOrderPage}
            />
          </div>
        </div>

        {/* Saved Shipping Addresses */}
        <div className="space-y-3">
          <h3 className="font-heading text-base font-bold text-foreground">
            Shipping Addresses
          </h3>

          {addresses.length === 0 ? (
            <div className="rounded-xl border bg-card p-6 text-center text-xs text-muted-foreground shadow-sm">
              <MapPin className="mx-auto size-6 text-muted-foreground/40 mb-2" />
              No shipping addresses saved yet.
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-xl border bg-card p-4 shadow-sm space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      {address.name}
                    </span>
                    {address.is_default && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{address.address}</p>
                  <p className="text-muted-foreground">
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  <p className="text-muted-foreground uppercase font-medium text-[11px]">
                    {address.country}
                  </p>
                  {address.phone && (
                    <p className="text-[11px] text-muted-foreground pt-1 border-t mt-2">
                      Tel: {address.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
