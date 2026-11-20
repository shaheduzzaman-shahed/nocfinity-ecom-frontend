"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  User,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { StorefrontCategory } from "../types/category.types";
import { useAuthStore } from "@/stores/auth.store";
import { useCart } from "@/features/cart/hooks/use-cart";

function categoryHref(slug: string): string {
  return `/categories/${slug}`;
}

export function StorefrontHeader({
  categories,
}: {
  categories: StorefrontCategory[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { totalQuantity } = useCart();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isAuth = mounted && isAuthenticated;
  const activeUser = mounted ? user : null;
  const itemCount = mounted ? totalQuantity : 0;

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/products?search=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:gap-6 lg:px-8">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
          >
            Nocfinity
          </Link>
        </div>

        {/* Center: Desktop navigation links */}
        <nav
          className="hidden items-center gap-7 text-sm md:flex"
          aria-label="Main categories"
        >
          <Link
            href="/products"
            className="py-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Shop all
          </Link>

          {categories.map((category) => {
            const children = category.children ?? [];

            return (
              <div key={category.id} className="group relative">
                <Link
                  href={categoryHref(category.slug)}
                  className="inline-flex items-center gap-1 py-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {category.name}
                  {children.length > 0 && (
                    <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {children.length > 0 && (
                  <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div className="rounded-2xl border bg-popover p-2 shadow-xl">
                      <Link
                        href={categoryHref(category.slug)}
                        className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted"
                      >
                        All {category.name}
                      </Link>
                      <div className="my-1 border-t" />
                      {children.map((child) => (
                        <Link
                          key={child.id}
                          href={categoryHref(child.slug)}
                          className="block rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Search, Account & Cart */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden items-center lg:flex"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="h-9 w-44 rounded-full border bg-muted/40 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:w-60 focus:bg-background focus:outline-none focus:ring-1 focus:ring-ring transition-all"
            />
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </form>

          {/* Search toggle for tablets/mobile */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted lg:hidden"
            aria-label="Search products"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="relative inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </button>

          {/* Customer login / account link */}
          <Link
            href={isAuth ? "/account" : "/login"}
            aria-label={isAuth ? "Customer Account" : "Sign In"}
            title={isAuth ? activeUser?.name || "Account" : "Sign In"}
            className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Cart with Item Badge Indicator */}
          <Link
            href="/cart"
            aria-label={`Shopping Cart with ${itemCount} items`}
            className="relative inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile/Tablet Expandable Search Input */}
      {searchOpen && (
        <div className="border-t bg-background px-4 py-3 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clothes, accessories, and essentials..."
              className="h-10 w-full rounded-full border bg-muted/40 pl-9 pr-10 text-sm focus:bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div id="mobile-navigation" className="border-t bg-background md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {/* Search inside drawer */}
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="h-10 w-full rounded-full border bg-muted/40 pl-9 pr-4 text-sm focus:bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </form>

            <nav aria-label="Mobile Navigation" className="space-y-4">
              <div>
                <Link
                  href="/products"
                  className="block py-2 text-base font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  Shop all products
                </Link>
              </div>

              {categories.map((category) => {
                const children = category.children ?? [];

                return (
                  <div key={category.id} className="border-t pt-3">
                    <Link
                      href={categoryHref(category.slug)}
                      className="font-heading text-base font-semibold text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {children.length > 0 && (
                      <ul className="mt-2 space-y-2 border-l pl-4">
                        {children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={categoryHref(child.slug)}
                              className="block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}

              <div className="border-t pt-4">
                <Link
                  href={isAuth ? "/account" : "/login"}
                  className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="h-4 w-4" />
                  {isAuth ? "My Account" : "Sign In / Register"}
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Shopping Bag ({itemCount})
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
