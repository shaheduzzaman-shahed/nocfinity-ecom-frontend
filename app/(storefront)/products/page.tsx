import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getCategoryTree } from "@/features/categories/api/categories.api";
import { findCategoryById } from "@/features/categories/lib/category-utils";
import {
  getColors,
  getProducts,
  getSizes,
} from "@/features/products/api/products.api";
import { ProductGrid } from "@/features/products/components/product-grid";
import {
  StorefrontFilterSidebar,
  StorefrontProductFilters,
} from "@/features/products/components/storefront-product-filters";
import type { ProductListParams } from "@/features/products/types/product.types";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category_id?: string;
    min_price?: string;
    max_price?: string;
    color_id?: string;
    size_id?: string;
    availability?: "in_stock" | "out_of_stock";
    sort?: "newest" | "price_asc" | "price_desc";
  }>;
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const categoryId = Number(params.category_id);
  const categories = Number.isInteger(categoryId)
    ? await getCategoryTree()
    : [];
  const category = Number.isInteger(categoryId)
    ? findCategoryById(categories, categoryId)
    : null;

  if (params.search) {
    return {
      title: `Search: "${params.search}"`,
      description: `Search results for "${params.search}" in the Nocfinity catalog.`,
    };
  }

  return {
    title: category ? category.name : "Shop all products",
    description: category
      ? `Shop the ${category.name} collection.`
      : "Browse the latest modern fashion essentials.",
  };
}

function buildPageHref(
  targetPage: number,
  params: Record<string, string | undefined>
): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, val]) => {
    if (val && key !== "page") {
      query.set(key, val);
    }
  });

  if (targetPage > 1) {
    query.set("page", String(targetPage));
  }

  const str = query.toString();
  return str ? `/products?${str}` : "/products";
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page) || 1);
  const categoryId = params.category_id ? Number(params.category_id) : undefined;
  const minPrice = params.min_price ? Number(params.min_price) : undefined;
  const maxPrice = params.max_price ? Number(params.max_price) : undefined;

  // Load filter metadata & products concurrently
  const [categories, colors, sizes, productsResponse] = await Promise.all([
    getCategoryTree(),
    getColors(),
    getSizes(),
    getProducts({
      page,
      per_page: 12,
      search: params.search,
      category_id: categoryId,
      min_price: minPrice,
      max_price: maxPrice,
      color_id: params.color_id,
      size_id: params.size_id,
      availability: params.availability,
      sort: params.sort,
    } as ProductListParams),
  ]);

  const { products, meta } = productsResponse;
  const lastPage = meta?.last_page ?? 1;

  const selectedCategory = categoryId
    ? findCategoryById(categories, categoryId)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        {selectedCategory ? (
          <>
            <Link href="/products" className="hover:text-foreground">
              Shop all
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span aria-current="page" className="font-medium text-foreground">
              {selectedCategory.name}
            </span>
          </>
        ) : params.search ? (
          <>
            <Link href="/products" className="hover:text-foreground">
              Shop all
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span aria-current="page" className="font-medium text-foreground">
              Search results
            </span>
          </>
        ) : (
          <span aria-current="page" className="font-medium text-foreground">
            Shop all
          </span>
        )}
      </nav>

      {/* Catalog Header */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {selectedCategory
              ? "Collection"
              : params.search
              ? "Search Query"
              : "Catalog"}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {params.search
              ? `Results for "${params.search}"`
              : selectedCategory?.name ?? "Shop all products"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {selectedCategory?.description ??
              "Explore considered pieces for everyday rotation, designed for comfort and crafted with enduring longevity."}
          </p>
        </div>

        {meta && (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {meta.total} {meta.total === 1 ? "product" : "products"} found
          </p>
        )}
      </div>

      {/* Top Filter Controls: Search Bar, Active Chips & Sort */}
      <div className="mt-6">
        <StorefrontProductFilters
          categories={categories}
          colors={colors}
          sizes={sizes}
          totalProducts={meta?.total}
        />
      </div>

      {/* Main Content Area: Desktop Sidebar + Product Grid */}
      <div className="mt-8 flex items-start gap-8">
        {/* Desktop Filters Sidebar */}
        <StorefrontFilterSidebar
          categories={categories}
          colors={colors}
          sizes={sizes}
          searchParams={params}
        />

        {/* Product Grid & Pagination Area */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} />

          {/* Server-Side Pagination */}
          {lastPage > 1 && (
            <nav
              aria-label="Pagination Navigation"
              className="mt-14 flex items-center justify-center gap-3 border-t pt-8"
            >
              {page > 1 ? (
                <Link
                  href={buildPageHref(page - 1, params)}
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

              <span className="text-xs font-medium text-muted-foreground">
                Page {page} of {lastPage}
              </span>

              {page < lastPage ? (
                <Link
                  href={buildPageHref(page + 1, params)}
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
      </div>
    </div>
  );
}
