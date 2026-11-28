import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/stores/cart.store";
import type { GuestCartItem } from "@/features/cart/types/cart.types";

describe("Frontend Cart Operations Testing", () => {
  beforeEach(() => {
    useCartStore.getState().clearGuestCart();
  });

  it("adds an item to the guest cart", () => {
    const item: GuestCartItem = {
      product_variant_id: 101,
      product_id: 10,
      product_name: "Silk Blouse",
      product_slug: "silk-blouse",
      color_name: "Ivory",
      color_hex: "#FFFFF0",
      size_name: "M",
      sku: "SLK-BLS-IVR-M",
      unit_price: 120.0,
      quantity: 1,
      stock: 10,
      primary_image: "/images/silk-blouse.jpg",
    };

    useCartStore.getState().addGuestItem(item);
    expect(useCartStore.getState().guestItems).toHaveLength(1);
    expect(useCartStore.getState().totalGuestQuantity()).toBe(1);
  });

  it("aggregates quantity when adding duplicate variant and respects stock limits", () => {
    const item: GuestCartItem = {
      product_variant_id: 202,
      product_id: 20,
      product_name: "Leather Jacket",
      product_slug: "leather-jacket",
      color_name: "Black",
      color_hex: "#000000",
      size_name: "L",
      sku: "LTHR-JKT-BLK-L",
      unit_price: 350.0,
      quantity: 2,
      stock: 4, // Max available stock
      primary_image: null,
    };

    // Add 2 items
    useCartStore.getState().addGuestItem(item);
    expect(useCartStore.getState().guestItems[0].quantity).toBe(2);

    // Add 1 more item (total 3 <= stock 4)
    useCartStore.getState().addGuestItem({ ...item, quantity: 1 });
    expect(useCartStore.getState().guestItems[0].quantity).toBe(3);

    // Try adding 3 more items (would be 6, but stock is capped at 4)
    useCartStore.getState().addGuestItem({ ...item, quantity: 3 });
    expect(useCartStore.getState().guestItems[0].quantity).toBe(4);
    expect(useCartStore.getState().totalGuestQuantity()).toBe(4);
  });

  it("updates item quantity and removes item when quantity is 0", () => {
    const item: GuestCartItem = {
      product_variant_id: 303,
      product_id: 30,
      product_name: "Denim Jeans",
      product_slug: "denim-jeans",
      color_name: "Indigo",
      color_hex: "#4B0082",
      size_name: "32",
      sku: "DNM-JNS-IND-32",
      unit_price: 89.99,
      quantity: 2,
      stock: 15,
      primary_image: null,
    };

    useCartStore.getState().addGuestItem(item);
    useCartStore.getState().updateGuestQuantity(303, 5);
    expect(useCartStore.getState().guestItems[0].quantity).toBe(5);

    // Quantity <= 0 removes the item from the cart
    useCartStore.getState().updateGuestQuantity(303, 0);
    expect(useCartStore.getState().guestItems).toHaveLength(0);
  });

  it("removes item from guest cart", () => {
    const item1: GuestCartItem = {
      product_variant_id: 401,
      product_id: 40,
      product_name: "Item 1",
      product_slug: "item-1",
      color_name: "Red",
      color_hex: "#FF0000",
      size_name: "S",
      sku: "SKU-1",
      unit_price: 50,
      quantity: 1,
      stock: 10,
      primary_image: null,
    };
    const item2: GuestCartItem = {
      product_variant_id: 402,
      product_id: 40,
      product_name: "Item 2",
      product_slug: "item-2",
      color_name: "Blue",
      color_hex: "#0000FF",
      size_name: "S",
      sku: "SKU-2",
      unit_price: 60,
      quantity: 2,
      stock: 10,
      primary_image: null,
    };

    useCartStore.getState().addGuestItem(item1);
    useCartStore.getState().addGuestItem(item2);
    expect(useCartStore.getState().guestItems).toHaveLength(2);

    useCartStore.getState().removeGuestItem(401);
    expect(useCartStore.getState().guestItems).toHaveLength(1);
    expect(useCartStore.getState().guestItems[0].product_variant_id).toBe(402);
  });

  it("formats merge payload for guest cart login sync", () => {
    const item1: GuestCartItem = {
      product_variant_id: 501,
      product_id: 50,
      product_name: "Item A",
      product_slug: "item-a",
      color_name: "Black",
      color_hex: "#000",
      size_name: "M",
      sku: "SKU-A",
      unit_price: 100,
      quantity: 3,
      stock: 10,
      primary_image: null,
    };

    useCartStore.getState().addGuestItem(item1);
    const mergePayload = useCartStore.getState().getGuestMergePayload();

    expect(mergePayload).toEqual([
      { product_variant_id: 501, quantity: 3 },
    ]);
  });
});
