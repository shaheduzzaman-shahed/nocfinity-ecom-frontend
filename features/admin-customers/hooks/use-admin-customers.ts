"use client";

import { useQuery } from "@tanstack/react-query";
import { adminCustomersApi } from "../api/admin-customers.api";
import type { AdminCustomerFilters } from "../types/admin-customer.types";

export const ADMIN_CUSTOMERS_QUERY_KEY = ["admin", "customers"] as const;

export function useAdminCustomers(filters: AdminCustomerFilters = {}) {
  return useQuery({
    queryKey: [...ADMIN_CUSTOMERS_QUERY_KEY, filters],
    queryFn: async () => adminCustomersApi.listCustomers(filters),
  });
}

export function useAdminCustomer(id: string | number) {
  return useQuery({
    queryKey: [...ADMIN_CUSTOMERS_QUERY_KEY, "detail", String(id)],
    queryFn: async () => (await adminCustomersApi.getCustomer(id)).data,
    enabled: Boolean(id),
  });
}

export function useAdminCustomerOrders(
  id: string | number,
  page: number = 1,
  perPage: number = 10
) {
  return useQuery({
    queryKey: [
      ...ADMIN_CUSTOMERS_QUERY_KEY,
      "detail",
      String(id),
      "orders",
      { page, perPage },
    ],
    queryFn: async () => adminCustomersApi.getCustomerOrders(id, page, perPage),
    enabled: Boolean(id),
  });
}
