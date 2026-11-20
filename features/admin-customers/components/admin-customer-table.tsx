"use client";

import Link from "next/link";
import { Eye, Mail, Phone, ShoppingBag, User } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { AdminCustomer } from "../types/admin-customer.types";

interface AdminCustomerTableProps {
  customers: AdminCustomer[];
  isLoading: boolean;
}

export function AdminCustomerTable({
  customers,
  isLoading,
}: AdminCustomerTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-muted/60" />
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <User className="size-6" />
        </div>
        <h3 className="mt-4 font-heading text-lg font-semibold">No customers found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          No registered customers match your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="border-b bg-muted/40 text-muted-foreground">
          <tr>
            <th className="py-3 px-4 font-medium">Customer</th>
            <th className="py-3 px-4 font-medium">Contact</th>
            <th className="py-3 px-4 font-medium">Orders</th>
            <th className="py-3 px-4 font-medium">Total Spent</th>
            <th className="py-3 px-4 font-medium">Joined</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {customers.map((customer) => {
            const initials = customer.name
              ? customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "U";

            return (
              <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                {/* Customer Avatar & Name */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary">
                      {initials}
                    </div>
                    <div>
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="font-semibold text-foreground hover:underline text-xs"
                      >
                        {customer.name}
                      </Link>
                      <p className="text-[11px] text-muted-foreground">
                        Customer #{customer.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Contact (Email + Phone) */}
                <td className="py-3 px-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="size-3 shrink-0" />
                      <span className="truncate max-w-[200px] text-foreground">
                        {customer.email}
                      </span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Phone className="size-3 shrink-0" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Orders Count */}
                <td className="py-3 px-4">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">
                    <ShoppingBag className="size-3 text-muted-foreground" />
                    <span>{customer.orders_count}</span>
                  </div>
                </td>

                {/* Total Spent */}
                <td className="py-3 px-4 font-semibold text-foreground">
                  ${customer.total_spent.toFixed(2)}
                </td>

                {/* Registration Date */}
                <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                  {new Date(customer.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "h-8 px-2 text-xs text-muted-foreground hover:text-foreground",
                    })}
                  >
                    <Eye className="mr-1 size-3.5" />
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
