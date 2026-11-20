import { cache } from "react";
import { serverGet } from "@/lib/api/server";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type { StorefrontCategory } from "../types/category.types";

/**
 * Active category tree, deduplicated across the layout and page within a
 * single server request.
 */
export const getCategoryTree = cache(
  async (): Promise<StorefrontCategory[]> => {
    const response = await serverGet<ApiSuccessResponse<StorefrontCategory[]>>(
      "/categories"
    );

    return response?.data ?? [];
  }
);
