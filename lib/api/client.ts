const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ================= GENERIC API FETCH ================= */

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  try {
    // 🔥 ensure no double /api
    const url = `${API_URL}/api${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const res = await fetch(url, {
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

      // 🔥 handle already applied (your backend case)
      if (
        message.toLowerCase().includes("already")
      ) {
        return {
          success: false,
          message,
        };
      }

      if (res.status === 401) {
        throw new Error("Unauthorized");
      }

      throw new Error(message);
    }

    /* ================= SUCCESS ================= */

    return data;

  } catch (error: any) {

    const message = error?.message || "Request failed";

    if (message === "Failed to fetch") {
      console.error("❌ Network error:", message);
    }

    throw error;
  }
}