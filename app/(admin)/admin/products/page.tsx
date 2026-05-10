// 📄 app/(admin)/admin/products/page.tsx

"use client";

import {
  useEffect,
  useState,
} from "react";

import { apiFetch } from "@/lib/api/client";

import {
  useToast,
  ConfirmModal,
} from "@/components/ui/ui-utils";

/* ================= TYPES ================= */

type Product = {
  _id: string;

  name: string;

  price: number;

  isActive: boolean;

  isApproved: boolean;

  createdAt: string;
};

/* ================= PAGE ================= */

export default function AdminProductsPage() {

  const { showToast } =
    useToast();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [
    actionLoading,
    setActionLoading,
  ] = useState<
    string | null
  >(null);

  const [
    confirmOpen,
    setConfirmOpen,
  ] = useState(false);

  const [
    selectedId,
    setSelectedId,
  ] = useState<
    string | null
  >(null);

  /* ================= LOAD ================= */

  const loadProducts =
    async () => {
      try {

        setLoading(true);

        const res =
          await apiFetch(
            "/admin/products"
          );

        setProducts(
          res || []
        );

      } catch {

        showToast(
          "Failed to load products",
          "error"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= ACTIONS ================= */

  const handleAction =
    async (
      type: string,
      id: string
    ) => {
      try {

        setActionLoading(id);

        /* DELETE */
        if (
          type === "delete"
        ) {

          await apiFetch(
            `/admin/products/${id}`,
            {
              method:
                "DELETE",
            }
          );

          setProducts(
            (prev) =>
              prev.filter(
                (p) =>
                  p._id !==
                  id
              )
          );

          showToast(
            "Product deleted",
            "success"
          );
        }

        /* APPROVE */
        if (
          type ===
          "approve"
        ) {

          await apiFetch(
            `/admin/products/${id}/approve`,
            {
              method:
                "PUT",
            }
          );

          setProducts(
            (prev) =>
              prev.map(
                (p) =>
                  p._id ===
                  id
                    ? {
                        ...p,
                        isApproved:
                          true,
                      }
                    : p
              )
          );

          showToast(
            "Product approved",
            "success"
          );
        }

        /* TOGGLE */
        if (
          type === "toggle"
        ) {

          await apiFetch(
            `/admin/products/${id}/toggle-active`,
            {
              method:
                "PUT",
            }
          );

          setProducts(
            (prev) =>
              prev.map(
                (p) =>
                  p._id ===
                  id
                    ? {
                        ...p,
                        isActive:
                          !p.isActive,
                      }
                    : p
              )
          );

          showToast(
            "Product status updated",
            "success"
          );
        }

      } catch {

        showToast(
          "Action failed",
          "error"
        );

      } finally {

        setActionLoading(
          null
        );

      }
    };

  /* ================= DELETE FLOW ================= */

  const openDelete = (
    id: string
  ) => {

    setSelectedId(id);

    setConfirmOpen(true);
  };

  const confirmDelete =
    async () => {

      if (!selectedId)
        return;

      await handleAction(
        "delete",
        selectedId
      );

      setConfirmOpen(false);

      setSelectedId(
        null
      );
    };

  /* ================= FILTER ================= */

  const filtered =
    products.filter(
      (p) => {

        const matchSearch =
          p.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        if (
          filter ===
          "approved"
        ) {
          return (
            p.isApproved &&
            matchSearch
          );
        }

        if (
          filter ===
          "pending"
        ) {
          return (
            !p.isApproved &&
            matchSearch
          );
        }

        return matchSearch;
      }
    );

  /* ================= FORMAT ================= */

  const formatCurrency = (
    value: number
  ) =>
    new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(
      value || 0
    );

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-5">

        <div>

          <div className="h-8 w-60 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-2" />

          <div className="h-4 w-72 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />

        </div>

        {[...Array(6)].map(
          (_, i) => (

            <div
              key={i}
              className="h-16 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse"
            />

          )
        )}

      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold text-black dark:text-white">
          Products Management
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage marketplace products and approvals
        </p>

      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* SEARCH */}
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-3 rounded-xl outline-none w-full md:w-72"
        />

        {/* FILTER */}
        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value
            )
          }
          className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
        >

          <option value="all">
            All Products
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="pending">
            Pending
          </option>

        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">

        {filtered.length ===
        0 ? (

          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            No products found
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              {/* HEAD */}
              <thead className="bg-gray-100 dark:bg-zinc-800 text-left text-gray-700 dark:text-gray-300">

                <tr>

                  <th className="p-4">
                    Product
                  </th>

                  <th className="p-4">
                    Price
                  </th>

                  <th className="p-4">
                    Approval
                  </th>

                  <th className="p-4">
                    Status
                  </th>

                  <th className="p-4">
                    Action
                  </th>

                </tr>

              </thead>

              {/* BODY */}
              <tbody>

                {filtered.map(
                  (p) => (

                    <tr
                      key={p._id}
                      className="border-t border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition"
                    >

                      {/* NAME */}
                      <td className="p-4 font-medium text-black dark:text-white">
                        {p.name}
                      </td>

                      {/* PRICE */}
                      <td className="p-4 text-black dark:text-white">
                        {formatCurrency(
                          p.price
                        )}
                      </td>

                      {/* APPROVAL */}
                      <td className="p-4">

                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            p.isApproved
                              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300"
                          }`}
                        >

                          {p.isApproved
                            ? "Approved"
                            : "Pending"}

                        </span>

                      </td>

                      {/* ACTIVE */}
                      <td className="p-4">

                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            p.isActive
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                              : "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                          }`}
                        >

                          {p.isActive
                            ? "Active"
                            : "Disabled"}

                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td className="p-4">

                        <div className="flex flex-wrap gap-2">

                          {!p.isApproved && (

                            <button
                              onClick={() =>
                                handleAction(
                                  "approve",
                                  p._id
                                )
                              }
                              disabled={
                                actionLoading ===
                                p._id
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs transition disabled:opacity-50"
                            >
                              Approve
                            </button>

                          )}

                          <button
                            onClick={() =>
                              handleAction(
                                "toggle",
                                p._id
                              )
                            }
                            disabled={
                              actionLoading ===
                              p._id
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-xs transition disabled:opacity-50"
                          >
                            Toggle
                          </button>

                          <button
                            onClick={() =>
                              openDelete(
                                p._id
                              )
                            }
                            disabled={
                              actionLoading ===
                              p._id
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs transition disabled:opacity-50"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete Product?"
        description="This action cannot be undone"
        onConfirm={
          confirmDelete
        }
        onCancel={() =>
          setConfirmOpen(
            false
          )
        }
      />

    </div>
  );
}