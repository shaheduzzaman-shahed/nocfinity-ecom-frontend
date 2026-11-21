import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "cn";
import { categoryHref } from "../lib/category-utils";
import type { StorefrontCategory } from "../types/category.types";
import { CategoryImage } from "./category-image";

export function CategoryCard({
  category,
  className,
}: {
  category: StorefrontCategory;
  className?: string;
}) {
  const children = category.children ?? [];
  const href = categoryHref(category);

  return (
    <article className={cn(className)}>
      <Link
        href={href}
        className="group block overflow-hidden rounded-[1.75rem] bg-muted"
      >
        <CategoryImage
          category={category}
          className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-semibold">
            <Link
              href={href}
              className="underline-offset-4 hover:underline"
            >
              {category.name}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {category.description ??
              `${children.length} ${
                children.length === 1 ? "subcategory" : "subcategories"
              }`}
          </p>
        </div>
        <Link
          href={href}
          aria-label={`Browse ${category.name}`}
          className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors hover:bg-muted"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {children.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {children.slice(0, 4).map((child) => (
            <li key={child.id}>
              <Link
                href={categoryHref(child)}
                className="hover:text-foreground"
              >
                {child.name}
              </Link>
            </li>
          ))}
          {children.length > 4 && <li>+{children.length - 4} more</li>}
        </ul>
      )}
    </article>
  );
}
