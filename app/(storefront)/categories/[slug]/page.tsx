import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCategoryTree } from "@/features/categories/api/categories.api";
import { CategoryCard } from "@/features/categories/components/category-card";
import { CategoryImage } from "@/features/categories/components/category-image";
import {
  categoryHref,
  findCategoryPath,
} from "@/features/categories/lib/category-utils";
import { getProducts } from "@/features/products/api/products.api";
import { ProductGrid } from "@/features/products/components/product-grid";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategoryTree();
  const path = findCategoryPath(categories, slug);
  const category = path?.[path.length - 1];

  if (!category) {
    return { title: "Category not found" };
  }

  return {
    title: category.name,
    description:
      category.description ?? `Shop the ${category.name} collection.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getCategoryTree();
  const path = findCategoryPath(categories, slug);

  if (!path) {
    notFound();
  }

  const category = path[path.length - 1];
  const parent = path.length > 1 ? path[path.length - 2] : null;
  const children = category.children ?? [];
  const { products, meta } = await getProducts({
    category_id: category.id,
    per_page: 12,
  });

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
        <Link href="/categories" className="hover:text-foreground">
          Categories
        </Link>
        {path.map((node, index) => {
          const isCurrent = index === path.length - 1;

          return (
            <Fragment key={node.id}>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              {isCurrent ? (
                <span aria-current="page" className="text-foreground">
                  {node.name}
                </span>
              ) : (
                <Link href={categoryHref(node)} className="hover:text-foreground">
                  {node.name}
                </Link>
              )}
            </Fragment>
          );
        })}
      </nav>

      <section className="mt-6 overflow-hidden rounded-[2rem] bg-muted">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {parent ? parent.name : "Collection"}
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              {category.description ??
                `Explore the ${category.name.toLowerCase()} collection.`}
            </p>
            {children.length > 0 && (
              <p className="mt-6 text-sm text-muted-foreground">
                {children.length}{" "}
                {children.length === 1 ? "subcategory" : "subcategories"}
              </p>
            )}
          </div>
          <div className="min-h-[260px] lg:min-h-[380px]">
            <CategoryImage category={category} />
          </div>
        </div>
      </section>

      {children.length > 0 && (
        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Explore {category.name}
            </h2>
            {parent && (
              <Link
                href={categoryHref(parent)}
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Back to {parent.name}
              </Link>
            )}
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <CategoryCard key={child.id} category={child} />
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                The edit
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                Shop {category.name}
              </h2>
            </div>
            <div className="flex items-center gap-4 text-sm">
              {meta && (
                <span className="text-muted-foreground">
                  {meta.total} {meta.total === 1 ? "piece" : "pieces"}
                </span>
              )}
              <Link
                href={`/products?category_id=${category.id}`}
                className="font-medium underline-offset-4 hover:underline"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <ProductGrid products={products} />
          </div>
        </section>
      )}

      {children.length === 0 && products.length === 0 && (
        <section className="mt-14 rounded-[1.75rem] border border-dashed p-12 text-center">
          <p className="font-heading text-2xl font-semibold">
            Pieces are on the way
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Products for {category.name} will appear here as soon as they are
            published.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm font-medium">
            {parent && (
              <Link
                href={categoryHref(parent)}
                className="underline-offset-4 hover:underline"
              >
                Back to {parent.name}
              </Link>
            )}
            <Link
              href="/categories"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Browse all categories
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
