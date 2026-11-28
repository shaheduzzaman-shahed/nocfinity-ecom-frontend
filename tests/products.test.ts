import { describe, it, expect } from "vitest";
import type { ProductVariantData } from "@/features/products/types/product.types";

function findMatchingVariant(
  variants: ProductVariantData[],
  colorId: number | null,
  sizeId: number | null
): ProductVariantData | undefined {
  if (!colorId || !sizeId) return undefined;
  return variants.find(
    (v) => v.color?.id === colorId && v.size?.id === sizeId
  );
}

function getStockStatus(stock: number): "in_stock" | "low_stock" | "out_of_stock" {
  if (stock <= 0) return "out_of_stock";
  if (stock <= 5) return "low_stock";
  return "in_stock";
}

describe("Frontend Products & Variant Selection", () => {
  const sampleVariants: ProductVariantData[] = [
    {
      id: 1,
      sku: "TSH-BLK-S",
      stock: 12,
      price_override: null,
      effective_price: 29.99,
      color: { id: 1, name: "Black", hex_code: "#000000" },
      size: { id: 1, name: "S", sort_order: 1 },
    },
    {
      id: 2,
      sku: "TSH-BLK-M",
      stock: 3,
      price_override: null,
      effective_price: 29.99,
      color: { id: 1, name: "Black", hex_code: "#000000" },
      size: { id: 2, name: "M", sort_order: 2 },
    },
    {
      id: 3,
      sku: "TSH-WHT-S",
      stock: 0,
      price_override: null,
      effective_price: 29.99,
      color: { id: 2, name: "White", hex_code: "#FFFFFF" },
      size: { id: 1, name: "S", sort_order: 1 },
    },
  ];

  it("resolves the unique variant from selected color and size", () => {
    const selected = findMatchingVariant(sampleVariants, 1, 2);
    expect(selected).toBeDefined();
    expect(selected?.sku).toBe("TSH-BLK-M");
    expect(selected?.id).toBe(2);
  });

  it("returns undefined when no variant matches combination", () => {
    // White M does not exist in sampleVariants
    const selected = findMatchingVariant(sampleVariants, 2, 2);
    expect(selected).toBeUndefined();
  });

  it("accurately detects stock status (in_stock, low_stock, out_of_stock)", () => {
    expect(getStockStatus(sampleVariants[0].stock)).toBe("in_stock");
    expect(getStockStatus(sampleVariants[1].stock)).toBe("low_stock");
    expect(getStockStatus(sampleVariants[2].stock)).toBe("out_of_stock");
  });
});
