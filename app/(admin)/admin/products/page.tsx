"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { useToast, ConfirmModal } from "@/components/ui/ui-utils";

/* ================= TYPES ================= */

type Product = {
  _id: string;
  name: string;
  price: number;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
};

export default function AdminProductsPage() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/admin/products");
      setProducts(res || []);
    } catch {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= ACTIONS ================= */

  const handleAction = async (type: string, id: string) => {
    try {
      setActionLoading(id);

      if (type === "delete") {
        await apiFetch(`/admin/products/${id}`, { method: "DELETE" });
        setProducts((prev) => prev.filter((p) => p._id !== id));
        showToast("Product deleted", "success");
      }

      if (type === "approve") {
        await apiFetch(`/admin/products/${id}/approve`, { method: "PUT" });
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isApproved: true } : p))
        );
        showToast("Product approved", "success");
      }

      if (type === "toggle") {
        await apiFetch(`/admin/products/${id}/toggle-active`, { method: "PUT" });
        setProducts((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, isActive: !p.isActive } : p
          )
        );
        showToast("Product status updated", "success");
      }
    } catch {
      showToast("Action failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= DELETE FLOW ================= */

  const openDelete = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    await handleAction("delete", selectedId);
    setConfirmOpen(false);
    setSelectedId(null);
  };

  /* ================= FILTER ================= */

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

    if (filter === "approved") return p.isApproved && matchSearch;
    if (filter === "pending") return !p.isApproved && matchSearch;

    return matchSearch;
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="p-6 text-gray-500">Loading products...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Products Management</h1>

      {/* FILTERS */}
      <div className="flex gap-3 flex-wrap">
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-60"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Active</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{formatCurrency(p.price)}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      p.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      p.isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.isActive ? "Active" : "Disabled"}
                  </span>
                </td>

                <td className="p-3 space-x-2">
                  {!p.isApproved && (
                    <button
                      onClick={() => handleAction("approve", p._id)}
                      disabled={actionLoading === p._id}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Approve
                    </button>
                  )}

                  <button
                    onClick={() => handleAction("toggle", p._id)}
                    disabled={actionLoading === p._id}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() => openDelete(p._id)}
                    disabled={actionLoading === p._id}
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete Product?"
        description="This action cannot be undone"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}