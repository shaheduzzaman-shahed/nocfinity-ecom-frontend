import { z } from "zod";

const decimalPattern = /^\d+(\.\d{1,2})?$/;
const integerPattern = /^\d+$/;

const priceField = (label: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || decimalPattern.test(value), {
      message: `${label} must be a number with up to 2 decimal places`,
    });

export const productVariantSchema = z.object({
  variant_id: z.string().optional(),
  color_id: z.string().min(1, "Choose a color"),
  size_id: z.string().min(1, "Choose a size"),
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(100, "SKU must be 100 characters or fewer"),
  stock: z
    .string()
    .trim()
    .regex(integerPattern, "Stock must be 0 or a positive whole number"),
  price_override: priceField("Price override"),
  is_active: z.boolean(),
});

export const productFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Product name is required")
      .max(255, "Product name must be 255 characters or fewer"),
    description: z
      .string()
      .max(20000, "Description must be 20,000 characters or fewer"),
    category_id: z.string().min(1, "Choose a category"),
    regular_price: z
      .string()
      .trim()
      .regex(decimalPattern, "Use a price such as 49.99"),
    discount_price: priceField("Discount price"),
    is_active: z.boolean(),
    variants: z.array(productVariantSchema).max(200),
  })
  .superRefine((values, ctx) => {
    if (
      values.discount_price !== "" &&
      Number(values.discount_price) >= Number(values.regular_price)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["discount_price"],
        message: "Discount price must be less than the regular price",
      });
    }

    const seenCombinations = new Map<string, number>();
    const seenSkus = new Map<string, number>();

    values.variants.forEach((variant, index) => {
      if (variant.color_id && variant.size_id) {
        const key = `${variant.color_id}-${variant.size_id}`;
        const previous = seenCombinations.get(key);

        if (previous !== undefined) {
          ctx.addIssue({
            code: "custom",
            path: ["variants", index, "size_id"],
            message: `This color and size combination is already used in row ${previous + 1}`,
          });
        } else {
          seenCombinations.set(key, index);
        }
      }

      const sku = variant.sku.trim().toLowerCase();

      if (!sku) return;

      const previous = seenSkus.get(sku);

      if (previous !== undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["variants", index, "sku"],
          message: `This SKU is already used in row ${previous + 1}`,
        });
      } else {
        seenSkus.set(sku, index);
      }
    });
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductVariantFormValues = z.infer<typeof productVariantSchema>;
