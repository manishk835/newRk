const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

/* ======================================================
   CORE ADMIN FETCH (COOKIE BASED)
====================================================== */

export async function adminFetch(
  url: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include", // 🔥 important (cookie send karega)
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 || res.status === 403) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new Error("Admin session expired");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Admin API failed");
  }

  return res.json();
}
