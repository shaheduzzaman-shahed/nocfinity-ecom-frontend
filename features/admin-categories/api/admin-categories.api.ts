import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type {
  AdminCategory,
  CategoryPayload,
} from "../types/admin-category.types";

function toFormData(payload: CategoryPayload): FormData {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description ?? "");
  formData.append(
    "parent_id",
    payload.parent_id === null ? "" : String(payload.parent_id)
  );
  formData.append("is_active", payload.is_active ? "1" : "0");
  formData.append("sort_order", String(payload.sort_order));

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
}

export const adminCategoriesApi = {
  listCategories() {
    return api.get<ApiSuccessResponse<AdminCategory[]>>("/admin/categories");
  },

  getCategory(categoryId: number) {
    return api.get<ApiSuccessResponse<AdminCategory>>(
      `/admin/categories/${categoryId}`
    );
  },

  createCategory(payload: CategoryPayload) {
    return api.post<ApiSuccessResponse<AdminCategory>>(
      "/admin/categories",
      toFormData(payload)
    );
  },

  updateCategory(categoryId: number, payload: CategoryPayload) {
    const formData = toFormData(payload);
    // PHP only parses multipart bodies on POST, so method spoofing keeps image
    // uploads working when the form has an attached file.
    formData.append("_method", "PUT");

    return api.post<ApiSuccessResponse<AdminCategory>>(
      `/admin/categories/${categoryId}`,
      formData
    );
  },

  updateCategoryStatus(categoryId: number, isActive: boolean) {
    return api.put<ApiSuccessResponse<AdminCategory>>(
      `/admin/categories/${categoryId}`,
      { is_active: isActive }
    );
  },

  deleteCategory(categoryId: number) {
    return api.delete<ApiSuccessResponse<null>>(
      `/admin/categories/${categoryId}`
    );
  },
};
