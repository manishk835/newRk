// lib/adminApi.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

/* ======================================================
   CORE ADMIN FETCH (EXPORT IS IMPORTANT)
   ====================================================== */

export async function adminFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = getAdminToken();

  if (!token) {
    window.location.href = "/admin/login";
    throw new Error("Admin not authenticated");
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Admin API failed");
  }

  return res.json();
}

/* ======================================================
   ADMIN ORDERS
   ====================================================== */

export function fetchAllOrders() {
  return adminFetch("/api/orders");
}

export function updateOrderStatus(
  orderId: string,
  status: string
) {
  return adminFetch(`/api/orders/${orderId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}


// // lib/adminApi.ts

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// if (!BASE_URL) {
//   throw new Error("NEXT_PUBLIC_API_URL is not defined");
// }

// function getAdminToken() {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("admin_token");
// }

// async function adminFetch(
//   url: string,
//   options: RequestInit = {}
// ) {
//   const token = getAdminToken();

//   if (!token) {
//     throw new Error("Admin not authenticated");
//   }

//   const res = await fetch(`${BASE_URL}${url}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//       ...(options.headers || {}),
//     },
//   });

//   if (res.status === 401) {
//     localStorage.removeItem("admin_token");
//     window.location.href = "/admin/login";
//     throw new Error("Session expired");
//   }

//   if (!res.ok) {
//     const data = await res.json().catch(() => ({}));
//     throw new Error(data?.message || "Admin API failed");
//   }

//   return res.json();
// }

// /* ======================================================
//    ADMIN ORDERS
//    ====================================================== */

// export function fetchAllOrders() {
//   return adminFetch("/api/orders");
// }

// export function updateOrderStatus(
//   orderId: string,
//   status: string
// ) {
//   return adminFetch(`/api/orders/${orderId}`, {
//     method: "PUT",
//     body: JSON.stringify({ status }),
//   });
// }
