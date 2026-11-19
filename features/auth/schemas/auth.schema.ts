import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain a special character"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain a special character"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export const updateProfileSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    phone: z.string().max(50).optional().or(z.literal("")),
    current_password: z.string().optional().or(z.literal("")),
    password: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) =>
          !val ||
          (/[a-z]/.test(val) &&
            /[A-Z]/.test(val) &&
            /[0-9]/.test(val) &&
            /[^a-zA-Z0-9]/.test(val) &&
            val.length >= 8),
        "Password must be 8+ chars with mixed case, number, and special character"
      ),
    password_confirmation: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password && !data.current_password) return false;
      return true;
    },
    { message: "Current password is required to set a new password", path: ["current_password"] }
  )
  .refine(
    (data) => {
      if (data.password && data.password !== data.password_confirmation) return false;
      return true;
    },
    { message: "Passwords do not match", path: ["password_confirmation"] }
  );

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
