// lib/adminUpload.ts
import { adminFetch } from "./adminApi";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  if (!token) throw new Error("Not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload/image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Upload failed");
  }

  return res.json(); // { url, publicId }
}
