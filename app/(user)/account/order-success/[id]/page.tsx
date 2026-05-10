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
        setOrder(data?.order || null);

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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-gray-600 dark:text-gray-400 transition-colors duration-300">
        Fetching your order...
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!order?._id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white dark:bg-black transition-colors duration-300">

        <h2 className="text-xl font-semibold text-black dark:text-white mb-3">
          Order not found
        </h2>

        <Link
          href="/account/orders"
          className="underline text-black dark:text-white"
        >
          Go to My Orders
        </Link>

      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-black pt-28 pb-24 transition-colors duration-300">

      <div className="container mx-auto px-4">

        <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-200 dark:border-zinc-800 p-10 transition-colors duration-300">

          {/* SUCCESS ICON */}
          <div className="flex justify-center mb-8">

            <div
              className={`w-24 h-24 flex items-center justify-center rounded-full text-5xl shadow-inner ${
                order.paymentStatus === "Failed"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              ✓
            </div>

          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-center text-black dark:text-white mb-4">

            {order.paymentStatus === "Failed"
              ? "Payment Failed ❌"
              : "Order Placed Successfully 🎉"}

          </h1>

          <p className="text-center text-gray-600 dark:text-gray-400 mb-10">

            Thank you for shopping with{" "}

            <span className="font-semibold text-black dark:text-white">
              RK Fashion House
            </span>

          </p>

          {/* ORDER DETAILS */}
          <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl p-8 border border-gray-200 dark:border-zinc-800 space-y-4 text-sm transition-colors duration-300">

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Order ID
              </span>

              <span className="font-semibold text-black dark:text-white">
                #{order._id.slice(-8).toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Date
              </span>

              <span className="text-black dark:text-white">
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Payment Method
              </span>

              <span className="font-medium text-black dark:text-white">
                {order.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Payment Status
              </span>

              <span
                className={`font-semibold ${
                  statusColors[order.paymentStatus] ||
                  "text-gray-600"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200 dark:border-zinc-700">

              <span className="text-black dark:text-white">
                Total Amount
              </span>

              <span className="text-black dark:text-white">
                ₹{order.totalAmount}
              </span>

            </div>

          </div>

          {/* BUTTONS */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">

            <Link
              href="/account/orders"
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium text-center hover:bg-gray-800 dark:hover:bg-gray-200 transition"
            >
              View My Orders
            </Link>

            <Link
              href="/products"
              className="px-8 py-3 border border-gray-300 dark:border-zinc-700 text-black dark:text-white rounded-xl font-medium text-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              Continue Shopping
            </Link>

          </div>

        </div>
      </div>
    </main>
  );
}