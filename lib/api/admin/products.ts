// lib/api/admin/product.ts
import { adminFetch } from "./core";

/* ======================================================
   ADMIN PRODUCTS
   ====================================================== */

// export async function createProduct(payload: any) {
//   return adminFetch("/api/admin/products", {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// }

export async function createProduct(payload: any) {
  return adminFetch("/api/products/seller/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export async function fetchProductById(id: string) {
    return adminFetch(`/api/admin/products/${id}`);
  }
  
  

export async function updateProduct(
  id: string,
  payload: any
) {
  return adminFetch(`/api/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
