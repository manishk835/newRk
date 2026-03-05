// // app/(admin)/admin/page.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
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

type Order = {
  _id: string;
  totalAmount: number;
  createdAt: string;
};

type DashboardState = {
  orders: Order[];
};

/* ================= PAGE ================= */

export default function AdminDashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<DashboardState>({
    orders: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const ordersRes = await apiFetch("/admin/orders");

        setData({
          orders: Array.isArray(ordersRes?.orders)
            ? ordersRes.orders
            : [],
        });
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

  /* ================= METRICS ================= */

  const totalOrders = data.orders.length;

  const totalRevenue = useMemo(
    () =>
      data.orders.reduce(
        (sum, o) => sum + (o.totalAmount || 0),
        0
      ),
    [data.orders]
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  /* ================= ORDERS PER DAY ================= */

  const ordersPerDay = useMemo(() => {
    const map: Record<string, number> = {};

    data.orders.forEach((order) => {
      const date = new Date(order.createdAt)
        .toISOString()
        .split("T")[0];

      map[date] = (map[date] || 0) + 1;
    });

    return Object.entries(map).map(([date, count]) => ({
      date,
      orders: count,
    }));
  }, [data.orders]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
        />
        <StatCard
          title="Total Stores"
          value={"2"} 
        />
      </div>

      {/* CHART */}
      <div className="bg-white border rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Orders / Day
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ordersPerDay}>
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
    <div className="bg-white border rounded-2xl p-6">
      <p className="text-sm text-gray-500 mb-2">
        {title}
      </p>
      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

// // app/(admin)/admin/page.tsx
// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api/client";

// /* ================= TYPES ================= */

// type Order = {
//   _id: string;
//   totalAmount: number;
//   createdAt: string;
// };

// type LowStockProduct = {
//   _id: string;
//   title: string;
//   totalStock: number;
// };

// type DashboardState = {
//   orders: Order[];
//   lowStock: LowStockProduct[];
// };

// /* ================= PAGE ================= */

// export default function AdminDashboardPage() {
//   const router = useRouter();

//   const [data, setData] = useState<DashboardState>({
//     orders: [],
//     lowStock: [],
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   /* ================= LOAD DASHBOARD ================= */

//   useEffect(() => {
//     let active = true;

//     const loadDashboard = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const [ordersRes, lowStockRes] = await Promise.all([
//           apiFetch("/admin/orders"),
//           apiFetch("/admin/products/admin/low-stock"),
//         ]);

//         if (!active) return;

//         setData({
//           orders: Array.isArray(ordersRes?.orders)
//             ? ordersRes.orders
//             : [],
//           lowStock: Array.isArray(lowStockRes)
//             ? lowStockRes
//             : [],
//         });
//       } catch (err: any) {
//         if (!active) return;

//         if (err?.message?.includes("401")) {
//           router.replace("/admin/login");
//           return;
//         }

//         setError("Failed to load dashboard data");
//       } finally {
//         if (active) setLoading(false);
//       }
//     };

//     loadDashboard();

//     return () => {
//       active = false;
//     };
//   }, [router]);

//   /* ================= DERIVED METRICS ================= */

//   const todayString = useMemo(
//     () => new Date().toDateString(),
//     []
//   );

//   const totalOrders = data.orders.length;

//   const totalRevenue = useMemo(
//     () =>
//       data.orders.reduce(
//         (sum, o) => sum + (o.totalAmount || 0),
//         0
//       ),
//     [data.orders]
//   );

//   const todayOrders = useMemo(
//     () =>
//       data.orders.filter(
//         (o) =>
//           new Date(o.createdAt).toDateString() ===
//           todayString
//       ),
//     [data.orders, todayString]
//   );

//   const todayRevenue = useMemo(
//     () =>
//       todayOrders.reduce(
//         (sum, o) => sum + (o.totalAmount || 0),
//         0
//       ),
//     [todayOrders]
//   );

//   const lowStockCount = data.lowStock.length;

//   /* ================= FORMATTERS ================= */

//   const formatCurrency = (value: number) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);

//   /* ================= STATES ================= */

//   if (loading) {
//     return (
//       <div className="container mx-auto px-6 pt-28">
//         Loading dashboard...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-6 pt-28 text-red-600">
//         {error}
//       </div>
//     );
//   }

//   /* ================= UI ================= */

//   return (
//     <div className="container mx-auto px-6 pt-10 pb-16 max-w-7xl">
//       <h1 className="text-3xl font-bold mb-10">
//         Admin Dashboard
//       </h1>

//       {/* KPI CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         <StatCard title="Total Orders" value={totalOrders} />
//         <StatCard
//           title="Today Orders"
//           value={todayOrders.length}
//         />
//         <StatCard
//           title="Total Revenue"
//           value={formatCurrency(totalRevenue)}
//         />
//         <StatCard
//           title="Today Revenue"
//           value={formatCurrency(todayRevenue)}
//         />
//       </div>

//       {/* ALERTS SECTION */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Low Stock */}
//         <div className="bg-white border rounded-2xl p-6">
//           <h2 className="text-xl font-semibold mb-4">
//             Low Stock Alerts
//           </h2>

//           {lowStockCount === 0 ? (
//             <p className="text-sm text-gray-600">
//               All products are sufficiently stocked
//             </p>
//           ) : (
//             <ul className="space-y-3 text-sm">
//               {data.lowStock.map((p) => (
//                 <li
//                   key={p._id}
//                   className="flex justify-between"
//                 >
//                   <span>{p.title}</span>
//                   <span className="text-red-600 font-semibold">
//                     {p.totalStock} left
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Future Expansion Placeholder */}
//         <div className="bg-white border rounded-2xl p-6">
//           <h2 className="text-xl font-semibold mb-4">
//             System Overview
//           </h2>

//           <div className="text-sm text-gray-600 space-y-2">
//             <p>Low Stock Products: {lowStockCount}</p>
//             <p>Total Revenue: {formatCurrency(totalRevenue)}</p>
//             <p>Total Orders: {totalOrders}</p>
//           </div>
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
//     <div className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
//       <p className="text-sm text-gray-500 mb-2">
//         {title}
//       </p>
//       <p className="text-2xl font-bold">
//         {value}
//       </p>
//     </div>
//   );
// }
