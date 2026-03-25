"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

export default function WithdrawPage() {
  const [requests, setRequests] = useState<any[]>([]);

  const load = async () => {
    const res = await apiFetch("/admin/withdraw-requests");
    setRequests(res);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (r: any) => {
    await apiFetch("/admin/withdraw/approve", {
      method: "POST",
      body: JSON.stringify({
        userId: r.userId,
        txnIndex: r.txnIndex,
      }),
    });
    load();
  };

  const reject = async (r: any) => {
    await apiFetch("/admin/withdraw/reject", {
      method: "POST",
      body: JSON.stringify({
        userId: r.userId,
        txnIndex: r.txnIndex,
      }),
    });
    load();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Withdraw Requests
      </h1>

      {requests.length === 0 ? (
        <p>No requests</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r, i) => (
            <div
              key={i}
              className="border p-4 rounded-lg flex justify-between"
            >
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-sm text-gray-500">
                  ₹{r.amount}
                </p>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => approve(r)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => reject(r)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}