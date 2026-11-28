"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Elements,
  useElements,
  useStripe,
  CardElement,
} from "@stripe/react-stripe-js";
import {
  ArrowLeft,
  Loader2,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useMounted } from "@/hooks/use-mounted";
import {
  useCheckoutPreview,
  useProcessCheckout,
} from "@/features/checkout/hooks/use-checkout";
import { CheckoutAddressSection } from "@/features/checkout/components/checkout-address-section";
import { CheckoutPaymentSection } from "@/features/checkout/components/checkout-payment-section";
import { CheckoutOrderSummary } from "@/features/checkout/components/checkout-order-summary";
import type { CheckoutPreviewData } from "@/features/checkout/types/checkout.types";
import type { NewAddressCheckoutValues } from "@/features/checkout/schemas/checkout.schema";
import { buttonVariants } from "@/components/ui/button";
import { getStripePromise } from "@/lib/stripe/stripe-client";

function CheckoutFormContent({ preview }: { preview: CheckoutPreviewData }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [newAddressData, setNewAddressData] = useState<NewAddressCheckoutValues | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const [isCardComplete, setIsCardComplete] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

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

  const handleCardChange = useCallback((complete: boolean) => {
    setIsCardComplete(complete);
    if (complete) {
      setCardError(null);
    }
  }, []);

  // Active address resolution
  const activeAddressId =
    selectedAddressId ??
    preview.default_address_id ??
    preview.addresses[0]?.id ??
    null;

  const handlePlaceOrder = useCallback(async () => {
    setErrorMessage(null);
    setCardError(null);

    // 1. Validate shipping address
    if (!activeAddressId && !newAddressData) {
      setErrorMessage("Please select or enter a shipping address to proceed.");
      return;
    }

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
    }

    const payload = activeAddressId && !newAddressData
      ? { shipping_address_id: activeAddressId }
      : newAddressData!;

    setIsProcessingPayment(true);

    try {
      // 2. Submit checkout to create pending order and PaymentIntent on server
      const order = await processCheckoutMutation.mutateAsync(payload);

      const clientSecret = order.client_secret;

      // 3. Confirm card payment with Stripe
      if (clientSecret) {
        // If live Stripe clientSecret and Stripe Elements is loaded
        if (stripe && elements && !clientSecret.startsWith("pi_test_")) {
          const cardElement = elements.getElement(CardElement);

          if (!cardElement) {
            setErrorMessage("Card entry element could not be initialized.");
            setIsProcessingPayment(false);
            return;
          }

          const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: order.shipping_address?.name,
                email: order.shipping_address?.email,
                phone: order.shipping_address?.phone,
                address: {
                  line1: order.shipping_address?.address,
                  city: order.shipping_address?.city,
                  state: order.shipping_address?.state,
                  postal_code: order.shipping_address?.postal_code,
                  country: "US",
                },
              },
            },
          });

          if (result.error) {
            setErrorMessage(result.error.message || "Payment declined by issuing bank.");
            setCardError(result.error.message ?? "Payment declined by issuing bank.");
            setIsProcessingPayment(false);
            return;
          }
        }
      }

      // 4. Redirect to confirmation page
      router.push(`/orders/${order.id}/confirmation`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred while processing your order. Please try again.";
      setErrorMessage(message);
      setIsProcessingPayment(false);
    }
  }, [
    activeAddressId,
    newAddressData,
    processCheckoutMutation,
    router,
    stripe,
    elements,
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-12 items-start">
      {/* Left Form Column (Shipping & Card Payment) */}
      <div className="lg:col-span-7 space-y-6">
        <CheckoutAddressSection
          addresses={preview.addresses}
          selectedAddressId={activeAddressId}
          onSelectSavedAddress={handleSelectSavedAddress}
          onNewAddressChange={handleNewAddressChange}
        />

        <CheckoutPaymentSection
          cardError={cardError}
          onCardChange={handleCardChange}
        />
      </div>

      {/* Right Summary Column */}
      <div className="lg:col-span-5 lg:sticky lg:top-8">
        <CheckoutOrderSummary
          items={preview.items}
          summary={preview.summary}
          coupon={preview.coupon}
          isLoading={false}
          isSubmitting={isProcessingPayment || processCheckoutMutation.isPending}
          errorMessage={errorMessage}
          onPlaceOrder={handlePlaceOrder}
          canPlaceOrder={Boolean((activeAddressId || newAddressData) && isCardComplete)}
        />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const mounted = useMounted();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const stripePromise = useMemo(() => getStripePromise(), []);

  const { data: preview, isLoading } = useCheckoutPreview({
    enabled: mounted && isAuthenticated,
  });

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
            <span>Encrypted 256-bit Stripe Checkout</span>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 pt-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-8">
          Secure Checkout
        </h1>

        <Elements stripe={stripePromise}>
          <CheckoutFormContent preview={preview} />
        </Elements>
      </div>
    </div>
  );
}
