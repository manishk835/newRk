"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Banner = {
  _id: string;
  title: string;
  image: string;
  isActive: boolean;
};

/* ================= PAGE ================= */

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/banners`,
          {
            credentials: "include", // 🔥 cookie send karega
            cache: "no-store",
          }
        );

        if (res.status === 401 || res.status === 403) {
          window.location.href = "/admin/login";
          return;
        }

        if (!res.ok) throw new Error();

        const data = await res.json();
        setBanners(data || []);
      } catch (err) {
        console.error("Banners fetch error:", err);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-10">
        Loading banners...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-10 pb-16 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">
        Homepage Banners
      </h1>

      {banners.length === 0 ? (
        <p className="text-gray-600">
          No banners found
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div
              key={b._id}
              className="border rounded-xl bg-white overflow-hidden"
            >
              <img
                src={b.image}
                alt={b.title}
                className="h-40 w-full object-cover"
              />

              <div className="p-4 flex justify-between items-center">
                <p className="font-medium">
                  {b.title}
                </p>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    b.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {b.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
