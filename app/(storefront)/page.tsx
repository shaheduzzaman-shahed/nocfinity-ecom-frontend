import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategoryTree } from "@/features/categories/api/categories.api";
import { CategoryCard } from "@/features/categories/components/category-card";

export default async function HomePage() {
  const categories = await getCategoryTree();

  return (
    <div>
      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Autumn / Winter 2026
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Considered pieces for every day.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Discover focused collections of modern essentials, made to be
              worn season after season and styled your way.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/categories"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Shop categories
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/categories"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Explore the full catalog
              </Link>
            </div>
          </div>

          <div className="relative hidden aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-300 lg:block dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-700">
            <div className="absolute inset-0 flex items-end p-10">
              <p className="font-heading text-3xl font-semibold leading-tight text-foreground/80">
                Designed to be worn,
                <br />
                not just seen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Featured categories
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Shop by category
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            View all categories
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="mt-10 rounded-[1.75rem] border border-dashed p-12 text-center">
            <p className="font-heading text-xl font-semibold">
              The catalog is being prepared
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Categories will appear here as soon as they are published.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
