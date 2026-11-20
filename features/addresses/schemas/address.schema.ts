import { z } from "zod";

export const addressFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Recipient name is required")
    .max(255, "Name cannot exceed 255 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Contact email is required")
    .email("Please provide a valid email address")
    .max(255, "Email cannot exceed 255 characters"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(50, "Phone number cannot exceed 50 characters"),
  address: z
    .string()
    .trim()
    .min(1, "Street address is required")
    .max(1000, "Address cannot exceed 1000 characters"),
  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(100, "City cannot exceed 100 characters"),
  state: z
    .string()
    .trim()
    .min(1, "State or region is required")
    .max(100, "State cannot exceed 100 characters"),
  postal_code: z
    .string()
    .trim()
    .min(1, "Postal / ZIP code is required")
    .max(20, "Postal code cannot exceed 20 characters"),
  country: z
    .string()
    .trim()
    .min(1, "Country is required")
    .max(100, "Country cannot exceed 100 characters"),
  is_default: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;
