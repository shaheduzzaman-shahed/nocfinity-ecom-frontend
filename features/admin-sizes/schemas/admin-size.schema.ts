import { z } from "zod";

export const sizeFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Size name is required")
    .max(50, "Size name must be 50 characters or fewer"),
  sort_order: z
    .string()
    .trim()
    .regex(/^\d+$/, "Sort order must be 0 or a positive whole number"),
});

export type SizeFormValues = z.infer<typeof sizeFormSchema>;
