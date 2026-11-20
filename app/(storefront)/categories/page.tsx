import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryTree } from "@/features/categories/api/categories.api";
import { CategoryCard } from "@/features/categories/components/category-card";
import { countCategories } from "@/features/categories/lib/category-utils";

export const metadata: Metadata = {
  title: "Shop by category",
  description: "Browse every Nocfinity category and collection.",
};

export default async function CategoriesPage() {
  const categories = await getCategoryTree();
  const total = countCategories(categories);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
        The catalog
      </p>
      <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        Shop by category
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Browse our collections by category. Every category opens into its own
        curated selection of pieces.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {total} {total === 1 ? "category" : "categories"} available
      </p>

      {categories.length === 0 ? (
        <div className="mt-12 rounded-[1.75rem] border border-dashed p-12 text-center">
          <p className="font-heading text-xl font-semibold">
            The catalog is being prepared
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Categories will appear here as soon as they are published.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex text-sm font-medium underline-offset-4 hover:underline"
          >
            Back to the homepage
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
