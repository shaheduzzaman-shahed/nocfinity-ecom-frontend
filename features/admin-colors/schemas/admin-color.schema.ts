import { z } from "zod";

export const colorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Color name is required")
    .max(100, "Color name must be 100 characters or fewer"),
  hex_code: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^#[0-9a-fA-F]{6}$/.test(value),
      "Use a hex code like #1A2B3C"
    ),
});

export type ColorFormValues = z.infer<typeof colorFormSchema>;
