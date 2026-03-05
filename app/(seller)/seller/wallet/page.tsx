"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type Withdrawal = {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function SellerWalletPage() {

  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  /* ================= LOAD WALLET ================= */

  const loadWallet = async () => {

    try {

      const seller = await apiFetch("/auth/me");
      const withdrawData = await apiFetch("/withdrawals/my");

      setBalance(seller.walletBalance || 0);
      setWithdrawals(Array.isArray(withdrawData) ? withdrawData : []);

    } catch (err) {

      console.error("Wallet load error", err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadWallet();

  }, []);

  /* ================= WITHDRAW REQUEST ================= */

  const requestWithdraw = async () => {

    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (withdrawAmount > balance) {
      alert("Insufficient wallet balance");
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

      alert("Withdrawal request submitted");

      setAmount("");

      loadWallet();

    } catch (err) {

      alert("Withdraw request failed");

    } finally {

      setRequesting(false);

    }

  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading wallet...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Seller Wallet
      </h1>

      {/* BALANCE */}

      <div className="bg-white border rounded-2xl p-8 mb-10 shadow-sm">

        <p className="text-gray-500 text-sm">
          Available Balance
        </p>

        <h2 className="text-4xl font-bold mt-2 text-green-600">
          ₹{balance}
        </h2>

      </div>

      {/* WITHDRAW */}

      <div className="bg-white border rounded-2xl p-6 mb-10">

        <h3 className="font-semibold mb-4">
          Request Withdrawal
        </h3>

        <div className="flex gap-4">

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
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

      </div>

      {/* HISTORY */}

      <div className="bg-white border rounded-2xl overflow-hidden">

        <div className="p-6 border-b font-semibold">
          Withdrawal History
        </div>

        <table className="w-full text-sm">

          <thead className="bg-gray-50">

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
                className="border-t"
              >

                <td className="p-4 font-semibold">
                  ₹{w.amount}
                </td>

                <td className="p-4">

                  <StatusBadge status={w.status} />

                </td>

                <td className="p-4 text-gray-500">

                  {new Date(
                    w.createdAt
                  ).toLocaleDateString()}

                </td>

              </tr>

            ))}

            {withdrawals.length === 0 && (

              <tr>
                <td
                  colSpan={3}
                  className="text-center p-8 text-gray-500"
                >
                  No withdrawal requests
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {

  let style =
    "bg-gray-100 text-gray-600";

  if (status === "approved")
    style = "bg-green-100 text-green-700";

  if (status === "pending")
    style = "bg-yellow-100 text-yellow-700";

  if (status === "rejected")
    style = "bg-red-100 text-red-700";

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full ${style}`}
    >
      {status}
    </span>
  );
}