"use client";

import { create } from "zustand";

const CART_STORAGE_KEY = "nocfinity_guest_cart";

export interface LocalCartItem {
  productVariantId: number;
  quantity: number;
}

interface CartState {
  items: LocalCartItem[];
  isHydrated: boolean;
  addItem: (productVariantId: number, quantity?: number) => void;
  updateQuantity: (productVariantId: number, quantity: number) => void;
  removeItem: (productVariantId: number) => void;
  clearCart: () => void;
  hydrate: () => void;
  totalItems: () => number;
}

function loadInitialItems(): LocalCartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is LocalCartItem =>
          typeof item?.productVariantId === "number" &&
          typeof item?.quantity === "number" &&
          item.quantity > 0
      );
    }
  } catch {
    // ignore JSON parse errors
  }

  return [];
}

function saveItems(items: LocalCartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage write errors
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isHydrated: false,

  hydrate: () => {
    if (get().isHydrated) return;
    const items = loadInitialItems();
    set({ items, isHydrated: true });
  },

  addItem: (productVariantId: number, quantity = 1) => {
    const current = get().items;
    const existingIndex = current.findIndex(
      (item) => item.productVariantId === productVariantId
    );

    let nextItems: LocalCartItem[];
    if (existingIndex > -1) {
      nextItems = current.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      nextItems = [...current, { productVariantId, quantity }];
    }

    saveItems(nextItems);
    set({ items: nextItems });
  },

  updateQuantity: (productVariantId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productVariantId);
      return;
    }

    const nextItems = get().items.map((item) =>
      item.productVariantId === productVariantId
        ? { ...item, quantity }
        : item
    );

    saveItems(nextItems);
    set({ items: nextItems });
  },

  removeItem: (productVariantId: number) => {
    const nextItems = get().items.filter(
      (item) => item.productVariantId !== productVariantId
    );
    saveItems(nextItems);
    set({ items: nextItems });
  },

  clearCart: () => {
    saveItems([]);
    set({ items: [] });
  },

  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
