// app/order-success/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  _id: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  Paid: "text-green-600",
  Pending: "text-yellow-600",
  Failed: "text-red-600",
  COD: "text-blue-600",
};

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

        if (!res.ok) {
          setOrder(null);
          return;
        }

        const data = await res.json();

        // 🔥 IMPORTANT: backend sends { success, order }
        setOrder(data.order);
      } catch (error) {
        console.error("Order fetch error:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading order details...
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!order?._id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-3">
          Order not found
        </h2>
        <Link
          href="/account/orders"
          className="underline text-black"
        >
          Go to My Orders
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white pt-28 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border p-10">

          {/* SUCCESS ICON */}
          <div className="flex justify-center mb-8">
            <div className="bg-green-100 text-green-600 w-24 h-24 flex items-center justify-center rounded-full text-5xl shadow-inner">
              ✓
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Order Placed Successfully 🎉
          </h1>

          <p className="text-center text-gray-600 mb-10">
            Thank you for shopping with{" "}
            <span className="font-semibold text-black">
              RK Fashion House
            </span>
          </p>

          {/* ORDER DETAILS */}
          <div className="bg-gray-50 rounded-2xl p-8 border space-y-4 text-sm">

            <div className="flex justify-between">
              <span>Order ID</span>
              <span className="font-semibold">
                #{order._id.slice(-8).toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Date</span>
              <span>
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="font-medium">
                {order.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Payment Status</span>
              <span
                className={`font-semibold ${
                  statusColors[order.paymentStatus] ||
                  "text-gray-600"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between text-lg font-bold pt-4 border-t">
              <span>Total Amount</span>
              <span>₹{order.totalAmount}</span>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">

            <Link
              href="/account/orders"
              className="px-8 py-3 bg-black text-white rounded-xl font-medium text-center hover:bg-gray-800 transition"
            >
              View My Orders
            </Link>

            <Link
              href="/"
              className="px-8 py-3 border rounded-xl font-medium text-center hover:bg-gray-100 transition"
            >
              Continue Shopping
            </Link>

          </div>

        </div>
      </div>
    </main>
  );
}
