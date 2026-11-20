"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "../api/cart.api";
import type {
  AddToCartPayload,
  CartData,
  CartItemData,
  CartSummaryData,
  GuestCartItem,
} from "../types/cart.types";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { ApiError } from "@/lib/api/error";

export const CART_QUERY_KEY = ["cart"];

export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { guestItems, isHydrated, hydrate } = useCartStore();

  const query = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const res = await cartApi.getCart();
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });

  // If not authenticated, compute cart shape from local guest items
  if (!isAuthenticated) {
    const items: CartItemData[] = guestItems.map((item, idx) => {
      const unitPrice = item.unit_price ?? 0;
      const regularPrice = item.regular_price ?? unitPrice;
      const effectivePrice = unitPrice;
      const lineSubtotal = Math.round(effectivePrice * item.quantity * 100) / 100;
      const stock = item.stock ?? 10;

      return {
        id: idx + 1,
        product_variant_id: item.product_variant_id,
        quantity: item.quantity,
        product_id: item.product_id ?? null,
        product_name: item.product_name ?? "Product",
        product_slug: item.product_slug ?? null,
        primary_image: item.primary_image ?? null,
        sku: item.sku ?? "",
        color: item.color_name
          ? { id: 0, name: item.color_name, hex_code: item.color_hex ?? null }
          : null,
        size: item.size_name
          ? { id: 0, name: item.size_name, sort_order: 0 }
          : null,
        unit_price: effectivePrice,
        regular_price: regularPrice,
        has_discount: effectivePrice < regularPrice,
        line_subtotal: lineSubtotal,
        stock: stock,
        in_stock: stock > 0,
        is_available: true,
        is_sufficient_stock: stock >= item.quantity,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.line_subtotal, 0);
    const productDiscount = items.reduce((sum, item) => {
      return sum + Math.max(0, (item.regular_price - item.unit_price) * item.quantity);
    }, 0);
    const shippingEstimate = items.length > 0 ? 5.0 : 0.0;
    const finalTotal = Math.max(0, Math.round((subtotal + shippingEstimate) * 100) / 100);

    const summary: CartSummaryData = {
      subtotal: Math.round(subtotal * 100) / 100,
      product_discount: Math.round(productDiscount * 100) / 100,
      coupon_discount: 0,
      shipping_estimate: shippingEstimate,
      final_total: finalTotal,
      currency: "USD",
    };

    const guestCartData: CartData = {
      id: 0,
      items,
      items_count: items.length,
      total_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
      summary,
      warnings: [],
    };

    return {
      cart: guestCartData,
      isLoading: !isHydrated,
      isError: false,
      error: null,
      refetch: () => hydrate(),
      totalQuantity: guestCartData.total_quantity,
    };
  }

  const cart = query.data ?? null;
  const totalQuantity = cart ? cart.total_quantity : 0;

  return {
    cart,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    totalQuantity,
  };
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addGuestItem = useCartStore((s) => s.addGuestItem);

  return useMutation({
    mutationFn: async (payload: {
      variantId: number;
      quantity: number;
      metadata?: Partial<GuestCartItem>;
    }) => {
      if (isAuthenticated) {
        const res = await cartApi.addItem({
          product_variant_id: payload.variantId,
          quantity: payload.quantity,
        });
        return res.data;
      }

      // Guest cart
      addGuestItem({
        product_variant_id: payload.variantId,
        quantity: payload.quantity,
        ...payload.metadata,
      });

      return null;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(CART_QUERY_KEY, data);
        if (data.warnings && data.warnings.length > 0) {
          data.warnings.forEach((w) => toast.warning(w));
        }
      }
      toast.success("Added to your shopping bag!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to add item to bag.");
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const updateGuestQuantity = useCartStore((s) => s.updateGuestQuantity);

  return useMutation({
    mutationFn: async (payload: {
      itemId: number;
      variantId: number;
      quantity: number;
    }) => {
      if (isAuthenticated) {
        const res = await cartApi.updateItem(payload.itemId, {
          quantity: payload.quantity,
        });
        return res.data;
      }

      updateGuestQuantity(payload.variantId, payload.quantity);
      return null;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(CART_QUERY_KEY, data);
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Could not update quantity.");
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const removeGuestItem = useCartStore((s) => s.removeGuestItem);

  return useMutation({
    mutationFn: async (payload: { itemId: number; variantId: number }) => {
      if (isAuthenticated) {
        const res = await cartApi.removeItem(payload.itemId);
        return res.data;
      }

      removeGuestItem(payload.variantId);
      return null;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(CART_QUERY_KEY, data);
      }
      toast.success("Item removed from your bag.");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to remove item.");
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearGuestCart = useCartStore((s) => s.clearGuestCart);

  return useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        const res = await cartApi.clearCart();
        return res.data;
      }

      clearGuestCart();
      return null;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(CART_QUERY_KEY, data);
      }
      toast.success("Shopping bag cleared.");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to clear bag.");
    },
  });
}
