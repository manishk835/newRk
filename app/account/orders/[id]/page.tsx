// app/account/orders/[id]page.tsx


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const phone = localStorage.getItem("userPhone");
    if (!phone) {
      router.push("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/${id}?phone=${phone}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          setOrder(null);
          return;
        }

        const data = await res.json();
        setOrder(data);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-28">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-6 pt-28">
        <p className="text-gray-600">Order not found.</p>
      </div>
    );
  }

  return (
    <main className="pt-24 bg-[#FAFAFA] min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Link
          href="/account"
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Orders
        </Link>

        <div className="bg-white border rounded-2xl p-6 mt-4">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold">
                #{order._id.slice(-6)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : order.status === "Cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* ITEMS */}
          <div className="space-y-3 mb-6">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-sm border-b pb-2"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
