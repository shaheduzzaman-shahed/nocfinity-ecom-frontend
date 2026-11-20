import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type { AdminSize, SizePayload } from "../types/admin-size.types";

export const adminSizesApi = {
  listSizes() {
    return api.get<ApiSuccessResponse<AdminSize[]>>("/admin/sizes");
  },

  createSize(payload: SizePayload) {
    return api.post<ApiSuccessResponse<AdminSize>>("/admin/sizes", payload);
  },

  updateSize(sizeId: number, payload: SizePayload) {
    return api.put<ApiSuccessResponse<AdminSize>>(
      `/admin/sizes/${sizeId}`,
      payload
    );
  },

  deleteSize(sizeId: number) {
    return api.delete<ApiSuccessResponse<null>>(`/admin/sizes/${sizeId}`);
  },
};
