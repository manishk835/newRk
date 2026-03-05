// lib/api/client.ts

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

    /* ================= ERROR HANDLING ================= */

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status}`;

      try {
        const data = await res.json();
        errorMessage = data?.message || errorMessage;
      } catch {}

      throw new Error(errorMessage);
    }

    /* ================= JSON RESPONSE ================= */

    const text = await res.text();

    return text ? JSON.parse(text) : null;

  } catch (error: any) {
    console.error("API ERROR:", error.message);
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