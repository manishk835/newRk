// app/admin/sellers/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Seller = {
  _id: string;
  name: string;
  email: string;
  sellerInfo?: {
    storeName?: string;
  };
};

export default function AdminSellersPage() {
  const router = useRouter();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/sellers/pending`,
        { credentials: "include" }
      );

      if (res.status === 401 || res.status === 403) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      setSellers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const approve = async (id: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/sellers/${id}/approve`,
      {
        method: "PUT",
        credentials: "include",
      }
    );

    fetchSellers();
  };

  const reject = async (id: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/sellers/${id}/reject`,
      {
        method: "PUT",
        credentials: "include",
      }
    );

    fetchSellers();
  };

  if (loading) return <div className="pt-28 px-6">Loading...</div>;

  return (
    <div className="pt-28 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Pending Sellers
      </h1>

      {sellers.length === 0 ? (
        <p>No pending sellers</p>
      ) : (
        <div className="space-y-6">
          {sellers.map((seller) => (
            <div
              key={seller._id}
              className="border rounded-xl p-6 bg-white"
            >
              <h2 className="font-semibold text-lg">
                {seller.name}
              </h2>
              <p className="text-sm text-gray-600">
                {seller.email}
              </p>
              <p className="text-sm mt-2">
                Store: {seller.sellerInfo?.storeName}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => approve(seller._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm"
                >
                  Approve
                </button>

                <button
                  onClick={() => reject(seller._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
