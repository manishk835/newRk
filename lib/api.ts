// lib/api.ts

const API_BASE_URL = "http://localhost:5000/api";

/* ================= PRODUCTS ================= */

export async function fetchProducts() {
  const res = await fetch(`${API_BASE_URL}/products`, {
    cache: "no-store",
  });
  return res.json();
}

export async function fetchProductBySlug(slug: string) {
  const res = await fetch(
    `${API_BASE_URL}/products/slug/${slug}`,
    { cache: "no-store" }
  );
  return res.json();
}

export async function fetchProductsByCategory(
  category: string,
  params: Record<string, string> = {}
) {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(
    `${API_BASE_URL}/products/category/${category}?${query}`,
    { cache: "no-store" }
  );
  return res.json();
}

/* ================= ORDERS ================= */

export async function createOrder(payload: any) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchUserOrders(phone: string) {
  const res = await fetch(
    `${API_BASE_URL}/orders/my/${phone}`,
    { cache: "no-store" }
  );
  return res.json();
}
