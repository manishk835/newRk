"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await apiFetch("/seller/orders");
      setOrders(data || []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-center">Total</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-t">
                  <td className="px-6 py-4">{order._id}</td>
                  <td className="px-6 py-4 text-center">₹{order.totalAmount}</td>
                  <td className="px-6 py-4 text-center">{order.status}</td>
                  <td className="px-6 py-4 text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
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