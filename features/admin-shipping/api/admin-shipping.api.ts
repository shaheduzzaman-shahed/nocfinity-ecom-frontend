import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type {
  ShippingSettings,
  UpdateShippingSettingsPayload,
} from "../types/admin-shipping.types";

export const adminShippingApi = {
  getShippingSettings() {
    return api.get<ApiSuccessResponse<ShippingSettings>>("/admin/settings/shipping");
  },

  updateShippingSettings(payload: UpdateShippingSettingsPayload) {
    return api.put<ApiSuccessResponse<ShippingSettings>>(
      "/admin/settings/shipping",
      payload
    );
  },
};
