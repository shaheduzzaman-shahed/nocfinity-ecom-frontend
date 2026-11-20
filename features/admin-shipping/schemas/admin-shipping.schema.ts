import { z } from "zod";

const decimalPattern = /^\d+(\.\d{1,2})?$/;

export const shippingSettingsSchema = z.object({
  shipping_fee: z
    .string()
    .trim()
    .min(1, "Shipping fee is required")
    .regex(decimalPattern, "Shipping fee must be a valid amount (e.g. 5.00)")
    .refine((val) => Number(val) >= 0, "Shipping fee cannot be negative"),
  shipping_enabled: z.boolean(),
});

export type ShippingSettingsFormValues = z.infer<typeof shippingSettingsSchema>;
