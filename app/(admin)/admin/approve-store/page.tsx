// app/(admin)/admin/approve-store/page.tsx

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

type Application = {
  _id: string;

  businessName: string;

  email: string;

  phone: string;

  category: string;

  message: string;

  status: string;

  createdAt: string;
};

/* ================= PAGE ================= */

export default function ApproveStorePage() {

  const { showToast } =
    useToast();

  const [apps, setApps] =
    useState<
      Application[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [
    processingId,
    setProcessingId,
  ] = useState<
    string | null
  >(null);

  const [search, setSearch] =
    useState("");

  const [
    confirmOpen,
    setConfirmOpen,
  ] = useState(false);

  const [
    actionType,
    setActionType,
  ] = useState<
    | "approved"
    | "rejected"
    | null
  >(null);

  const [
    selectedId,
    setSelectedId,
  ] = useState<
    string | null
  >(null);

  /* ================= LOAD ================= */

  const loadApplications =
    async () => {
      try {

        setLoading(true);

        const res =
          await apiFetch(
            "/vendors"
          );

        const pending =
          Array.isArray(
            res
          )
            ? res.filter(
                (
                  a
                ) =>
                  a.status ===
                  "pending"
              )
            : [];

        setApps(
          pending
        );

      } catch {

        showToast(
          "Failed to load applications",
          "error"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    loadApplications();
  }, []);

  /* ================= ACTION ================= */

  const handleAction =
    async () => {

      if (
        !selectedId ||
        !actionType
      ) {
        return;
      }

      try {

        setProcessingId(
          selectedId
        );

        await apiFetch(
          `/vendors/${selectedId}/status`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                status:
                  actionType,
              }
            ),
          }
        );

        setApps(
          (prev) =>
            prev.filter(
              (a) =>
                a._id !==
                selectedId
            )
        );

        showToast(
          actionType ===
            "approved"
            ? "Seller approved"
            : "Seller rejected",
          "success"
        );

      } catch {

        showToast(
          "Action failed",
          "error"
        );

      } finally {

        setProcessingId(
          null
        );

        setConfirmOpen(
          false
        );

        setSelectedId(
          null
        );

        setActionType(
          null
        );

      }
    };

  const openConfirm = (
    type:
      | "approved"
      | "rejected",
    id: string
  ) => {

    setSelectedId(id);

    setActionType(type);

    setConfirmOpen(true);
  };

  /* ================= FILTER ================= */

  const filtered =
    apps.filter(
      (a) =>
        a.businessName
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-5">

        <div>

          <div className="h-8 w-60 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-2" />

          <div className="h-4 w-72 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />

        </div>

        {[...Array(5)].map(
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-black dark:text-white">
            Seller Applications
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review and approve seller requests
          </p>

        </div>

        <button
          onClick={
            loadApplications
          }
          className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
        >
          Refresh
        </button>

      </div>

      {/* SEARCH */}
      <input
        placeholder="Search business..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-3 rounded-xl outline-none w-full md:w-80"
      />

      {/* EMPTY */}
      {filtered.length ===
      0 ? (

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-10 text-center shadow-sm">

          <p className="text-gray-500 dark:text-gray-400">
            No pending applications
          </p>

        </div>

      ) : (

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              {/* HEAD */}
              <thead className="bg-gray-100 dark:bg-zinc-800 text-left text-gray-700 dark:text-gray-300">

                <tr>

                  <th className="p-4">
                    Business
                  </th>

                  <th className="p-4">
                    Email
                  </th>

                  <th className="p-4">
                    Phone
                  </th>

                  <th className="p-4">
                    Category
                  </th>

                  <th className="p-4">
                    Message
                  </th>

                  <th className="p-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              {/* BODY */}
              <tbody>

                {filtered.map(
                  (app) => {

                    const isLoading =
                      processingId ===
                      app._id;

                    return (
                      <tr
                        key={
                          app._id
                        }
                        className="border-t border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition"
                      >

                        {/* BUSINESS */}
                        <td className="p-4 font-medium text-black dark:text-white">
                          {
                            app.businessName
                          }
                        </td>

                        {/* EMAIL */}
                        <td className="p-4 text-gray-600 dark:text-gray-400">
                          {
                            app.email
                          }
                        </td>

                        {/* PHONE */}
                        <td className="p-4 text-black dark:text-white">
                          {
                            app.phone
                          }
                        </td>

                        {/* CATEGORY */}
                        <td className="p-4 capitalize text-black dark:text-white">
                          {
                            app.category
                          }
                        </td>

                        {/* MESSAGE */}
                        <td className="p-4 text-gray-500 dark:text-gray-400 max-w-xs">
                          <p className="line-clamp-2">
                            {
                              app.message
                            }
                          </p>
                        </td>

                        {/* ACTIONS */}
                        <td className="p-4 text-right">

                          <div className="flex justify-end gap-2">

                            <button
                              onClick={() =>
                                openConfirm(
                                  "approved",
                                  app._id
                                )
                              }
                              disabled={
                                isLoading
                              }
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition disabled:opacity-50"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                openConfirm(
                                  "rejected",
                                  app._id
                                )
                              }
                              disabled={
                                isLoading
                              }
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition disabled:opacity-50"
                            >
                              Reject
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title={
          actionType ===
          "approved"
            ? "Approve seller?"
            : "Reject seller?"
        }
        description="This action cannot be undone"
        onConfirm={
          handleAction
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