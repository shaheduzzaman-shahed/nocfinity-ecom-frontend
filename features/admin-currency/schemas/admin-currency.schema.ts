import { z } from "zod";

export const currencySettingsSchema = z.object({
  currency: z
    .string()
    .trim()
    .length(3, "Currency code must be a 3-letter ISO code")
    .regex(/^[A-Za-z]{3}$/, "Currency code must contain only letters"),
});

export type CurrencySettingsFormValues = z.infer<typeof currencySettingsSchema>;
