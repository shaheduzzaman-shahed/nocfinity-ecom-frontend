export interface ShippingSettings {
  shipping_fee: number;
  shipping_enabled: boolean;
}

export interface UpdateShippingSettingsPayload {
  shipping_fee?: number;
  shipping_enabled?: boolean;
}
