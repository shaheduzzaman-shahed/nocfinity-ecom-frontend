import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getCategoryTree } from "@/features/categories/api/categories.api";
import { findCategoryById } from "@/features/categories/lib/category-utils";
import { getProducts } from "@/features/products/api/products.api";
import { ProductGrid } from "@/features/products/components/product-grid";

interface ProductsPageProps {
  searchParams: Promise<{ page?: string; category_id?: string }>;
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const { category_id: categoryIdParam } = await searchParams;
  const categoryId = Number(categoryIdParam);
  const categories = Number.isInteger(categoryId)
    ? await getCategoryTree()
    : [];
  const category = Number.isInteger(categoryId)
    ? findCategoryById(categories, categoryId)
    : null;

  return {
    title: category ? category.name : "Shop all",
    description: category
      ? `Shop the ${category.name} collection.`
      : "Browse the latest Nocfinity pieces.",
  };
}

function pageHref(page: number, categoryId: number | undefined): string {
  const params = new URLSearchParams();

  if (categoryId !== undefined) {
    params.set("category_id", String(categoryId));
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/products?${query}` : "/products";
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { page: pageParam, category_id: categoryIdParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const categoryId = Number(categoryIdParam) || undefined;

  const categories = categoryId !== undefined ? await getCategoryTree() : [];
  const category = categoryId
    ? findCategoryById(categories, categoryId)
    : null;

  const { products, meta } = await getProducts({
    page,
    per_page: 12,
    category_id: categoryId,
  });

  const lastPage = meta?.last_page ?? 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        {category ? (
          <>
            <Link href="/products" className="hover:text-foreground">
              Shop all
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span aria-current="page" className="text-foreground">
              {category.name}
            </span>
          </>
        ) : (
          <span aria-current="page" className="text-foreground">
            Shop all
          </span>
        )}
      </nav>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {category ? "Collection" : "The edit"}
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            {category?.name ?? "Shop all"}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {category?.description ??
              "Discover considered wardrobe pieces designed to be worn on repeat."}
          </p>
        </div>
        {meta && (
          <p className="text-sm text-muted-foreground">
            {meta.total} {meta.total === 1 ? "piece" : "pieces"}
          </p>
        )}
      </div>

      <section className="mt-10">
        <ProductGrid products={products} />
      </section>

      {lastPage > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-14 flex items-center justify-center gap-3"
        >
          {page > 1 ? (
            <Link
              href={pageHref(page - 1, categoryId)}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Previous
            </Link>
          ) : (
            <span
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "pointer-events-none opacity-40",
              })}
            >
              Previous
            </span>
          )}

          <span className="text-sm text-muted-foreground">
            Page {page} of {lastPage}
          </span>

          {page < lastPage ? (
            <Link
              href={pageHref(page + 1, categoryId)}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Next
            </Link>
          ) : (
            <span
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "pointer-events-none opacity-40",
              })}
            >
              Next
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
