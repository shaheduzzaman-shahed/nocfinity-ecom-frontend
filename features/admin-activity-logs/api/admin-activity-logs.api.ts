import { api } from "@/lib/api/client";
import type { ApiPaginatedResponse, ApiSuccessResponse } from "@/lib/api/types";
import type {
  ActivityLog,
  ActivityLogFilters,
} from "../types/activity-log.types";

export const adminActivityLogsApi = {
  listLogs(filters: ActivityLogFilters = {}) {
    return api.get<ApiPaginatedResponse<ActivityLog>>("/admin/activity-logs", {
      params: {
        page: filters.page,
        per_page: filters.per_page,
        search: filters.search || undefined,
        user_id: filters.user_id || undefined,
        account_type: filters.account_type || undefined,
        action: filters.action || undefined,
        entity_type: filters.entity_type || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        sort_direction: filters.sort_direction,
      },
    });
  },

  getLog(id: number | string) {
    return api.get<ApiSuccessResponse<ActivityLog>>(`/admin/activity-logs/${id}`);
  },

  listActions() {
    return api.get<ApiSuccessResponse<string[]>>("/admin/activity-logs/actions");
  },
};
