// app/(admin)/admin/withdraw/page.tsx

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

type WithdrawRequest = {
  _id: string;

  seller: {
    name: string;
    email: string;
  };

  amount: number;

  status: string;

  createdAt: string;
};

export default function AdminWithdrawPage() {

  const { showToast } =
    useToast();

  const [data, setData] =
    useState<
      WithdrawRequest[]
    >([]);

  const [loading, setLoading] =
    useState(true);

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
    actionType,
    setActionType,
  ] = useState<
    | "approve"
    | "reject"
    | null
  >(null);

  const [
    selectedId,
    setSelectedId,
  ] = useState<
    string | null
  >(null);

  /* ================= LOAD ================= */

  const loadData =
    async () => {
      try {

        setLoading(true);

        const res =
          await apiFetch(
            "/withdrawals?status=Pending"
          );

        setData(
          res || []
        );

      } catch {

        showToast(
          "Failed to load requests",
          "error"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    loadData();
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

        setActionLoading(
          selectedId
        );

        await apiFetch(
          `/withdrawals/${selectedId}/${actionType}`,
          {
            method: "PATCH",
          }
        );

        setData(
          (prev) =>
            prev.filter(
              (i) =>
                i._id !==
                selectedId
            )
        );

        showToast(
          actionType ===
            "approve"
            ? "Withdrawal approved"
            : "Withdrawal rejected",
          "success"
        );

      } catch {

        showToast(
          "Action failed",
          "error"
        );

      } finally {

        setActionLoading(
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

  /* ================= OPEN MODAL ================= */

  const openConfirm = (
    type:
      | "approve"
      | "reject",
    id: string
  ) => {

    setSelectedId(id);

    setActionType(type);

    setConfirmOpen(true);
  };

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
    ).format(value || 0);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">

        <div>

          <div className="h-8 w-52 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-2" />

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
    <div className="max-w-6xl mx-auto space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-2xl font-bold text-black dark:text-white">
          Withdraw Requests
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage seller withdrawal approvals
        </p>

      </div>

      {/* EMPTY */}
      {data.length ===
      0 ? (

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-10 text-center shadow-sm">

          <p className="text-gray-500 dark:text-gray-400">
            No pending requests
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
                    Seller
                  </th>

                  <th className="p-4">
                    Email
                  </th>

                  <th className="p-4">
                    Amount
                  </th>

                  <th className="p-4">
                    Date
                  </th>

                  <th className="p-4">
                    Action
                  </th>

                </tr>

              </thead>

              {/* BODY */}
              <tbody>

                {data.map(
                  (item) => {

                    const isLoading =
                      actionLoading ===
                      item._id;

                    return (
                      <tr
                        key={
                          item._id
                        }
                        className="border-t border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition"
                      >

                        {/* SELLER */}
                        <td className="p-4 font-medium text-black dark:text-white">
                          {
                            item
                              .seller
                              ?.name
                          }
                        </td>

                        {/* EMAIL */}
                        <td className="p-4 text-gray-600 dark:text-gray-400">
                          {
                            item
                              .seller
                              ?.email
                          }
                        </td>

                        {/* AMOUNT */}
                        <td className="p-4 font-semibold text-green-600">
                          {formatCurrency(
                            item.amount
                          )}
                        </td>

                        {/* DATE */}
                        <td className="p-4 text-gray-500 dark:text-gray-400 text-xs">
                          {new Date(
                            item.createdAt
                          ).toLocaleString()}
                        </td>

                        {/* ACTION */}
                        <td className="p-4">

                          <div className="flex gap-2">

                            <button
                              disabled={
                                isLoading
                              }
                              onClick={() =>
                                openConfirm(
                                  "approve",
                                  item._id
                                )
                              }
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs transition disabled:opacity-50"
                            >
                              Approve
                            </button>

                            <button
                              disabled={
                                isLoading
                              }
                              onClick={() =>
                                openConfirm(
                                  "reject",
                                  item._id
                                )
                              }
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs transition disabled:opacity-50"
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

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title={
          actionType ===
          "approve"
            ? "Approve withdrawal?"
            : "Reject withdrawal?"
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