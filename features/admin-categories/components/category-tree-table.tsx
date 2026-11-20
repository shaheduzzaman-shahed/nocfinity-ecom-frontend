"use client";

import Link from "next/link";
import { CornerDownRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { flattenCategoryTree } from "../lib/category-tree";
import type { AdminCategory } from "../types/admin-category.types";

interface CategoryTreeTableProps {
  categories: AdminCategory[];
  canManage: boolean;
  togglingCategoryId: number | null;
  onDelete: (category: AdminCategory) => void;
  onToggleStatus: (category: AdminCategory) => void;
}

export function CategoryTreeTable({
  categories,
  canManage,
  togglingCategoryId,
  onDelete,
  onToggleStatus,
}: CategoryTreeTableProps) {
  const rows = flattenCategoryTree(categories);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Products</th>
            <th className="px-4 py-3 font-medium">Sort</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map(({ category, depth }) => {
            const productCount = category.products_count ?? 0;
            const hasProducts = productCount > 0;

            return (
              <tr key={category.id} className="align-middle">
                <td className="px-4 py-3">
                  <div
                    className="flex items-center gap-2"
                    style={{ paddingLeft: `${depth * 22}px` }}
                  >
                    {depth > 0 && (
                      <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        /{category.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      category.is_active
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {category.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {productCount}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {category.sort_order}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {canManage ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleStatus(category)}
                          disabled={togglingCategoryId === category.id}
                        >
                          {category.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          Edit
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => onDelete(category)}
                          disabled={hasProducts}
                          title={
                            hasProducts
                              ? "Move or delete this category's products first."
                              : undefined
                          }
                        >
                          Delete
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        View only
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
