"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type Withdrawal = {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  seller: {
    name: string;
    email: string;
  };
};

export default function AdminWithdrawalsPage() {

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ================= */

  const loadWithdrawals = async () => {
    try {

      const data = await apiFetch("/withdrawals/admin");

      setWithdrawals(data || []);

    } catch (err) {
      console.error("Load withdrawals error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  /* ================= APPROVE ================= */

  const approve = async (id: string) => {
    try {

      await apiFetch(
        `/withdrawals/admin/${id}/approve`,
        { method: "PATCH" }
      );

      loadWithdrawals();

    } catch {
      alert("Approve failed");
    }
  };

  /* ================= REJECT ================= */

  const reject = async (id: string) => {
    try {

      await apiFetch(
        `/withdrawals/admin/${id}/reject`,
        { method: "PATCH" }
      );

      loadWithdrawals();

    } catch {
      alert("Reject failed");
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Withdrawal Requests
      </h1>

      <div className="bg-white border rounded-2xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">
                Seller
              </th>

              <th className="p-4 text-left">
                Amount
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Action
              </th>
            </tr>
          </thead>

          <tbody>

            {withdrawals.map((w) => (
              <tr key={w._id} className="border-t">

                <td className="p-4">
                  <div className="font-medium">
                    {w.seller?.name}
                  </div>

                  <div className="text-xs text-gray-500">
                    {w.seller?.email}
                  </div>
                </td>

                <td className="p-4">
                  ₹{w.amount}
                </td>

                <td className="p-4">

                  {w.status === "Pending" && (
                    <span className="text-yellow-600">
                      Pending
                    </span>
                  )}

                  {w.status === "Approved" && (
                    <span className="text-green-600">
                      Approved
                    </span>
                  )}

                  {w.status === "Rejected" && (
                    <span className="text-red-600">
                      Rejected
                    </span>
                  )}

                </td>

                <td className="p-4">
                  {new Date(
                    w.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-4 space-x-3">

                  {w.status === "Pending" && (
                    <>
                      <button
                        onClick={() => approve(w._id)}
                        className="text-green-600"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => reject(w._id)}
                        className="text-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}