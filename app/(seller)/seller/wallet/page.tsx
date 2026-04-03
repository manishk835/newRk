"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

/* ================= TYPES ================= */

type Withdrawal = {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

/* ================= PAGE ================= */

export default function SellerWalletPage() {

  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  /* ================= LOAD ================= */

  const loadWallet = async () => {
    try {
      const seller = await apiFetch("/auth/me");
      const withdrawData = await apiFetch("/withdrawals/my");

      setBalance(seller.walletBalance || 0);
      setWithdrawals(Array.isArray(withdrawData) ? withdrawData : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  /* ================= CALCULATIONS ================= */

  const pendingAmount = withdrawals
    .filter(w => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);

  const availableBalance = balance - pendingAmount;

  /* ================= WITHDRAW ================= */

  const requestWithdraw = async () => {
    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (withdrawAmount < 100) {
      alert("Minimum withdrawal ₹100");
      return;
    }

    if (withdrawAmount > availableBalance) {
      alert("Insufficient available balance");
      return;
    }

    try {
      setRequesting(true);

      await apiFetch("/withdrawals", {
        method: "POST",
        body: JSON.stringify({
          amount: withdrawAmount,
          method: "UPI",
        }),
      });

      setAmount("");
      loadWallet();

    } catch {
      alert("Withdraw request failed");
    } finally {
      setRequesting(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading wallet...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      <h1 className="text-2xl font-bold">
        Wallet & Earnings
      </h1>

      {/* BALANCE CARDS */}

      <div className="grid md:grid-cols-3 gap-6">

        <Card title="Total Balance" value={`₹${balance}`} />

        <Card title="Pending Withdrawals" value={`₹${pendingAmount}`} />

        <Card
          title="Available Balance"
          value={`₹${availableBalance}`}
          highlight
        />

      </div>

      {/* WITHDRAW */}

      <div className="bg-white border rounded-2xl p-6">

        <h3 className="font-semibold mb-4">
          Request Withdrawal
        </h3>

        <div className="flex gap-4 flex-wrap">

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border px-4 py-3 rounded-lg flex-1"
          />

          <button
            onClick={requestWithdraw}
            disabled={requesting}
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            {requesting ? "Processing..." : "Withdraw"}
          </button>

        </div>

        <p className="text-xs text-gray-500 mt-2">
          Minimum withdrawal ₹100
        </p>

      </div>

      {/* HISTORY */}

      <div className="bg-white border rounded-2xl overflow-hidden">

        <div className="p-6 border-b font-semibold">
          Withdrawal History
        </div>

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>

            {withdrawals.map((w) => (
              <tr key={w._id} className="border-t">

                <td className="p-4 font-medium">
                  ₹{w.amount}
                </td>

                <td className="p-4">
                  <StatusBadge status={w.status} />
                </td>

                <td className="p-4 text-gray-500 text-xs">
                  {new Date(w.createdAt).toLocaleString()}
                </td>

              </tr>
            ))}

            {withdrawals.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No withdrawals yet
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

/* ================= CARD ================= */

function Card({
  title,
  value,
  highlight,
}: any) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p
        className={`text-2xl font-bold mt-2 ${
          highlight ? "text-green-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ================= STATUS ================= */

function StatusBadge({ status }: any) {

  let style = "bg-gray-100 text-gray-600";

  if (status === "approved")
    style = "bg-green-100 text-green-700";

  if (status === "pending")
    style = "bg-yellow-100 text-yellow-700";

  if (status === "rejected")
    style = "bg-red-100 text-red-700";

  return (
    <span className={`px-3 py-1 text-xs rounded-full ${style}`}>
      {status}
    </span>
  );
}