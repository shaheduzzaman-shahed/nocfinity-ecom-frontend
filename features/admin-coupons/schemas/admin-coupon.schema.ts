import { z } from "zod";

const decimalPattern = /^\d+(\.\d{1,2})?$/;
const integerPattern = /^\d+$/;

export const couponFormSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "Coupon code is required")
      .max(50, "Coupon code cannot exceed 50 characters")
      .regex(/^[a-zA-Z0-9_-]+$/, "Code may only contain letters, numbers, hyphens, and underscores"),
    type: z.enum(["percentage", "fixed"]),
    value: z
      .string()
      .trim()
      .min(1, "Discount value is required")
      .regex(decimalPattern, "Value must be a valid number"),
    min_order_amount: z
      .string()
      .trim()
      .refine((v) => v === "" || decimalPattern.test(v), {
        message: "Must be a valid amount",
      }),
    usage_limit: z
      .string()
      .trim()
      .refine((v) => v === "" || integerPattern.test(v), {
        message: "Must be a positive whole number",
      }),
    valid_from: z.string().optional(),
    valid_until: z.string().optional(),
    is_active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const numValue = Number(data.value);
    if (isNaN(numValue) || numValue <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value"],
        message: "Discount value must be greater than 0",
      });
    } else if (data.type === "percentage" && numValue > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value"],
        message: "Percentage discount cannot exceed 100%",
      });
    }

    if (data.valid_from && data.valid_until) {
      const from = new Date(data.valid_from).getTime();
      const until = new Date(data.valid_until).getTime();
      if (!isNaN(from) && !isNaN(until) && until < from) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["valid_until"],
          message: "Expiration date cannot be before start date",
        });
      }
    }
  });

export type CouponFormValues = z.infer<typeof couponFormSchema>;
