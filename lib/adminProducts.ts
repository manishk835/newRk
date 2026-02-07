// lib/adminProducts.ts
import { adminFetch } from "./adminApi";

/* ======================================================
   ADMIN PRODUCTS
   ====================================================== */

export async function createProduct(payload: any) {
  return adminFetch("/api/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchProductById(id: string) {
  return adminFetch(`/api/products/id/${id}`);
}

export async function updateProduct(
  id: string,
  payload: any
) {
  return adminFetch(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}


// // lib/adminProducts.ts
// import { fetchAllOrders } from "./adminApi"; // ensures token logic is loaded

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// function getToken() {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("admin_token");
// }

// export async function createProduct(payload: any) {
//   const token = getToken();
//   if (!token) throw new Error("Not authenticated");

//   const res = await fetch(
//     `${BASE_URL}/api/products`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     }
//   );

//   if (!res.ok) {
//     const data = await res.json().catch(() => ({}));
//     throw new Error(data?.message || "Create failed");
//   }

//   return res.json();
// }

// export async function fetchProductById(id: string) {
//     return adminFetch(`/api/products/id/${id}`);
//   }
  
//   export async function updateProduct(id: string, payload: any) {
//     return adminFetch(`/api/products/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(payload),
//     });
//   }
  