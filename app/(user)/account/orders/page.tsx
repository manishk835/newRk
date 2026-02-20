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

        // sort latest first
        const sorted = Array.isArray(data)
          ? data.sort(
              (a: Order, b: Order) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
          : [];

        setOrders(sorted);
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
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-100 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (orders.length === 0) {
    return (
      <div className="text-center py-24">
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
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          My Orders
        </h1>
        <span className="text-sm text-gray-500">
          {orders.length} Orders
        </span>
      </div>

      <div className="space-y-5">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/account/orders/${order._id}`}
            className="block bg-white border rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">

              {/* LEFT SECTION */}
              <div className="space-y-1">
                <p className="text-xs text-gray-500">
                  Order ID
                </p>

                <p className="font-semibold text-lg tracking-wide">
                  #{order._id.slice(-6)}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* RIGHT SECTION */}
              <div className="text-left sm:text-right space-y-2">
                <p className="font-semibold text-lg">
                  ₹{order.totalAmount}
                </p>

                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full ${
                    statusStyles[order.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {order.status}
                </span>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
