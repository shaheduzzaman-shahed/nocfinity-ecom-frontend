import { z } from "zod";

export const roleDetailsSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(1, "Role name is required")
    .max(255, "Role name must be 255 characters or fewer"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional(),
});

export type RoleDetailsFormValues = z.infer<typeof roleDetailsSchema>;
