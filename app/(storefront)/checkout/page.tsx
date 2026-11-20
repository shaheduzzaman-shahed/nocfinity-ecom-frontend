"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import {
  useCheckoutPreview,
  useProcessCheckout,
} from "@/features/checkout/hooks/use-checkout";
import { CheckoutAddressSection } from "@/features/checkout/components/checkout-address-section";
import { CheckoutPaymentSection } from "@/features/checkout/components/checkout-payment-section";
import { CheckoutOrderSummary } from "@/features/checkout/components/checkout-order-summary";
import type { NewAddressCheckoutValues } from "@/features/checkout/schemas/checkout.schema";
import { buttonVariants } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authUser = useAuthStore((s) => s.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [newAddressData, setNewAddressData] = useState<NewAddressCheckoutValues | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: preview, isLoading } = useCheckoutPreview({
    enabled: mounted && isAuthenticated,
  });

  const processCheckoutMutation = useProcessCheckout();

  const handleSelectSavedAddress = useCallback((id: number) => {
    setSelectedAddressId(id);
    setNewAddressData(null);
    setErrorMessage(null);
  }, []);

  const handleNewAddressChange = useCallback((data: NewAddressCheckoutValues | null) => {
    setNewAddressData(data);
    if (data) {
      setSelectedAddressId(null);
    }
  }, []);

  // Active address resolution
  const activeAddressId =
    selectedAddressId ??
    preview?.default_address_id ??
    preview?.addresses[0]?.id ??
    null;

  const handlePlaceOrder = useCallback(() => {
    setErrorMessage(null);

    // If using saved address
    if (activeAddressId && !newAddressData) {
      processCheckoutMutation.mutate(
        { shipping_address_id: activeAddressId },
        {
          onSuccess: (order) => {
            router.push(`/orders/${order.id}/confirmation`);
          },
          onError: (err: any) => {
            setErrorMessage(err.message || "Failed to process checkout. Please try again.");
          },
        }
      );
      return;
    }

    // If using new address
    if (newAddressData) {
      if (
        !newAddressData.name?.trim() ||
        !newAddressData.email?.trim() ||
        !newAddressData.phone?.trim() ||
        !newAddressData.address?.trim() ||
        !newAddressData.city?.trim() ||
        !newAddressData.state?.trim() ||
        !newAddressData.postal_code?.trim() ||
        !newAddressData.country?.trim()
      ) {
        setErrorMessage("Please complete all required shipping address fields.");
        return;
      }

      processCheckoutMutation.mutate(newAddressData, {
        onSuccess: (order) => {
          router.push(`/orders/${order.id}/confirmation`);
        },
        onError: (err: any) => {
          setErrorMessage(err.message || "Failed to process checkout. Please try again.");
        },
      });
      return;
    }

    setErrorMessage("Please select or enter a shipping address to proceed.");
  }, [activeAddressId, newAddressData, processCheckoutMutation, router]);

  // Initial SSR & mounting placeholder to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Preparing secure checkout session...
        </p>
      </div>
    );
  }

  // If unauthenticated, prompt customer login
  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Account Required for Checkout
          </h1>
          <p className="text-sm text-muted-foreground">
            Please sign in to your customer account to access your saved addresses,
            redeem member coupons, and complete your purchase.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/login?redirect=/checkout"
            className={buttonVariants({
              className: "w-full sm:w-auto h-11 px-8 rounded-full",
            })}
          >
            Sign In to Checkout
          </Link>
          <Link
            href="/register?redirect=/checkout"
            className={buttonVariants({
              variant: "outline",
              className: "w-full sm:w-auto h-11 px-8 rounded-full",
            })}
          >
            Create Customer Account
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Preparing secure checkout session...
        </p>
      </div>
    );
  }

  if (!preview || preview.items.length === 0) {
    return (
      <div className="container max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-muted-foreground">
            There are no items in your cart to checkout. Browse our collection and
            add items to get started.
          </p>
        </div>
        <Link
          href="/products"
          className={buttonVariants({ className: "rounded-full px-8" })}
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Shopping Bag</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>Encrypted 256-bit Checkout</span>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 pt-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-8">
          Secure Checkout
        </h1>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Form Column (Steps 1 & 2) */}
          <div className="lg:col-span-7 space-y-6">
            <CheckoutAddressSection
              addresses={preview.addresses}
              selectedAddressId={activeAddressId}
              onSelectSavedAddress={handleSelectSavedAddress}
              onNewAddressChange={handleNewAddressChange}
            />

            <CheckoutPaymentSection />
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <CheckoutOrderSummary
              items={preview.items}
              summary={preview.summary}
              coupon={preview.coupon}
              isLoading={isLoading}
              isSubmitting={processCheckoutMutation.isPending}
              errorMessage={errorMessage}
              onPlaceOrder={handlePlaceOrder}
              canPlaceOrder={Boolean(activeAddressId || newAddressData)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
