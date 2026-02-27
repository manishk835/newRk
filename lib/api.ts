// lib/api.ts
import { Product } from "@/components/ui/product/product.types";

/* ======================================================
   BASE CONFIG
====================================================== */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("BASE_URL:", BASE_URL);

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

    // throw new Error(message);
    console.error("API STATUS:", res.status);
console.error("API MESSAGE:", message);
throw new Error(message);
  }

  return res.json();
}




export async function loginUser(data: {
  phone: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function registerUser(data: {
  name: string;
  phone: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

/* ======================================================
   PRODUCTS (PUBLIC)
====================================================== */

/**
 * SAFE PRODUCT FETCH
 * Handles both:
 * 1) Array response
 * 2) { products: [] } response
 */
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/api/products`, {
    cache: "no-store",
  });

  const data = await handleResponse<any>(res);

  // If backend returns array
  if (Array.isArray(data)) {
    return data;
  }

  // If backend returns { products: [...] }
  if (data?.products && Array.isArray(data.products)) {
    return data.products;
  }

  return [];
}

export async function fetchProductBySlug(
  slug: string
): Promise<Product | null> {

  try {
    const res = await fetch(
      `${BASE_URL}/api/products/slug/${slug}`,
      { cache: "no-store" }
    );

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      return null; // ❗ do not crash server component
    }

    const data = await res.json();

    // 🔥 Normalize id → _id
    return {
      ...data,
      _id: data._id || data.id,
    };

  } catch (error) {
    console.error("fetchProductBySlug error:", error);
    return null; // ❗ prevent server crash
  }
}

export async function searchProducts(
  query: string
): Promise<Product[]> {
  const res = await fetch(
   `${BASE_URL}/api/products/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );

  const data = await handleResponse<any>(res);

  if (Array.isArray(data)) return data;
  if (data?.products) return data.products;

  return [];
}

/* ======================================================
   PRODUCTS BY CATEGORY (WITH FILTERS)
====================================================== */

export type FilterCountItem = {
  _id: string;
  count: number;
};

export async function fetchProductsByCategory(
  category: string,
  params?: {
    type?: string;
    sort?: string;
    brand?: string;
    size?: string;
    color?: string;
    rating?: string;
    minPrice?: string;
    maxPrice?: string;
  }
): Promise<{
  products: Product[];
  filters: {
    brands: FilterCountItem[];
    subCategories: FilterCountItem[];
    sizes: FilterCountItem[];
    colors: FilterCountItem[];
    ratings: number[];
    priceRange: {
      minPrice: number;
      maxPrice: number;
    };
  };
}> {
  const query = new URLSearchParams();

  if (params?.type) query.set("type", params.type);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.brand) query.set("brand", params.brand);
  if (params?.size) query.set("size", params.size);
  if (params?.color) query.set("color", params.color);
  if (params?.rating) query.set("rating", params.rating);
  if (params?.minPrice) query.set("minPrice", params.minPrice);
  if (params?.maxPrice) query.set("maxPrice", params.maxPrice);

  const qs = query.toString() ? `?${query}` : "";

  const res = await fetch(
`${BASE_URL}/api/products/category/${category}${qs}`,
    { cache: "no-store" }
  );

  return handleResponse(res);
}

/* ======================================================
   ORDERS (COOKIE BASED)
====================================================== */

export async function createOrder(payload: any) {
  const res = await fetch(`${BASE_URL}/api/admin/orders`, {
    method: "POST",
    credentials: "include", // 🔥 important for auth
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function fetchUserOrders() {
  const res = await fetch(`${BASE_URL}/api/admin/orders/my`, {
    credentials: "include",
    cache: "no-store",
  });

  return handleResponse(res);
}

/* ======================================================
   CATEGORIES
====================================================== */

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    cache: "no-store",
  });

  return handleResponse(res);
}

/* ======================================================
   ALL PRODUCTS (WITH FILTERS)
====================================================== */

export async function fetchAllProducts(
  params?: {
    sort?: string;
    brand?: string;
    size?: string;
    color?: string;
    rating?: string;
    minPrice?: string;
    maxPrice?: string;
  }
): Promise<{
  products: Product[];
  filters: any;
}> {

  const query = new URLSearchParams();

  if (params?.sort) query.set("sort", params.sort);
  if (params?.brand) query.set("brand", params.brand);
  if (params?.size) query.set("size", params.size);
  if (params?.color) query.set("color", params.color);
  if (params?.rating) query.set("rating", params.rating);
  if (params?.minPrice) query.set("minPrice", params.minPrice);
  if (params?.maxPrice) query.set("maxPrice", params.maxPrice);

  const qs = query.toString() ? `?${query}` : "";

  try {
    const res = await fetch(
      `${BASE_URL}/api/products/all${qs}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return { products: [], filters: {} };
    }

    const data = await res.json();

    return {
      ...data,
      products: (data.products || []).map((p: any) => ({
        ...p,
        _id: p._id || p.id, // 🔥 normalize
      })),
    };

  } catch (error) {
    console.error("fetchAllProducts error:", error);
    return { products: [], filters: {} };
  }
}
