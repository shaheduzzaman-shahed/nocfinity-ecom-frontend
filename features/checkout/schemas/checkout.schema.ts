import { z } from "zod";

export const newAddressCheckoutSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters").max(255),
  email: z.string().email("Please enter a valid email address").max(255),
  phone: z.string().min(5, "Please enter a valid contact phone number").max(50),
  address: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters").max(100),
  state: z.string().min(2, "State / Province must be at least 2 characters").max(100),
  postal_code: z.string().min(2, "Postal code must be at least 2 characters").max(20),
  country: z.string().min(2, "Country must be at least 2 characters").max(100),
});

export type NewAddressCheckoutValues = z.infer<typeof newAddressCheckoutSchema>;
