"use client";

import { useQuery } from "@tanstack/react-query";
import { adminActivityLogsApi } from "../api/admin-activity-logs.api";
import type { ActivityLogFilters } from "../types/activity-log.types";

export const ADMIN_ACTIVITY_LOGS_QUERY_KEY = ["admin", "activity-logs"] as const;

export function useAdminActivityLogs(filters: ActivityLogFilters = {}) {
  return useQuery({
    queryKey: [...ADMIN_ACTIVITY_LOGS_QUERY_KEY, filters],
    queryFn: async () => adminActivityLogsApi.listLogs(filters),
  });
}

export function useAdminActivityLog(id: string | number) {
  return useQuery({
    queryKey: [...ADMIN_ACTIVITY_LOGS_QUERY_KEY, "detail", String(id)],
    queryFn: async () => (await adminActivityLogsApi.getLog(id)).data,
    enabled: Boolean(id),
  });
}

export function useAdminActivityLogActions() {
  return useQuery({
    queryKey: [...ADMIN_ACTIVITY_LOGS_QUERY_KEY, "actions"],
    queryFn: async () => (await adminActivityLogsApi.listActions()).data,
    staleTime: 5 * 60 * 1000,
  });
}
