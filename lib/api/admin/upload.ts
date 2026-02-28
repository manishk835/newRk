
// lib/api/admin/upload.ts
import { adminFetch } from "./core";

/* ======================================================
   ADMIN IMAGE UPLOAD (COOKIE BASED)
====================================================== */

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload/image`,
    {
      method: "POST",
      credentials: "include", // 🔥 cookie send karega
      body: formData,
    }
  );

  if (res.status === 401 || res.status === 403) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new Error("Admin session expired");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Upload failed");
  }

  return res.json(); // { url, publicId }
}

