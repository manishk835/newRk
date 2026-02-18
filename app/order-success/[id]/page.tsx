"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Order {
  _id: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${id}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          setOrder(data.order);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Order not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 p-10">

          <div className="flex justify-center mb-8">
            <div className="bg-green-500/10 text-green-600 w-24 h-24 flex items-center justify-center rounded-full text-5xl shadow-inner">
              ✓
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center text-gray-900 mb-3">
            Order Placed Successfully 🎉
          </h1>

          <p className="text-center text-gray-600 mb-10 text-lg">
            Thank you for shopping with{" "}
            <span className="font-semibold text-black">
              RK Fashion House
            </span>
          </p>

          <div className="bg-gray-50 rounded-2xl p-8 border space-y-5">

            <div className="flex justify-between">
              <span>Order ID</span>
              <span className="font-semibold">
                #{order._id.slice(-8).toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Payment Status</span>
              <span className="text-green-600 font-semibold">
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="font-semibold">
                {order.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Amount</span>
              <span className="font-semibold">
                ₹{order.totalAmount}
              </span>
            </div>

          </div>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">

            <Link
              href="/orders"
              className="px-10 py-4 bg-black text-white rounded-2xl font-semibold text-center hover:bg-gray-800 transition"
            >
              View My Orders
            </Link>

            <Link
              href="/"
              className="px-10 py-4 border border-gray-300 rounded-2xl font-semibold text-center hover:bg-gray-100 transition"
            >
              Continue Shopping
            </Link>

          </div>

        </div>
      </div>
    </main>
  );
}
