import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProduct } from "@/features/products/api/products.api";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductPurchasePanel } from "@/features/products/components/product-purchase-panel";
import { RatingBreakdown } from "@/features/products/components/rating-breakdown";
import { RatingStars } from "@/features/products/components/rating-stars";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return { title: "Product not found" };
  }

  const product = await getProduct(productId);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description:
      product.description?.slice(0, 160) ??
      `Shop ${product.name} at Nocfinity.`,
    openGraph: product.primary_image
      ? { images: [{ url: product.primary_image }] }
      : undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link href="/products" className="hover:text-foreground">
          Shop all
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-foreground"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span aria-current="page" className="truncate text-foreground">
          {product.name}
        </span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="lg:pt-2">
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          {product.reviews_count > 0 && (
            <a href="#reviews" className="mt-3 inline-flex">
              <RatingStars
                rating={product.average_rating}
                count={product.reviews_count}
                showValue
              />
            </a>
          )}

          <div className="mt-6">
            <ProductPurchasePanel product={product} />
          </div>

          {product.description && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide">
                Details
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <section id="reviews" className="mt-16 scroll-mt-24 lg:mt-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Community
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Reviews
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Only approved reviews are shown.
          </p>
        </div>

        <div className="mt-6">
          {product.reviews_count > 0 ? (
            <RatingBreakdown
              averageRating={product.average_rating}
              reviewsCount={product.reviews_count}
              breakdown={product.rating_breakdown}
            />
          ) : (
            <div className="rounded-2xl border border-dashed p-8 text-center">
              <p className="font-medium">No reviews yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Be the first to share how this piece fits and feels.
              </p>
            </div>
          )}
        </div>
      </section>

      {product.related_products.length > 0 && (
        <section className="mt-16 lg:mt-20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Keep exploring
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                You may also like
              </h2>
            </div>
            {product.category && (
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                More in {product.category.name}
              </Link>
            )}
          </div>
          <div className="mt-8">
            <ProductGrid products={product.related_products} />
          </div>
        </section>
      )}
    </div>
  );
}
