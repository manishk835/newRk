// lib/api.ts
import { Product } from "@/components/product/product.types";

/* ======================================================
   BASE CONFIG
   ====================================================== */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = "API request failed";
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

/* ======================================================
   PRODUCTS (PUBLIC)
   ====================================================== */

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/api/products`, {
    cache: "no-store",
  });
  return handleResponse<Product[]>(res);
}

export async function fetchProductBySlug(
  slug: string
): Promise<Product> {
  const res = await fetch(
    `${BASE_URL}/api/products/slug/${slug}`,
    { cache: "no-store" }
  );
  return handleResponse<Product>(res);
}

export async function searchProducts(
  query: string
): Promise<Product[]> {
  const res = await fetch(
    `${BASE_URL}/api/products/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );
  return handleResponse<Product[]>(res);
}

export async function fetchProductsByCategory(
  category: string,
  params?: {
    type?: string;
    sort?: string;
  }
): Promise<Product[]> {
  const query = new URLSearchParams();

  if (params?.type) query.set("type", params.type);
  if (params?.sort) query.set("sort", params.sort);

  const qs = query.toString() ? `?${query}` : "";

  const res = await fetch(
    `${BASE_URL}/api/products/category/${category}${qs}`,
    { cache: "no-store" }
  );

  return handleResponse<Product[]>(res);
}

/* ======================================================
   ORDERS (USER)
   ====================================================== */

export type CreateOrderPayload = {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: "COD";
  totalAmount: number;
  items: {
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }[];
};

export async function createOrder(
  payload: CreateOrderPayload
) {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function fetchUserOrders(phone: string) {
  const res = await fetch(
    `${BASE_URL}/api/orders/my?phone=${encodeURIComponent(phone)}`,
    { cache: "no-store" }
  );

  return handleResponse(res);
}
