// app/account/orders/page.tsx

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

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Packed: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
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
  
        if (res.status === 401) {
          router.replace("/login?redirect=/account/orders");
          return;
        }
  
        if (!res.ok) {
          setOrders([]);
          return;
        }
  
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, [router]);
  
  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="text-center text-gray-500 py-20">
        Loading your orders...
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">📦</div>
        <h2 className="text-xl font-semibold mb-2">
          No orders yet
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven't placed any orders.
        </p>
        <Link
          href="/products"
          className="inline-block bg-black text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  /* ================= LIST ================= */
  return (
    <div className="space-y-6">

      {orders.map((order) => (
        <Link
          key={order._id}
          href={`/account/orders/${order._id}`}
          className="block bg-white border rounded-2xl p-6 hover:shadow-lg transition"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

            {/* LEFT */}
            <div>
              <p className="text-xs text-gray-500">
                Order ID
              </p>
              <p className="font-semibold text-lg">
                #{order._id.slice(-6)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <p className="font-semibold text-lg">
                ₹{order.totalAmount}
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                  statusStyles[order.status] ||
                  "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            </div>

          </div>
        </Link>
      ))}

    </div>
  );
}