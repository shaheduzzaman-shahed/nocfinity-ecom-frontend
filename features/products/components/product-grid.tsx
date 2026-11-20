import type { ProductCardData } from "../types/product.types";
import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-12 text-center">
        <p className="font-heading text-lg font-medium">No products yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          New pieces will appear here as soon as they are added to the catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
