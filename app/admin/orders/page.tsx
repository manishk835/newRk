// app/admin/orders/page.tsx


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  useSearchParams,
  useRouter,
} from "next/navigation";

/* ================= TYPES ================= */

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type OrderItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
};

/* ================= CONSTANTS ================= */

const STATUS_OPTIONS: (OrderStatus | "All")[] = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

/* ================= PAGE ================= */

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status") || "All";
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";

  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  /* ================= PARAM HELPER ================= */

  const updateParams = (
    params: Record<string, string>
  ) => {
    const q = new URLSearchParams(
      searchParams.toString()
    );

    Object.entries(params).forEach(([k, v]) => {
      if (v) q.set(k, v);
      else q.delete(k);
    });

    router.push(`?${q.toString()}`);
  };

  /* ================= FETCH ================= */

  useEffect(() => {


    const fetchOrders = async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams();
        if (status !== "All")
          query.set("status", status);
        if (search) query.set("search", search);
        query.set("page", String(page));
        query.set("limit", "8");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders?${query.toString()}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );
        
        if (res.status === 401 || res.status === 403) {
          router.push("/admin/login");
          return;
        }
        
        
        

        if (!res.ok) {
          const errData = await res.json();
          console.log("Orders Fetch Error:", res.status, errData);
          throw new Error(errData.message || "Failed to fetch orders");
        }
        

        const data = await res.json();
        setOrders(data.orders || []);
        setPagination(data.pagination);
      } catch (err) {
        console.error("Orders fetch error:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status, page, search, router]);

  /* ================= UI ================= */

  return (
    <div className="container mx-auto px-6 pt-10 pb-16 max-w-5xl">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">
          Orders
        </h1>

        <input
          defaultValue={search}
          placeholder="Search Order ID / Phone"
          onChange={(e) =>
            updateParams({
              search: e.target.value,
              page: "1",
            })
          }
          className="border px-3 py-2 rounded-md text-sm w-full lg:w-64"
        />

        <select
          value={status}
          onChange={(e) =>
            updateParams({
              status:
                e.target.value === "All"
                  ? ""
                  : e.target.value,
              page: "1",
            })
          }
          className="border rounded-md px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            window.open(
              `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/export/csv`,
              "_blank"
            )
          }
          className="px-4 py-2 bg-black text-white rounded-md text-sm"
        >
          Export CSV
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-600">
          Loading orders...
        </p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">
          No orders found
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/admin/orders/${order._id}`}
              className="block border rounded-2xl p-6 bg-white hover:shadow-md transition"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500">
                    Order ID
                  </p>
                  <p className="font-semibold">
                    #{order._id.slice(-6)}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-700">
                <span>
                  {order.items.length} items
                </span>
                <span className="font-semibold">
                  ₹{order.totalAmount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from(
            { length: pagination.totalPages },
            (_, i) => i + 1
          ).map((p) => (
            <button
              key={p}
              onClick={() =>
                updateParams({ page: String(p) })
              }
              className={`px-3 py-1 rounded-md text-sm border ${
                p === page
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

