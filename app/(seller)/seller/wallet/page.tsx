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

  const [balance, setBalance] =
    useState(0);

  const [withdrawals, setWithdrawals] =
    useState<Withdrawal[]>([]);

  const [amount, setAmount] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [requesting, setRequesting] =
    useState(false);

  /* ================= LOAD ================= */

  const loadWallet = async () => {
    try {

      const seller =
        await apiFetch("/auth/me");

      const withdrawData =
        await apiFetch("/withdrawals/my");

      setBalance(
        seller.walletBalance || 0
      );

      setWithdrawals(
        Array.isArray(withdrawData)
          ? withdrawData
          : []
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  /* ================= CALCULATIONS ================= */

  const pendingAmount =
    withdrawals
      .filter(
        (w) =>
          w.status === "pending"
      )
      .reduce(
        (sum, w) =>
          sum + w.amount,
        0
      );

  const availableBalance =
    balance - pendingAmount;

  /* ================= WITHDRAW ================= */

  const requestWithdraw = async () => {

    const withdrawAmount =
      Number(amount);

    if (
      !withdrawAmount ||
      withdrawAmount <= 0
    ) {

      alert("Enter valid amount");

      return;
    }

    if (withdrawAmount < 100) {

      alert("Minimum withdrawal ₹100");

      return;
    }

    if (
      withdrawAmount >
      availableBalance
    ) {

      alert(
        "Insufficient available balance"
      );

      return;
    }

    try {

      setRequesting(true);

      await apiFetch(
        "/withdrawals",
        {
          method: "POST",

          body: JSON.stringify({
            amount:
              withdrawAmount,
            method: "UPI",
          }),
        }
      );

      setAmount("");

      loadWallet();

    } catch {

      alert(
        "Withdraw request failed"
      );

    } finally {

      setRequesting(false);

    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400">
        Loading wallet...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      <h1 className="text-2xl font-bold text-black dark:text-white">
        Wallet & Earnings
      </h1>

      {/* BALANCE CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        <Card
          title="Total Balance"
          value={`₹${balance}`}
        />

        <Card
          title="Pending Withdrawals"
          value={`₹${pendingAmount}`}
        />

        <Card
          title="Available Balance"
          value={`₹${availableBalance}`}
          highlight
        />

      </div>

      {/* WITHDRAW */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 transition-colors duration-300">

        <h3 className="font-semibold text-black dark:text-white mb-4">
          Request Withdrawal
        </h3>

        <div className="flex gap-4 flex-wrap">

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-lg flex-1 outline-none"
          />

          <button
            onClick={
              requestWithdraw
            }
            disabled={requesting}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-60"
          >
            {requesting
              ? "Processing..."
              : "Withdraw"}
          </button>

        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Minimum withdrawal ₹100
        </p>

      </div>

      {/* HISTORY */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-colors duration-300">

        <div className="p-6 border-b border-gray-200 dark:border-zinc-800 font-semibold text-black dark:text-white">
          Withdrawal History
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">

              <tr>

                <th className="p-4 text-left">
                  Amount
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {withdrawals.map((w) => (

                <tr
                  key={w._id}
                  className="border-t border-gray-200 dark:border-zinc-800"
                >

                  <td className="p-4 font-medium text-black dark:text-white">
                    ₹{w.amount}
                  </td>

                  <td className="p-4">
                    <StatusBadge
                      status={w.status}
                    />
                  </td>

                  <td className="p-4 text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(
                      w.createdAt
                    ).toLocaleString()}
                  </td>

                </tr>

              ))}

              {withdrawals.length ===
                0 && (

                <tr>

                  <td
                    colSpan={3}
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No withdrawals yet
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

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
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <p
        className={`text-2xl font-bold mt-2 ${
          highlight
            ? "text-green-600"
            : "text-black dark:text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

/* ================= STATUS ================= */

function StatusBadge({
  status,
}: any) {

  let style =
    "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-300";

  if (status === "approved") {
    style =
      "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300";
  }

  if (status === "pending") {
    style =
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300";
  }

  if (status === "rejected") {
    style =
      "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300";
  }

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full ${style}`}
    >
      {status}
    </span>
  );
}