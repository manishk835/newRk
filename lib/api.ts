// lib/api.ts
import { Product } from "@/components/product/product.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API request failed");
  }
  return res.json();
}

/* ======================================================
   PRODUCTS
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

/**
 * ✅ UPDATED
 * Fetch products by category with sorting
 *
 * Examples:
 * /category/men
 * /category/men?sort=price-low
 * /category/men?type=shirt&sort=az
 */
export async function fetchProductsByCategory(
  category: string,
  params?: {
    type?: string;
    sort?: string;
  }
): Promise<Product[]> {
  const query = new URLSearchParams();

  if (params?.type) {
    query.set("type", params.type);
  }

  if (params?.sort) {
    query.set("sort", params.sort);
  }

  const queryString = query.toString()
    ? `?${query.toString()}`
    : "";

  const res = await fetch(
    `${BASE_URL}/api/products/category/${category}${queryString}`,
    { cache: "no-store" }
  );

  return handleResponse<Product[]>(res);
}

/* ======================================================
   ORDERS
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

export async function fetchUserOrders(
  phone: string
) {
  const res = await fetch(
    `${BASE_URL}/api/orders/my?phone=${encodeURIComponent(phone)}`,
    { cache: "no-store" }
  );

  return handleResponse(res);
}


// // lib/api.ts
// import { Product } from "@/components/product/product.types";

// /**
//  * Base API URL
//  * Example: http://localhost:5000
//  */
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// /**
//  * Helper: handle API response
//  */
// async function handleResponse<T>(res: Response): Promise<T> {
//   if (!res.ok) {
//     const errorText = await res.text();
//     throw new Error(errorText || "API request failed");
//   }
//   return res.json();
// }

// /* ======================================================
//    PRODUCTS
//    ====================================================== */

// /**
//  * Fetch all products
//  * Used on: Home, Products page
//  */
// export async function fetchProducts(): Promise<Product[]> {
//   const res = await fetch(`${BASE_URL}/api/products`, {
//     cache: "no-store",
//   });

//   return handleResponse<Product[]>(res);
// }

// /**
//  * Fetch single product by slug
//  * Used on: Product detail page
//  */
// export async function fetchProductBySlug(
//   slug: string
// ): Promise<Product> {
//   const res = await fetch(
//     `${BASE_URL}/api/products/slug/${slug}`,
//     { cache: "no-store" }
//   );

//   return handleResponse<Product>(res);
// }

// /**
//  * Search products
//  * Used on: Search page
//  */
// export async function searchProducts(
//   query: string
// ): Promise<Product[]> {
//   const res = await fetch(
//     `${BASE_URL}/api/products/search?q=${encodeURIComponent(query)}`,
//     { cache: "no-store" }
//   );

//   return handleResponse<Product[]>(res);
// }

// /**
//  * Fetch products by category (+ optional type / subCategory)
//  * Used on: Category pages
//  * Example:
//  * /category/men
//  * /category/men?type=kurta
//  */
// export async function fetchProductsByCategory(
//   category: string,
//   params?: { type?: string }
// ): Promise<Product[]> {
//   const query = params?.type
//     ? `?type=${encodeURIComponent(params.type)}`
//     : "";

//   const res = await fetch(
//     `${BASE_URL}/api/products/category/${category}${query}`,
//     { cache: "no-store" }
//   );

//   return handleResponse<Product[]>(res);
// }

// /* ======================================================
//    ORDERS
//    ====================================================== */

// export type CreateOrderPayload = {
//   name: string;
//   phone: string;
//   address: string;
//   city: string;
//   pincode: string;
//   paymentMethod: "COD";
//   totalAmount: number;
//   items: {
//     productId: string;
//     title: string;
//     quantity: number;
//     price: number;
//   }[];
// };

// /**
//  * Create new order
//  * Used on: Checkout
//  */
// export async function createOrder(
//   payload: CreateOrderPayload
// ) {
//   const res = await fetch(`${BASE_URL}/api/orders`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   return handleResponse(res);
// }

// /**
//  * Fetch user orders by phone
//  * Used on: My Orders / Account page
//  */
// export async function fetchUserOrders(
//   phone: string
// ) {
//   const res = await fetch(
//     `${BASE_URL}/api/orders/my?phone=${encodeURIComponent(phone)}`,
//     { cache: "no-store" }
//   );

//   return handleResponse(res);
// }
