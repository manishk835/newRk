"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await apiFetch("/seller/products");
      setProducts(data || []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        My Products
      </h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-center">Price</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="border-t">
                  <td className="px-6 py-4">{p.title}</td>
                  <td className="px-6 py-4 text-center">₹{p.price}</td>
                  <td className="px-6 py-4 text-center">{p.totalStock}</td>
                  <td className="px-6 py-4 text-center">
                    {p.isApproved ? (
                      <span className="text-green-600">Approved</span>
                    ) : (
                      <span className="text-yellow-600">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}