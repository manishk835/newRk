"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { useToast, ConfirmModal } from "@/components/ui/ui-utils";

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
  const { showToast } = useToast();

  const [data, setData] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/withdrawals?status=Pending");
      setData(res || []);
    } catch {
      showToast("Failed to load requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= ACTION ================= */

  const handleAction = async () => {
    if (!selectedId || !actionType) return;

    try {
      setActionLoading(selectedId);

      await apiFetch(`/withdrawals/${selectedId}/${actionType}`, {
        method: "PATCH",
      });

      setData((prev) => prev.filter((i) => i._id !== selectedId));

      showToast(
        actionType === "approve"
          ? "Withdrawal approved"
          : "Withdrawal rejected",
        "success"
      );
    } catch {
      showToast("Action failed", "error");
    } finally {
      setActionLoading(null);
      setConfirmOpen(false);
      setSelectedId(null);
      setActionType(null);
    }
  };

  /* ================= OPEN MODAL ================= */

  const openConfirm = (type: "approve" | "reject", id: string) => {
    setSelectedId(id);
    setActionType(type);
    setConfirmOpen(true);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Withdraw Requests</h1>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Withdraw Requests</h1>

      {data.length === 0 ? (
        <p className="text-gray-500">No pending requests</p>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Seller</th>
                <th className="p-3">Email</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => {
                const isLoading = actionLoading === item._id;

                return (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      {item.seller?.name}
                    </td>
                    <td className="p-3 text-gray-600">
                      {item.seller?.email}
                    </td>
                    <td className="p-3 font-semibold">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>

                    <td className="p-3 space-x-2">
                      <button
                        disabled={isLoading}
                        onClick={() => openConfirm("approve", item._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                      >
                        Approve
                      </button>

                      <button
                        disabled={isLoading}
                        onClick={() => openConfirm("reject", item._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title={
          actionType === "approve"
            ? "Approve withdrawal?"
            : "Reject withdrawal?"
        }
        description="This action cannot be undone"
        onConfirm={handleAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}