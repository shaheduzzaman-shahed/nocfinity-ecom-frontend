import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type { AdminColor, ColorPayload } from "../types/admin-color.types";

export const adminColorsApi = {
  listColors() {
    return api.get<ApiSuccessResponse<AdminColor[]>>("/admin/colors");
  },

  createColor(payload: ColorPayload) {
    return api.post<ApiSuccessResponse<AdminColor>>("/admin/colors", payload);
  },

  updateColor(colorId: number, payload: ColorPayload) {
    return api.put<ApiSuccessResponse<AdminColor>>(
      `/admin/colors/${colorId}`,
      payload
    );
  },

  deleteColor(colorId: number) {
    return api.delete<ApiSuccessResponse<null>>(`/admin/colors/${colorId}`);
  },
};
