import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type {
  AddressPayload,
  ShippingAddress,
} from "../types/address.types";

export const addressesApi = {
  getAddresses() {
    return api.get<ApiSuccessResponse<ShippingAddress[]>>("/addresses");
  },

  getAddress(id: number) {
    return api.get<ApiSuccessResponse<ShippingAddress>>(`/addresses/${id}`);
  },

  createAddress(payload: AddressPayload) {
    return api.post<ApiSuccessResponse<ShippingAddress>>("/addresses", payload);
  },

  updateAddress(id: number, payload: Partial<AddressPayload>) {
    return api.put<ApiSuccessResponse<ShippingAddress>>(`/addresses/${id}`, payload);
  },

  deleteAddress(id: number) {
    return api.delete<ApiSuccessResponse<null>>(`/addresses/${id}`);
  },

  setDefaultAddress(id: number) {
    return api.patch<ApiSuccessResponse<ShippingAddress>>(
      `/addresses/${id}/default`
    );
  },
};
