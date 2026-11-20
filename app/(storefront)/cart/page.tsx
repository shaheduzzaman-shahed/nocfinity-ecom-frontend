"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart.store";

export default function CartPage() {
  const { items, isHydrated, hydrate, clearCart, totalItems } = useCartStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const count = isHydrated ? totalItems() : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="border-b pb-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Shopping Bag
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {count === 0
            ? "Your bag is currently empty."
            : `You have ${count} item${count > 1 ? "s" : ""} in your bag.`}
        </p>
      </div>

      {count === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-heading text-xl font-semibold">
            Your shopping bag is empty
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore our curated collections of essentials and find your fit.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Shop all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Items selected: {count}</p>
                <p className="text-xs text-muted-foreground">
                  Variant IDs: {items.map((i) => i.productVariantId).join(", ")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-xs"
              >
                Clear bag
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Full cart calculations, discounts, coupons, and checkout are active in the upcoming checkout phase.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex h-10 items-center justify-center rounded-full border px-5 text-sm font-medium hover:bg-muted"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
