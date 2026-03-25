"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await apiFetch("/admin/dashboard");
        setData(res);
      } catch (err: any) {
        if (err?.message?.includes("401")) {
          router.replace("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!data) {
    return <div>Failed to load dashboard</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
        <StatCard title="Orders" value={data.totalOrders} />
        <StatCard
          title="Revenue"
          value={formatCurrency(data.totalRevenue)}
        />
        <StatCard title="Users" value={data.totalUsers} />
        <StatCard title="Sellers" value={data.totalSellers} />
        <StatCard
          title="Pending Sellers"
          value={data.pendingSellers}
        />
        <StatCard
          title="Pending Orders"
          value={data.pendingOrders}
        />
      </div>

      {/* CHART */}
      <div className="bg-white border rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Orders / Day
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <p className="text-xs text-gray-500 mb-1">
        {title}
      </p>
      <p className="text-xl font-bold">
        {value}
      </p>
    </div>
  );
}
// // // app/(admin)/admin/page.tsx

// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api/client";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// /* ================= TYPES ================= */

// type Order = {
//   _id: string;
//   totalAmount: number;
//   createdAt: string;
// };

// type DashboardState = {
//   orders: Order[];
// };

// /* ================= PAGE ================= */

// export default function AdminDashboardPage() {
//   const router = useRouter();

//   const [data, setData] = useState<DashboardState>({
//     orders: [],
//   });

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadDashboard = async () => {
//       try {
//         const ordersRes = await apiFetch("/admin/orders");

//         setData({
//           orders: Array.isArray(ordersRes?.orders)
//             ? ordersRes.orders
//             : [],
//         });
//       } catch (err: any) {
//         if (err?.message?.includes("401")) {
//           router.replace("/admin/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDashboard();
//   }, [router]);

//   /* ================= METRICS ================= */

//   const totalOrders = data.orders.length;

//   const totalRevenue = useMemo(
//     () =>
//       data.orders.reduce(
//         (sum, o) => sum + (o.totalAmount || 0),
//         0
//       ),
//     [data.orders]
//   );

//   const formatCurrency = (value: number) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);

//   /* ================= ORDERS PER DAY ================= */

//   const ordersPerDay = useMemo(() => {
//     const map: Record<string, number> = {};

//     data.orders.forEach((order) => {
//       const date = new Date(order.createdAt)
//         .toISOString()
//         .split("T")[0];

//       map[date] = (map[date] || 0) + 1;
//     });

//     return Object.entries(map).map(([date, count]) => ({
//       date,
//       orders: count,
//     }));
//   }, [data.orders]);

//   if (loading) {
//     return <div>Loading dashboard...</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">
//         Admin Dashboard
//       </h1>

//       {/* KPI */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <StatCard title="Total Orders" value={totalOrders} />
//         <StatCard
//           title="Total Revenue"
//           value={formatCurrency(totalRevenue)}
//         />
//         <StatCard
//           title="Total Stores"
//           value={"2"} 
//         />
//       </div>

//       {/* CHART */}
//       <div className="bg-white border rounded-2xl p-6">
//         <h2 className="text-lg font-semibold mb-4">
//           Orders / Day
//         </h2>

//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={ordersPerDay}>
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Area
//                 type="monotone"
//                 dataKey="orders"
//                 stroke="#6366f1"
//                 fill="#6366f1"
//                 fillOpacity={0.3}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= COMPONENT ================= */

// function StatCard({
//   title,
//   value,
// }: {
//   title: string;
//   value: string | number;
// }) {
//   return (
//     <div className="bg-white border rounded-2xl p-6">
//       <p className="text-sm text-gray-500 mb-2">
//         {title}
//       </p>
//       <p className="text-2xl font-bold">
//         {value}
//       </p>
//     </div>
//   );
// }
