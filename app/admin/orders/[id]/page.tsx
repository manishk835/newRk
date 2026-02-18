"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

/* ================= TYPES ================= */

type OrderItem = {
  title: string;
  price: number;
  quantity: number;
};

type StatusHistoryItem = {
  status: string;
  updatedAt: string;
};

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type Order = {
  _id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  statusHistory?: StatusHistoryItem[];
  createdAt: string;
};

const STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "text-yellow-600",
  Processing: "text-blue-600",
  Shipped: "text-purple-600",
  Delivered: "text-green-600",
  Cancelled: "text-red-600",
};

/* ================= PAGE ================= */

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  /* ================= FETCH ORDER ================= */

  const fetchOrder = async () => {
    try {
      if (!id) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/admin/${id}`,
        {
          cache: "no-store",
          credentials: "include", // 🔥 cookie based
        }
      );

      if (res.status === 401 || res.status === 403) {
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) throw new Error("Order not found");

      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error("Fetch order error:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (newStatus: OrderStatus) => {
    if (!order || newStatus === order.status) return;

    try {
      setUpdating(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${order._id}/status`,
        {
          method: "PUT",
          credentials: "include", // 🔥 cookie based
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) throw new Error("Status update failed");

      await fetchOrder();
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-28">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-6 pt-28">
        Order not found
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="container mx-auto px-6 pt-28 pb-16 max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">
        Order #{order?._id?.slice(-6)}
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        Placed on{" "}
        {new Date(order.createdAt).toLocaleDateString("en-IN")}
      </p>

      <div className="mb-6 flex items-center gap-4">
        <span className="text-sm">Status:</span>

        <span className={`font-semibold ${STATUS_COLORS[order.status]}`}>
          {order.status}
        </span>

        <select
          value={order.status}
          disabled={updating}
          onChange={(e) =>
            updateStatus(e.target.value as OrderStatus)
          }
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {updating && (
          <span className="text-xs text-gray-500">
            Updating...
          </span>
        )}
      </div>

      <div className="border rounded-xl p-5 mb-6">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm mb-2">
            <span>
              {item.title} × {item.quantity}
            </span>
            <span>
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}

        <hr className="my-4" />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      <div className="border rounded-xl p-5 mb-6">
        <h2 className="font-semibold mb-2">
          Delivery Address
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          {order.customer.name}
          <br />
          {order.customer.address}
          <br />
          {order.customer.city} – {order.customer.pincode}
          <br />
          📞 {order.customer.phone}
        </p>
      </div>

      <div className="border rounded-xl p-5">
        <h2 className="font-semibold mb-4">
          Status History
        </h2>

        <div className="space-y-3">
          {(order.statusHistory ?? []).length === 0 ? (
            <p className="text-sm text-gray-500">
              No status updates yet
            </p>
          ) : (
            (order.statusHistory ?? []).map((h, i) => (
              <div
                key={`${h.status}-${i}`}
                className="flex justify-between text-sm"
              >
                <span className="font-medium">
                  {h.status}
                </span>
                <span className="text-gray-500">
                  {new Date(h.updatedAt).toLocaleString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
