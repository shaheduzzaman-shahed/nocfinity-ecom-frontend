import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type {
  CurrencySettings,
  UpdateCurrencyPayload,
} from "../types/admin-currency.types";

export const adminCurrencyApi = {
  getCurrencySettings() {
    return api.get<ApiSuccessResponse<CurrencySettings>>("/admin/settings/currency");
  },

  updateCurrencySettings(payload: UpdateCurrencyPayload) {
    return api.put<ApiSuccessResponse<CurrencySettings>>(
      "/admin/settings/currency",
      payload
    );
  },
};
