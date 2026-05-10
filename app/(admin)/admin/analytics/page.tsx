// app/(admin)/admin/analytics/page.tsx

"use client";

import {
  useEffect,
  useState,
} from "react";

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
  revenueChart: {
    date: string;
    revenue: number;
  }[];

  ordersChart: {
    date: string;
    orders: number;
  }[];

  topProducts: {
    name: string;
    sales: number;
  }[];

  topSellers: {
    name: string;
    revenue: number;
  }[];

  categoryData: {
    category: string;
    sales: number;
  }[];

  stats: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    growth: number;
  };
};

/* ================= PAGE ================= */

export default function AdminAnalyticsPage() {

  const { showToast } =
    useToast();

  const [data, setData] =
    useState<
      AnalyticsData | null
    >(null);

  const [loading, setLoading] =
    useState(true);

  const [days, setDays] =
    useState(30);

  /* ================= LOAD ================= */

  const loadAnalytics =
    async () => {
      try {

        setLoading(true);

        const res =
          await apiFetch(
            `/admin/analytics?days=${days}`
          );

        setData(res);

      } catch {

        showToast(
          "Failed to load analytics",
          "error"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    loadAnalytics();
  }, [days]);

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
    ).format(
      value || 0
    );

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex items-center justify-between">

          <div>

            <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-2" />

            <div className="h-4 w-64 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />

          </div>

          <div className="h-10 w-36 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse" />

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {[...Array(4)].map(
            (_, i) => (

              <div
                key={i}
                className="h-28 bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse"
              />

            )
          )}

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {[...Array(2)].map(
            (_, i) => (

              <div
                key={i}
                className="h-96 bg-gray-200 dark:bg-zinc-800 rounded-3xl animate-pulse"
              />

            )
          )}

        </div>

      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto">

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-10 text-center shadow-sm">

          <p className="text-red-500">
            No analytics data found
          </p>

        </div>

      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-black dark:text-white">
            Analytics Dashboard
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Revenue, orders and marketplace insights
          </p>

        </div>

        {/* FILTER */}
        <select
          value={days}
          onChange={(e) =>
            setDays(
              Number(
                e.target.value
              )
            )
          }
          className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
        >

          <option value={7}>
            Last 7 days
          </option>

          <option value={30}>
            Last 30 days
          </option>

          <option value={90}>
            Last 90 days
          </option>

        </select>

      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <StatCard
          title="Revenue"
          value={formatCurrency(
            data.stats
              .totalRevenue
          )}
        />

        <StatCard
          title="Orders"
          value={
            data.stats
              .totalOrders
          }
        />

        <StatCard
          title="AOV"
          value={formatCurrency(
            data.stats
              .avgOrderValue
          )}
        />

        <StatCard
          title="Growth"
          value={`${data.stats.growth}%`}
        />

      </div>

      {/* LINE CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        <ChartCard title="Revenue Trend">

          <LineChart
            data={
              data.revenueChart
            }
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={3}
            />

          </LineChart>

        </ChartCard>

        <ChartCard title="Orders Trend">

          <LineChart
            data={
              data.ordersChart
            }
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="orders"
              stroke="#6366f1"
              strokeWidth={3}
            />

          </LineChart>

        </ChartCard>

      </div>

      {/* BAR CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        <ChartCard title="Top Products">

          <BarChart
            data={
              data.topProducts
            }
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="sales"
              fill="#f59e0b"
              radius={[
                6,
                6,
                0,
                0,
              ]}
            />

          </BarChart>

        </ChartCard>

        <ChartCard title="Top Sellers">

          <BarChart
            data={
              data.topSellers
            }
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="revenue"
              fill="#10b981"
              radius={[
                6,
                6,
                0,
                0,
              ]}
            />

          </BarChart>

        </ChartCard>

      </div>

      {/* CATEGORY */}
      <ChartCard title="Category Sales">

        <BarChart
          data={
            data.categoryData
          }
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="category" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="sales"
            fill="#3b82f6"
            radius={[
              6,
              6,
              0,
              0,
            ]}
          />

        </BarChart>

      </ChartCard>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  title,
  value,
}: {
  title: string;
  value:
    | string
    | number;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {title}
      </p>

      <p className="text-2xl font-bold text-black dark:text-white">
        {value}
      </p>

    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">

      <h2 className="mb-5 font-semibold text-black dark:text-white">
        {title}
      </h2>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          {children as any}

        </ResponsiveContainer>

      </div>

    </div>
  );
}