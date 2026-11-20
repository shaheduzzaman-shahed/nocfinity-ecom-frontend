import type {
  AdminProduct,
  AdminProductImage,
  ProductPayload,
} from "../types/admin-product.types";
import type { ProductFormValues } from "../schemas/admin-product.schema";

export function emptyProductFormValues(): ProductFormValues {
  return {
    name: "",
    description: "",
    category_id: "",
    regular_price: "",
    discount_price: "",
    is_active: true,
    variants: [],
  };
}

export function productToFormValues(product: AdminProduct): ProductFormValues {
  return {
    name: product.name,
    description: product.description ?? "",
    category_id: product.category ? String(product.category.id) : "",
    regular_price: String(product.regular_price),
    discount_price:
      product.discount_price === null ? "" : String(product.discount_price),
    is_active: product.is_active,
    variants: product.variants.map((variant) => ({
      variant_id: String(variant.id),
      color_id: variant.color ? String(variant.color.id) : "",
      size_id: variant.size ? String(variant.size.id) : "",
      sku: variant.sku,
      stock: String(variant.stock),
      price_override:
        variant.price_override === null ? "" : String(variant.price_override),
      is_active: variant.is_active,
    })),
  };
}

export function formValuesToPayload(values: ProductFormValues): ProductPayload {
  return {
    name: values.name.trim(),
    description: values.description.trim() || null,
    category_id: Number(values.category_id),
    regular_price: Number(values.regular_price),
    discount_price:
      values.discount_price === "" ? null : Number(values.discount_price),
    is_active: values.is_active,
    variants: values.variants.map((variant) => ({
      id: variant.variant_id ? Number(variant.variant_id) : undefined,
      color_id: Number(variant.color_id),
      size_id: Number(variant.size_id),
      sku: variant.sku.trim(),
      stock: Number(variant.stock),
      price_override:
        variant.price_override === "" ? null : Number(variant.price_override),
      is_active: variant.is_active,
    })),
  };
}

export function orderedProductImages(
  images: AdminProductImage[]
): AdminProductImage[] {
  return [...images].sort(
    (a, b) => a.sort_order - b.sort_order || a.id - b.id
  );
}
