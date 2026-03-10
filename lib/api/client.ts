const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ================= GENERIC API FETCH ================= */

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  try {

    const res = await fetch(`${API_URL}/api${endpoint}`, {
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },

      ...options,
    });

    /* ================= READ BODY SAFELY ================= */

    let data: any = null;

    try {
      const text = await res.text();
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    /* ================= ERROR HANDLING ================= */

    if (!res.ok) {

      const message =
        data?.message || `HTTP ${res.status}`;

      /* business errors → return instead of throw */

      if (
        message.includes("already submitted") ||
        message.includes("already applied")
      ) {
        return {
          success: false,
          message,
        };
      }

      /* auth errors */

      if (res.status === 401) {
        throw new Error("Unauthorized");
      }

      /* other errors */

      throw new Error(message);
    }

    /* ================= SUCCESS ================= */

    return data;

  } catch (error: any) {

    const message = error?.message || "Request failed";

    /* network errors */

    if (message === "Failed to fetch") {
      console.error("Network error:", message);
    }

    throw error;
  }
}

// // frontend → lib/api/client.ts
// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export async function apiFetch(
//   endpoint: string,
//   options: RequestInit = {}
// ) {
//   const res = await fetch(`${API_URL}/api${endpoint}`, {
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers,
//     },
//     ...options,
//   });

//   if (!res.ok) {
//     const error = await res.json().catch(() => ({}));
//     throw new Error(error.message || `HTTP ${res.status}`);
//   }

//   return res.json();
// }