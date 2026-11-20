import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(255, "Category name must be 255 characters or fewer"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional(),
  parent_id: z.string(),
  is_active: z.boolean(),
  sort_order: z
    .string()
    .trim()
    .regex(/^\d+$/, "Sort order must be 0 or a positive whole number"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
