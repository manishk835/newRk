"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Order = {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          router.replace("/login?redirect=/orders");
          return;
        }

        const data = await res.json();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="pt-32 text-center text-gray-500">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-xl font-semibold mb-4">
          No orders yet
        </h2>
        <Link
          href="/products"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen pt-24">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">

        <h1 className="text-2xl font-semibold">
          My Orders
        </h1>

        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/orders/${order._id}`}
            className="block bg-white border rounded-2xl p-6 hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-medium">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  ₹{order.totalAmount}
                </p>
                <p className="text-sm text-gray-500">
                  {order.status}
                </p>
              </div>
            </div>
          </Link>
        ))}

      </div>
    </main>
  );
}
