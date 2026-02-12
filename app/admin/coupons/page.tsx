"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Coupon = {
  _id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  expiryDate?: string;
};

/* ================= PAGE ================= */

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const token = localStorage.getItem("admin_token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/coupons`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setCoupons(data || []);
      } catch (err) {
        console.error("Coupons fetch error:", err);
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-10">
        Loading coupons...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-10 pb-16 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">
        Coupons
      </h1>

      {coupons.length === 0 ? (
        <p className="text-gray-600">
          No coupons created
        </p>
      ) : (
        <div className="space-y-4">
          {coupons.map((c) => (
            <div
              key={c._id}
              className="border rounded-xl p-5 bg-white flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {c.code}
                </p>
                <p className="text-sm text-gray-600">
                  {c.discountPercent}% off
                </p>
                {c.expiryDate && (
                  <p className="text-xs text-gray-500">
                    Expires:{" "}
                    {new Date(
                      c.expiryDate
                    ).toLocaleDateString("en-IN")}
                  </p>
                )}
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  c.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {c.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
