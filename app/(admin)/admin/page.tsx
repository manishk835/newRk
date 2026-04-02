"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { useToast } from "@/components/ui/ui-utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ================= TYPES ================= */

type DashboardData = {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalSellers: number;
  pendingSellers: number;
  pendingOrders: number;
  chartData: { date: string; orders: number }[];
};

/* ================= PAGE ================= */

export default function AdminDashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const res = await apiFetch("/admin/dashboard");
      setData(res);
    } catch (err: any) {
      if (err?.message?.includes("Unauthorized")) {
        router.replace("/admin/login");
      } else {
        setError("Failed to load dashboard");
        showToast("Dashboard load failed", "error");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router, showToast]);

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [loadDashboard]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>

        <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => loadDashboard()}
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <button
          onClick={() => loadDashboard(true)}
          className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        <StatCard title="Orders" value={data.totalOrders} />
        <StatCard title="Revenue" value={formatCurrency(data.totalRevenue)} />
        <StatCard title="Users" value={data.totalUsers} />
        <StatCard title="Sellers" value={data.totalSellers} />
        <StatCard title="Pending Sellers" value={data.pendingSellers} />
        <StatCard title="Pending Orders" value={data.pendingOrders} />
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-3 gap-4">
        <QuickCard title="Manage Orders" onClick={() => router.push("/admin/orders")} />
        <QuickCard title="Manage Products" onClick={() => router.push("/admin/products")} />
        <QuickCard title="Withdraw Requests" onClick={() => router.push("/admin/withdraw")} />
      </div>

      {/* CHART */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Orders Trend</h2>

        <div className="h-80">
          {data.chartData?.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function QuickCard({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition hover:bg-gray-50"
    >
      <p className="font-medium">{title}</p>
      <p className="text-xs text-gray-500 mt-1">Open →</p>
    </div>
  );
}