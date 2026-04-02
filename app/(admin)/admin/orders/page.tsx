"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { useToast, ConfirmModal } from "@/components/ui/ui-utils";

/* ================= TYPES ================= */

type Order = {
  _id: string;
  user: { name: string; email: string };
  totalAmount: number;
  status: string;
  createdAt: string;
};

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState<string | null>(null);

  /* ================= LOAD ================= */

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/admin/orders");
      setOrders(res || []);
    } catch {
      showToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async () => {
    if (!selectedId || !nextStatus) return;

    try {
      setActionLoading(selectedId);

      await apiFetch(`/admin/orders/${selectedId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus }),
      });

      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedId ? { ...o, status: nextStatus } : o
        )
      );

      showToast("Order updated", "success");
    } catch {
      showToast("Update failed", "error");
    } finally {
      setActionLoading(null);
      setConfirmOpen(false);
      setSelectedId(null);
      setNextStatus(null);
    }
  };

  const openConfirm = (id: string, status: string) => {
    setSelectedId(id);
    setNextStatus(status);
    setConfirmOpen(true);
  };

  /* ================= FILTER ================= */

  const filtered = orders.filter((o) => {
    const matchSearch = o.user?.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    if (statusFilter === "all") return matchSearch;

    return o.status === statusFilter && matchSearch;
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="p-6 text-gray-500">Loading orders...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Orders Management</h1>

      {/* FILTERS */}
      <div className="flex gap-3 flex-wrap">
        <input
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Update</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((o) => {
              const isLoading = actionLoading === o._id;

              return (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">{o.user?.name}</div>
                    <div className="text-xs text-gray-500">
                      {o.user?.email}
                    </div>
                  </td>

                  <td className="p-3 font-semibold">
                    {formatCurrency(o.totalAmount)}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        o.status
                      )}`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="p-3 text-gray-500">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>

                  <td className="p-3">
                    <select
                      disabled={isLoading}
                      value={o.status}
                      onChange={(e) =>
                        openConfirm(o._id, e.target.value)
                      }
                      className="border px-2 py-1 rounded text-xs"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CONFIRM */}
      <ConfirmModal
        open={confirmOpen}
        title="Update order status?"
        description={`Change status to ${nextStatus}`}
        onConfirm={updateStatus}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
