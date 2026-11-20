import type {
  AdminCategory,
  CategoryTreeRow,
} from "../types/admin-category.types";

export function flattenCategoryTree(
  categories: AdminCategory[],
  depth = 0
): CategoryTreeRow[] {
  return categories.flatMap((category) => [
    { category, depth },
    ...flattenCategoryTree(category.children ?? [], depth + 1),
  ]);
}

export function findCategoryById(
  categories: AdminCategory[],
  categoryId: number
): AdminCategory | null {
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

export function collectCategoryBranchIds(category: AdminCategory): number[] {
  return [
    category.id,
    ...(category.children ?? []).flatMap(collectCategoryBranchIds),
  ];
}

/**
 * Flattened parent options for the category form, excluding the edited
 * category and its descendants so a cycle cannot be selected.
 */
export function categoryParentOptions(
  categories: AdminCategory[],
  excludeCategoryId: number | null = null
): CategoryTreeRow[] {
  const excludedIds = new Set<number>();

  if (excludeCategoryId !== null) {
    const excludedCategory = findCategoryById(categories, excludeCategoryId);

    if (excludedCategory) {
      collectCategoryBranchIds(excludedCategory).forEach((id) =>
        excludedIds.add(id)
      );
    } else {
      excludedIds.add(excludeCategoryId);
    }
  }

  return flattenCategoryTree(categories).filter(
    (row) => !excludedIds.has(row.category.id)
  );
}
