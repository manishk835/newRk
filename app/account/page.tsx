// app/account/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  title: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
};

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const phone = localStorage.getItem("userPhone");
    if (!phone) return;

    const fetchOrders = async () => {
      const res = await fetch(
        `http://localhost:5000/api/orders/my?phone=${phone}`,
        { cache: "no-store" }
      );

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  if (orders.length === 0) {
    return (
      <div className="bg-white border rounded-2xl p-10 text-center">
        <p className="text-lg font-medium mb-2">No orders yet</p>
        <Link href="/products" className="bg-black text-white px-6 py-3 rounded-xl inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="bg-white border rounded-2xl p-6">
          <p className="font-medium">#{order._id.slice(-6)}</p>
          <p>Total: ₹{order.totalAmount}</p>

          <Link
            href={`/account/orders/${order._id}`}
            className="inline-block mt-3 border px-4 py-2 rounded-lg text-sm"
          >
            View Order
          </Link>
        </div>
      ))}
    </div>
  );
}


