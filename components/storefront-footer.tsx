"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

export function StorefrontFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("Thank you for joining our private newsletter!");
    setEmail("");
  }

  return (
    <footer className="border-t bg-muted/30">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand & Newsletter Column */}
          <div className="space-y-6">
            <Link
              href="/"
              className="font-heading text-2xl font-bold tracking-tight text-foreground"
            >
              Nocfinity
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Modern essentials crafted for longevity and ease. Designed with premium materials and conscious tailoring for every day.
            </p>

            <div className="space-y-3 pt-2">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                Join the Private List
              </p>
              <p className="text-xs text-muted-foreground">
                Subscribe for early access to seasonal drops and secret sales.
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" /> You are subscribed to updates.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="h-10 flex-1 rounded-full border bg-background px-4 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-4">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Collections
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="transition-colors hover:text-foreground">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link href="/categories/men" className="transition-colors hover:text-foreground">
                  Men&apos;s Fashion
                </Link>
              </li>
              <li>
                <Link href="/categories/women" className="transition-colors hover:text-foreground">
                  Women&apos;s Fashion
                </Link>
              </li>
              <li>
                <Link href="/categories/accessories" className="transition-colors hover:text-foreground">
                  Accessories & Bags
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="transition-colors hover:text-foreground">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="space-y-4">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Customer Care
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/account" className="transition-colors hover:text-foreground">
                  My Account & Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition-colors hover:text-foreground">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/70 cursor-not-allowed">
                  Shipping & Delivery
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/70 cursor-not-allowed">
                  Returns & Exchanges
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/70 cursor-not-allowed">
                  Sustainability Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              About Nocfinity
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <span className="text-muted-foreground/70 cursor-not-allowed">
                  Our Philosophy
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/70 cursor-not-allowed">
                  Ethical Sourcing
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/70 cursor-not-allowed">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/70 cursor-not-allowed">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Nocfinity Inc. All rights reserved. Built with precision.
          </p>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/80">
            <span className="rounded border bg-background px-2 py-0.5">Stripe</span>
            <span className="rounded border bg-background px-2 py-0.5">Visa</span>
            <span className="rounded border bg-background px-2 py-0.5">Mastercard</span>
            <span className="rounded border bg-background px-2 py-0.5">Amex</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
