"use client";

import { create } from "zustand";
import type { GuestCartItem } from "@/features/cart/types/cart.types";

const CART_STORAGE_KEY = "nocfinity_guest_cart";

interface CartStoreState {
  guestItems: GuestCartItem[];
  isHydrated: boolean;
  hydrate: () => void;
  addGuestItem: (item: GuestCartItem) => void;
  updateGuestQuantity: (variantId: number, quantity: number) => void;
  removeGuestItem: (variantId: number) => void;
  clearGuestCart: () => void;
  totalGuestQuantity: () => number;
  getGuestMergePayload: () => Array<{ product_variant_id: number; quantity: number }>;
}

function loadInitialItems(): GuestCartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is GuestCartItem =>
          typeof item?.product_variant_id === "number" &&
          typeof item?.quantity === "number" &&
          item.quantity > 0
      );
    }
  } catch {
    // ignore parse error
  }

  return [];
}

function saveItems(items: GuestCartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore write error
  }
}

export const useCartStore = create<CartStoreState>((set, get) => ({
  guestItems: [],
  isHydrated: false,

  hydrate: () => {
    if (get().isHydrated) return;
    const guestItems = loadInitialItems();
    set({ guestItems, isHydrated: true });
  },

  addGuestItem: (incoming: GuestCartItem) => {
    const current = get().guestItems;
    const existingIndex = current.findIndex(
      (item) => item.product_variant_id === incoming.product_variant_id
    );

    let nextItems: GuestCartItem[];
    if (existingIndex > -1) {
      const existing = current[existingIndex];
      const maxStock = incoming.stock ?? existing.stock ?? 9999;
      const newQty = Math.min(existing.quantity + incoming.quantity, maxStock);

      nextItems = current.map((item, index) =>
        index === existingIndex
          ? { ...item, ...incoming, quantity: newQty }
          : item
      );
    } else {
      nextItems = [...current, incoming];
    }

    saveItems(nextItems);
    set({ guestItems: nextItems });
  },

  updateGuestQuantity: (variantId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeGuestItem(variantId);
      return;
    }

    const nextItems = get().guestItems.map((item) =>
      item.product_variant_id === variantId
        ? { ...item, quantity: Math.min(quantity, item.stock ?? quantity) }
        : item
    );

    saveItems(nextItems);
    set({ guestItems: nextItems });
  },

  removeGuestItem: (variantId: number) => {
    const nextItems = get().guestItems.filter(
      (item) => item.product_variant_id !== variantId
    );
    saveItems(nextItems);
    set({ guestItems: nextItems });
  },

  clearGuestCart: () => {
    saveItems([]);
    set({ guestItems: [] });
  },

  totalGuestQuantity: () => {
    return get().guestItems.reduce((total, item) => total + item.quantity, 0);
  },

  getGuestMergePayload: () => {
    return get().guestItems.map((item) => ({
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
    }));
  },
}));
