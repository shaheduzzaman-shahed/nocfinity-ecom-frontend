import type { StorefrontCategory } from "../types/category.types";

export function categoryHref(category: StorefrontCategory): string {
  return `/categories/${category.slug}`;
}

/**
 * Returns the chain from the root category to the matching category, which is
 * exactly what the breadcrumb needs. Returns null when the slug is unknown.
 */
export function findCategoryPath(
  categories: StorefrontCategory[],
  slug: string,
  ancestors: StorefrontCategory[] = []
): StorefrontCategory[] | null {
  for (const category of categories) {
    const path = [...ancestors, category];

    if (category.slug === slug) {
      return path;
    }

    const childPath = findCategoryPath(category.children ?? [], slug, path);

    if (childPath) {
      return childPath;
    }
  }

  return null;
}

export function countCategories(categories: StorefrontCategory[]): number {
  return categories.reduce(
    (total, category) => total + 1 + countCategories(category.children ?? []),
    0
  );
}

export function findCategoryById(
  categories: StorefrontCategory[],
  categoryId: number
): StorefrontCategory | null {
  for (const category of categories) {
    if (category.id === categoryId) {
      return category;
    }

    const match = findCategoryById(category.children ?? [], categoryId);

    if (match) {
      return match;
    }
  }

  return null;
}
