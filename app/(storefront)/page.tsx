import Link from "next/link";
import {
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { getCategoryTree } from "@/features/categories/api/categories.api";
import { CategoryCard } from "@/features/categories/components/category-card";
import {
  getFeaturedProducts,
  getProducts,
} from "@/features/products/api/products.api";
import { ProductGrid } from "@/features/products/components/product-grid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredProducts, newArrivalsData] = await Promise.all([
    getCategoryTree(),
    getFeaturedProducts(),
    getProducts({ per_page: 4, sort: "newest" }),
  ]);

  const newArrivals = newArrivalsData.products;

  return (
    <div className="space-y-16 pb-16 lg:space-y-24 lg:pb-24">
      {/* 1. Hero Banner Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/50 via-muted/20 to-background">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground shadow-sm backdrop-blur">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              New Collection 2026
            </div>

            <h1 className="font-heading text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Considered pieces for every day.
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Discover focused collections of modern essentials. Crafted from
              sustainable, tactile fabrics made to be worn season after season
              and styled your way.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow"
              >
                Shop Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex h-12 items-center justify-center rounded-full border bg-background px-7 text-sm font-medium transition-colors hover:bg-muted"
              >
                Explore Categories
              </Link>
            </div>
          </div>

          {/* Hero Visual Card (Desktop 1440px / Mobile 390px responsive) */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-square overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-300 shadow-xl dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-700">
            {/* Background design accents */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/40 via-transparent to-transparent dark:from-amber-950/20" />

            <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10">
              <div className="flex justify-end">
                <span className="rounded-full bg-background/80 px-4 py-1.5 text-xs font-medium uppercase tracking-widest shadow-sm backdrop-blur">
                  Limited Edition
                </span>
              </div>

              <div className="space-y-3 rounded-2xl bg-background/70 p-6 backdrop-blur-md dark:bg-background/80">
                <p className="font-heading text-2xl font-bold leading-tight sm:text-3xl text-foreground">
                  Designed to endure,
                  <br />
                  made to be lived in.
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  100% certified organic cotton, merino wool & natural dyed twill.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Value Props / Store Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 rounded-3xl border bg-card p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold">Free Delivery</p>
              <p className="text-xs text-muted-foreground">On all orders over $100</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold">Ethically Sourced</p>
              <p className="text-xs text-muted-foreground">Certified organic materials</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold">30-Day Returns</p>
              <p className="text-xs text-muted-foreground">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold">Secure Checkout</p>
              <p className="text-xs text-muted-foreground">Encrypted Stripe payments</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Collections
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Shop by category
            </h2>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            All categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="mt-10 rounded-[1.75rem] border border-dashed p-12 text-center">
            <p className="font-heading text-lg font-semibold">
              The catalog is being prepared
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Categories will appear here as soon as they are published.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Featured Products Section (From /api/v1/featured-products) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Curated Selection
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Featured pieces
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Explore all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10">
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* 5. Promotional Section / Editorial Feature (Figma Reference) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground text-background">
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-16">
            <div className="space-y-6">
              <span className="inline-block rounded-full bg-background/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-background backdrop-blur">
                Limited Promotion
              </span>

              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-background">
                The Minimalist Capsule.
                <br />
                Save 20% on essentials.
              </h2>

              <p className="max-w-xl text-sm leading-relaxed text-background/80 sm:text-base">
                Refine your rotation with timeless cuts and clean palettes. Use
                code <strong className="font-mono text-background">SAVE20</strong> at
                checkout for $20 off qualifying orders.
              </p>

              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-background px-6 text-sm font-medium text-foreground transition-transform hover:scale-105 active:scale-95"
                >
                  Shop the Promotion
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-background/20 bg-background/10 p-8 backdrop-blur-sm">
              <p className="font-heading text-xl font-semibold text-background">
                Responsible Luxury
              </p>
              <p className="mt-2 text-xs leading-relaxed text-background/70 sm:text-sm">
                Every garment is crafted in small batches to eliminate overproduction.
                Designed in our atelier to accompany you through every season.
              </p>
              <div className="mt-6 flex items-center gap-3 text-xs text-background/90">
                <span className="size-2 rounded-full bg-emerald-400" />
                Ethical production guaranteed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Just Landed
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                New arrivals
              </h2>
            </div>
            <Link
              href="/products?sort=newest"
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              View all new arrivals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10">
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}
    </div>
  );
}
