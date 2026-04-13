import { apiFetch } from "@/lib/api/client";

/* ================= TYPES ================= */

export type Product = {
  _id?: string;
  name: string;
  description?: string;
  category: string;
  subCategory?: string;
  price: number;

  images?: { url: string; public_id?: string }[];
  variants?: { name: string; stock: number; sku?: string }[];

  // dynamic
  size?: string;
  color?: string;

  weight?: string;
  unit?: string;
  expiry?: string;
};

/* ================= CREATE ================= */
export const createProduct = async (data: Product) => {
  return apiFetch("/product", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/* ================= GET ALL (SELLER) ================= */
export const getMyProducts = async () => {
  return apiFetch("/product/my");
};

/* ================= GET SINGLE ================= */
export const getProductById = async (id: string) => {
  return apiFetch(`/product/${id}`);
};

/* ================= UPDATE ================= */
export const updateProduct = async (id: string, data: Product) => {
  return apiFetch(`/product/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/* ================= DELETE ================= */
export const deleteProduct = async (id: string) => {
  return apiFetch(`/product/${id}`, {
    method: "DELETE",
  });
};

// import { apiFetch } from "@/lib/api/client";

// export const getProducts = async () => {
//     return apiFetch("/product/my");
// };
// export const getMyProducts = async () => {
//     return apiFetch("/product/my");
// };

// export const getProductById = async (id: string) => {
//     return apiFetch(`/product/${id}`);
// };

// export const updateProduct = async (id: string, data: any) => {
//     return apiFetch(`/product/${id}`, {
//         method: "PUT",
//         body: JSON.stringify(data),
//     });
// };

// export const deleteProductById = async (id: string) => {
//     return apiFetch(`/product/${id}`, {
//         method: "DELETE",
//     });
// };