import { cn } from "cn";
import type { StorefrontCategory } from "../types/category.types";

interface CategoryImageProps {
  category: StorefrontCategory;
  className?: string;
}

export function CategoryImage({ category, className }: CategoryImageProps) {
  if (category.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={category.image}
        alt={category.name}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-300 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-700",
        className
      )}
    >
      <span className="font-heading text-6xl font-semibold text-foreground/15">
        {category.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
