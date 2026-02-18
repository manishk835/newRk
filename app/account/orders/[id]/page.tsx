// app/account/orders/[id]/page.tsx

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
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Packed: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
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
          router.replace("/login?redirect=/account/orders");
          return;
        }
  
        if (!res.ok) {
          setOrder(null);
          return;
        }
  
        const data = await res.json();
        setOrder(data); // ✅ direct single order
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchOrder();
    }
  }, [id, router]);
  
  /* ================= ACTIONS ================= */
  const handleCancel = async () => {
    if (!order) return;

    setActionLoading(true);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/cancel`,
        { method: "PUT", credentials: "include" }
      );

      router.refresh();
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
        { method: "PUT", credentials: "include" }
      );

      router.refresh();
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="text-center text-gray-500 py-20 animate-pulse">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold mb-3">
          Order not found
        </h2>
        <Link
          href="/account/orders"
          className="underline text-black"
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

      {/* Back */}
      <Link
        href="/account/orders"
        className="text-sm text-gray-600 hover:underline"
      >
        ← Back to Orders
      </Link>

      <div className="bg-white border rounded-2xl shadow-sm p-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 mb-10">
          <div>
            <p className="text-xs text-gray-500">Order ID</p>
            <p className="font-semibold text-lg">
              #{order._id.slice(-6)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(order.createdAt).toLocaleString("en-IN")}
            </p>
          </div>

          <span
            className={`px-4 py-2 text-sm font-medium rounded-full h-fit ${
              statusStyles[order.status] ||
              "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* ================= TRACKING TIMELINE ================= */}
        {order.status !== "Cancelled" && (
          <div className="mb-14">
            <h3 className="font-semibold mb-10 text-lg">
              Order Progress
            </h3>

            <div className="relative">

              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />

              <div
                className="absolute top-5 left-0 h-1 bg-green-500 rounded-full transition-all duration-700"
                style={{
                  width:
                    currentStepIndex >= 0
                      ? `${
                          (currentStepIndex /
                            (orderSteps.length - 1)) *
                          100
                        }%`
                      : "0%",
                }}
              />

              <div className="flex justify-between">
                {orderSteps.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent =
                    index === currentStepIndex;

                  const historyItem =
                    order.statusHistory?.find(
                      (h) => h.status === step
                    );

                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center relative z-10"
                    >
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                            ? "bg-black text-white animate-pulse"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {isCompleted ? "✔" : index + 1}
                      </div>

                      <p className="text-xs mt-3 font-medium">
                        {step}
                      </p>

                      {historyItem && (
                        <p className="text-[11px] text-gray-500 mt-1">
                          {new Date(
                            historyItem.updatedAt
                          ).toLocaleDateString("en-IN")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Cancelled State */}
        {order.status === "Cancelled" && (
          <div className="mb-8 text-red-600 font-medium">
            This order has been cancelled.
          </div>
        )}

        {/* Estimated Delivery */}
        {order.estimatedDelivery &&
          order.status !== "Cancelled" && (
            <div className="mb-8 text-sm text-gray-600">
              Estimated Delivery:{" "}
              <span className="font-medium">
                {new Date(
                  order.estimatedDelivery
                ).toLocaleDateString("en-IN")}
              </span>
            </div>
          )}

        {/* ITEMS */}
        <div className="space-y-4 mb-8">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b pb-4"
            >
              <div>
                <p className="font-medium">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="font-semibold">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="flex justify-between text-lg font-semibold mb-8">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>

        {/* Invoice */}
        <div className="mb-8">
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/invoice`}
            target="_blank"
            className="inline-block px-6 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            Download Invoice
          </a>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 flex-wrap">

          {["Pending", "Confirmed", "Packed"].includes(order.status) && (
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {actionLoading
                ? "Cancelling..."
                : "Cancel Order"}
            </button>
          )}

          {order.status === "Delivered" &&
            !order.isReturnRequested && (
              <button
                onClick={handleReturn}
                disabled={actionLoading}
                className="px-6 py-2 bg-black text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {actionLoading
                  ? "Requesting..."
                  : "Request Return"}
              </button>
            )}

          {order.isReturnRequested && (
            <span className="text-sm text-gray-600 mt-2">
              Return requested successfully
            </span>
          )}
        </div>
      </div>
    </div>
  );
}