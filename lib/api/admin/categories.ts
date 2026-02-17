import { adminFetch } from "./core";

export function fetchCategories() {
  return adminFetch("/api/categories");
}

export function createCategory(payload: any) {
  return adminFetch("/api/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCategory(
  id: string,
  payload: any
) {
  return adminFetch(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
