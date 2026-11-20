import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { api } from "@/lib/api/client";

let stripePromise: Promise<Stripe | null> | null = null;

export async function getStripePublishableKey(): Promise<string> {
  const envKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_STRIPE_KEY;

  if (envKey) {
    return envKey;
  }

  try {
    const res = await api.get<{
      success: boolean;
      data: { publishable_key: string | null };
    }>("/payments/stripe/config");

    if (res.data?.publishable_key) {
      return res.data.publishable_key;
    }
  } catch {
    // Silently fall back to default test key
  }

  // Fallback to standard Stripe public test key
  return "pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfWwXCtPIt316TXqqUkjSmKnKmRiqqncZ0qM5AIQ26zN9QZg4F5X189u3p00T8GvUe6k";
}

export function getStripePromise(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = getStripePublishableKey().then((key) => {
      if (!key) return null;
      return loadStripe(key);
    });
  }

  return stripePromise;
}
