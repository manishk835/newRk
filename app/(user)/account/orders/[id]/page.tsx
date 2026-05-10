// app/(user)/account/orders/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  title: string;
  price: number;
  quantity: number;
};

type StatusHistoryItem = {
  status: string;
  updatedAt: string;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  estimatedDelivery?: string;
  isReturnRequested?: boolean;
  statusHistory?: StatusHistoryItem[];
};

const orderSteps = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
];

const statusStyles: Record<string, string> = {
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",

  Confirmed:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",

  Packed:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",

  Shipped:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",

  Delivered:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",

  Cancelled:
    "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export default function OrderDetailPage() {

  const params = useParams();

  const router = useRouter();

  const id = params?.id as string;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

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

          router.replace(
            "/login?redirect=/account/orders"
          );

          return;
        }

        if (!res.ok) {

          setOrder(null);

          return;
        }

        const data = await res.json();

        setOrder(data.order || data);

      } catch {

        setOrder(null);

      } finally {

        setLoading(false);

      }
    };

    fetchOrder();

  }, [id, router]);

  /* ================= ACTIONS ================= */

  const refreshOrder = async () => {

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
      {
        credentials: "include",
        cache: "no-store",
      }
    );

    const data = await res.json();

    setOrder(data.order || data);
  };

  const handleCancel = async () => {

    if (!order) return;

    setActionLoading(true);

    try {

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/cancel`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      await refreshOrder();

    } finally {

      setActionLoading(false);

    }
  };

  const handleReturn = async () => {

    if (!order) return;

    setActionLoading(true);

    try {

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/return`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      await refreshOrder();

    } finally {

      setActionLoading(false);

    }
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="py-20 text-center animate-pulse text-gray-500 dark:text-gray-400">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">

        <h2 className="text-lg font-semibold text-black dark:text-white mb-3">
          Order not found
        </h2>

        <Link
          href="/account/orders"
          className="text-black dark:text-white underline"
        >
          Back to Orders
        </Link>

      </div>
    );
  }

  const currentStepIndex =
    order.status === "Cancelled"
      ? -1
      : orderSteps.indexOf(order.status);

  /* ================= UI ================= */

  return (
    <div className="space-y-8">

      <Link
        href="/account/orders"
        className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
      >
        ← Back to Orders
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-md p-8 transition-colors duration-300">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 mb-10">

          <div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Order ID
            </p>

            <p className="text-lg font-semibold text-black dark:text-white">
              #{order._id.slice(-6)}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {new Date(
                order.createdAt
              ).toLocaleString("en-IN")}
            </p>

          </div>

          <span
            className={`px-4 py-2 rounded-full text-sm font-medium h-fit ${statusStyles[
              order.status
              ] ||
              "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300"
              }`}
          >
            {order.status}
          </span>

        </div>

        {/* TRACKING */}
        {order.status !== "Cancelled" && (

          <div className="mb-14">

            <h3 className="font-semibold text-lg text-black dark:text-white mb-8">
              Order Progress
            </h3>

            <div className="relative">

              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-zinc-700 rounded-full" />

              <div
                className="absolute top-5 left-0 h-1 bg-green-500 rounded-full transition-all duration-500"
                style={{
                  width:
                    currentStepIndex >= 0
                      ? `${(currentStepIndex /
                        (orderSteps.length - 1)) *
                      100
                      }%`
                      : "0%",
                }}
              />

              <div className="flex justify-between">

                {orderSteps.map(
                  (step, index) => {

                    const isCompleted =
                      index < currentStepIndex;

                    const isCurrent =
                      index === currentStepIndex;

                    const historyItem =
                      order.statusHistory?.find(
                        (h) =>
                          h.status === step
                      );

                    return (
                      <div
                        key={step}
                        className="flex flex-col items-center relative z-10"
                      >

                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold ${isCompleted
                              ? "bg-green-500 text-white"
                              : isCurrent
                                ? "bg-black dark:bg-white text-white dark:text-black"
                                : "bg-gray-300 dark:bg-zinc-700 text-gray-600 dark:text-gray-300"
                            }`}
                        >
                          {isCompleted
                            ? "✓"
                            : index + 1}
                        </div>

                        <p className="text-xs mt-3 font-medium text-black dark:text-white">
                          {step}
                        </p>

                        {historyItem && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(
                              historyItem.updatedAt
                            ).toLocaleDateString(
                              "en-IN"
                            )}
                          </p>
                        )}

                      </div>
                    );
                  }
                )}

              </div>
            </div>
          </div>

        )}

        {/* ITEMS */}
        <div className="space-y-5 mb-10">

          {order.items.map((item, i) => (

            <div
              key={i}
              className="flex justify-between border-b border-gray-200 dark:border-zinc-800 pb-4"
            >

              <div>

                <p className="font-medium text-black dark:text-white">
                  {item.title}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quantity: {item.quantity}
                </p>

              </div>

              <p className="font-semibold text-black dark:text-white">
                ₹{item.price * item.quantity}
              </p>

            </div>

          ))}

        </div>

        {/* TOTAL */}
        <div className="flex justify-between text-lg font-semibold text-black dark:text-white mb-8">

          <span>Total</span>

          <span>
            ₹{order.totalAmount}
          </span>

        </div>

        {/* INVOICE */}
        <div className="mb-8">

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/invoice`}
            target="_blank"
            className="inline-block px-6 py-2 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            Download Invoice
          </a>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 flex-wrap">

          {[
            "Pending",
            "Confirmed",
            "Packed",
          ].includes(order.status) && (

              <button
                onClick={() => {

                  const confirmed =
                    window.confirm(
                      "Are you sure you want to cancel this order?"
                    );

                  if (confirmed) {
                    handleCancel();
                  }

                }}
                disabled={actionLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                {actionLoading
                  ? "Cancelling..."
                  : "Cancel Order"}
              </button>

            )}

          {order.status ===
            "Delivered" &&
            !order.isReturnRequested && (

              <button
                onClick={handleReturn}
                disabled={actionLoading}
                className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 disabled:opacity-50 transition"
              >
                {actionLoading
                  ? "Requesting..."
                  : "Request Return"}
              </button>

            )}

          {order.isReturnRequested && (

            <span className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Return requested successfully
            </span>

          )}

        </div>

      </div>
    </div>
  );
}