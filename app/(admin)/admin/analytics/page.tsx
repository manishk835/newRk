"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { useToast } from "@/components/ui/ui-utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

/* ================= TYPES ================= */

type AnalyticsData = {
  revenueChart: { date: string; revenue: number }[];
  ordersChart: { date: string; orders: number }[];
  topProducts: { name: string; sales: number }[];
  topSellers: { name: string; revenue: number }[];
  categoryData: { category: string; sales: number }[];
  stats: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    growth: number;
  };
};

export default function AdminAnalyticsPage() {
  const { showToast } = useToast();

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/admin/analytics?days=${days}`);
      setData(res);
    } catch {
      showToast("Failed to load analytics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="p-6 text-red-500">No data found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics</h1>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="border px-3 py-2 rounded-lg"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Revenue" value={formatCurrency(data.stats.totalRevenue)} />
        <StatCard title="Orders" value={data.stats.totalOrders} />
        <StatCard title="AOV" value={formatCurrency(data.stats.avgOrderValue)} />
        <StatCard
          title="Growth"
          value={`${data.stats.growth}%`}
        />
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend">
          <LineChart data={data.revenueChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#22c55e" />
          </LineChart>
        </ChartCard>

        <ChartCard title="Orders Trend">
          <LineChart data={data.ordersChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke="#6366f1" />
          </LineChart>
        </ChartCard>
      </div>

      {/* BARS */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Top Products">
          <BarChart data={data.topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#f59e0b" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Top Sellers">
          <BarChart data={data.topSellers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#10b981" />
          </BarChart>
        </ChartCard>
      </div>

      {/* CATEGORY */}
      <ChartCard title="Category Sales">
        <BarChart data={data.categoryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#3b82f6" />
        </BarChart>
      </ChartCard>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <h2 className="mb-4 font-semibold">{title}</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
