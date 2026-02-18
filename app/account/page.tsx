// app/account/page.tsx
"use client";

import { useEffect, useState } from "react";

type Stats = {
  orders: number;
  delivered: number;
  cancelled: number;
  spent: number;
  loyaltyPoints: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    orders: 0,
    delivered: 0,
    cancelled: 0,
    spent: 0,
    loyaltyPoints: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, userRes] = await Promise.all([
          fetch(`${BASE_URL}/api/orders/my`, {
            credentials: "include",
          }),
          fetch(`${BASE_URL}/api/auth/me`, {
            credentials: "include",
          }),
        ]);
        

        if (!ordersRes.ok) throw new Error("Failed to load data");

        const orders = await ordersRes.json();
        const user = userRes.ok ? await userRes.json() : null;

        const delivered = orders.filter(
          (o: any) => o.status === "Delivered"
        ).length;

        const cancelled = orders.filter(
          (o: any) => o.status === "Cancelled"
        ).length;

        const spent = orders.reduce(
          (sum: number, o: any) => sum + o.totalAmount,
          0
        );

        setStats({
          orders: orders.length,
          delivered,
          cancelled,
          spent,
          loyaltyPoints: user?.loyaltyPoints || 0,
        });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL]);

  /* ================= SKELETON ================= */
  if (loading) {
    return (
      <div className="grid md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-gray-100 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-20">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* ================= STATS GRID ================= */}
      <div className="grid md:grid-cols-4 gap-6">

        <StatCard
          title="Total Orders"
          value={stats.orders}
          icon="📦"
        />

        <StatCard
          title="Delivered"
          value={stats.delivered}
          icon="✅"
        />

        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon="❌"
        />

        <StatCard
          title="Total Spent"
          value={`₹${stats.spent}`}
          icon="💰"
        />

      </div>

      {/* ================= LOYALTY SECTION ================= */}
      <div className="bg-black text-white rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center">

        <div>
          <h2 className="text-xl font-semibold mb-2">
            Loyalty Points
          </h2>
          <p className="text-gray-300 text-sm">
            Earn points on every delivered order.
          </p>
        </div>

        <div className="text-3xl font-bold mt-4 md:mt-0">
          {stats.loyaltyPoints}
        </div>

      </div>

      {/* ================= QUICK INSIGHT ================= */}
      <div className="bg-gray-50 rounded-3xl p-8">

        <h3 className="font-semibold mb-6">
          Account Summary
        </h3>

        <ul className="space-y-3 text-sm text-gray-600">
          <li>
            • You have placed{" "}
            <span className="font-medium text-black">
              {stats.orders}
            </span>{" "}
            total orders.
          </li>

          <li>
            •{" "}
            <span className="font-medium text-black">
              {stats.delivered}
            </span>{" "}
            orders were successfully delivered.
          </li>

          <li>
            • Total spending till now is{" "}
            <span className="font-medium text-black">
              ₹{stats.spent}
            </span>.
          </li>
        </ul>

      </div>

    </div>
  );
}

/* ================= REUSABLE CARD ================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: string;
}) {
  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition flex justify-between items-center">

      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>
        <h2 className="text-2xl font-bold mt-2">
          {value}
        </h2>
      </div>

      <div className="text-3xl">
        {icon}
      </div>

    </div>
  );
}