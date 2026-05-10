// app/(seller)/seller/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

import {
  Package,
  ShoppingCart,
  AlertTriangle,
  Wallet,
  IndianRupee,
} from "lucide-react";

/* ================= TYPES ================= */

type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  lowStockProducts: number;
  totalRevenue: number;
  monthlyRevenue: number;
  walletBalance: number;
  recentOrders?: any[];
};

/* ================= PAGE ================= */

export default function SellerDashboard() {

  const router = useRouter();

  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadDashboard = async () => {
      try {

        const data = await apiFetch(
          "/seller/dashboard"
        );

        setStats(data);

      } catch (err: any) {

        if (err?.status === 401) {
          router.replace("/login");
        }

        if (err?.status === 403) {
          router.replace("/for-vendors");
        }

      } finally {

        setLoading(false);

      }
    };

    loadDashboard();

  }, [router]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-black transition-colors duration-300">

        Loading dashboard...

      </div>
    );
  }

  /* ================= ERROR ================= */

  if (!stats) {
    return (
      <div className="text-center mt-20 text-black dark:text-white">
        Failed to load dashboard
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold text-black dark:text-white">
          Dashboard Overview
        </h1>

        <Link
          href="/seller/products/create"
          className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
        >
          + Add Product
        </Link>

      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          icon={Package}
          title="Products"
          value={stats.totalProducts}
        />

        <StatCard
          icon={ShoppingCart}
          title="Orders"
          value={stats.totalOrders}
        />

        <StatCard
          icon={AlertTriangle}
          title="Pending"
          value={stats.pendingOrders}
          danger
        />

        <StatCard
          icon={Wallet}
          title="Wallet"
          value={`₹${stats.walletBalance}`}
          highlight
        />

        <StatCard
          icon={IndianRupee}
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
        />

        <StatCard
          icon={IndianRupee}
          title="Monthly"
          value={`₹${stats.monthlyRevenue}`}
        />

        <StatCard
          icon={AlertTriangle}
          title="Low Stock"
          value={stats.lowStockProducts}
          danger={
            stats.lowStockProducts > 0
          }
        />

      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-3 gap-6">

        <ActionCard
          title="Add Product"
          desc="Create new listing"
          link="/seller/products/create"
        />

        <ActionCard
          title="Manage Products"
          desc="Edit your products"
          link="/seller/products"
        />

        <ActionCard
          title="View Orders"
          desc="Track all orders"
          link="/seller/orders"
        />

      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 transition-colors duration-300">

        <h2 className="font-semibold text-black dark:text-white mb-4">
          Recent Orders
        </h2>

        {stats.recentOrders?.length ? (

          <div className="space-y-3">

            {stats.recentOrders.map(
              (order: any) => (

                <div
                  key={order._id}
                  className="flex justify-between border-b border-gray-200 dark:border-zinc-800 pb-2 text-sm"
                >

                  <span className="text-black dark:text-white">
                    #{order._id.slice(-6)}
                  </span>

                  <span className="text-black dark:text-white">
                    ₹{order.total}
                  </span>

                  <span className="text-gray-500 dark:text-gray-400">
                    {order.status}
                  </span>

                </div>

              )
            )}

          </div>

        ) : (

          <p className="text-sm text-gray-500 dark:text-gray-400">
            No recent orders
          </p>

        )}

      </div>

      {/* ANALYTICS */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 transition-colors duration-300">

        <h2 className="font-semibold text-black dark:text-white mb-4">
          Sales Analytics
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Charts (weekly/monthly) will be added here
        </p>

      </div>

    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  icon: Icon,
  title,
  value,
  highlight,
  danger,
}: any) {

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-colors duration-300">

      <div className="bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl">

        <Icon
          size={18}
          className="text-black dark:text-white"
        />

      </div>

      <div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </p>

        <p
          className={`text-xl font-bold ${
            highlight
              ? "text-green-600"
              : danger
              ? "text-red-600"
              : "text-black dark:text-white"
          }`}
        >
          {value}
        </p>

      </div>

    </div>
  );
}

/* ================= ACTION CARD ================= */

function ActionCard({
  title,
  desc,
  link,
}: any) {

  return (
    <Link
      href={link}
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-md transition block"
    >

      <h3 className="font-semibold text-black dark:text-white mb-2">
        {title}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        {desc}
      </p>

    </Link>
  );
}

// // app/(seller)/seller/page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api/client";

// type DashboardStats = {
//   totalProducts: number;
//   totalOrders: number;
//   pendingOrders: number;
//   lowStockProducts: number;
//   totalRevenue: number;
//   monthlyRevenue: number;
//   walletBalance: number;
// };

// export default function SellerDashboard() {
//   const router = useRouter();

//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   /* ================= LOAD DASHBOARD ================= */

//   useEffect(() => {
//     const loadDashboard = async () => {
//       try {
//         const data = await apiFetch("/seller/dashboard");

//         if (!data) {
//           throw new Error("No data");
//         }

//         setStats(data);

//       } catch (err: any) {
//         console.error("Dashboard error", err);

//         // 🔥 AUTH FAIL HANDLE
//         if (err?.status === 401) {
//           router.replace("/login");
//         } else if (err?.status === 403) {
//           router.replace("/for-vendors");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDashboard();
//   }, [router]);

//   /* ================= LOADING ================= */

//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-500">
//         Loading dashboard...
//       </div>
//     );
//   }

//   if (!stats) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
//         <p className="text-lg font-semibold mb-2">
//           Failed to load dashboard
//         </p>
//         <button
//           onClick={() => window.location.reload()}
//           className="text-sm text-blue-600 underline"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto">

//       <h1 className="text-3xl font-bold mb-8">
//         Seller Dashboard
//       </h1>

//       {/* KPI CARDS */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

//         <StatCard
//           title="Total Products"
//           value={stats.totalProducts}
//         />

//         <StatCard
//           title="Total Orders"
//           value={stats.totalOrders}
//         />

//         <StatCard
//           title="Pending Orders"
//           value={stats.pendingOrders}
//         />

//         <StatCard
//           title="Low Stock"
//           value={stats.lowStockProducts}
//           danger={stats.lowStockProducts > 0}
//         />

//         <StatCard
//           title="Total Revenue"
//           value={`₹${stats.totalRevenue}`}
//         />

//         <StatCard
//           title="Monthly Revenue"
//           value={`₹${stats.monthlyRevenue}`}
//         />

//         <StatCard
//           title="Wallet Balance"
//           value={`₹${stats.walletBalance}`}
//           highlight
//         />

//       </div>

//       {/* QUICK ACTIONS */}

//       <div className="grid md:grid-cols-3 gap-6 mb-10">

//         <ActionCard
//           title="Add New Product"
//           desc="List a new product in your store"
//           link="/seller/products/create"
//         />

//         <ActionCard
//           title="Manage Products"
//           desc="Edit or delete your products"
//           link="/seller/products"
//         />

//         <ActionCard
//           title="View Orders"
//           desc="Check orders placed by customers"
//           link="/seller/orders"
//         />

//       </div>

//       {/* ANALYTICS */}

//       <div className="bg-white border rounded-2xl p-6">

//         <h2 className="text-lg font-semibold mb-4">
//           Sales Analytics
//         </h2>

//         <p className="text-sm text-gray-600">
//           Charts and analytics will appear here soon.
//         </p>

//       </div>

//     </div>
//   );
// }

// /* ================= STAT CARD ================= */

// function StatCard({
//   title,
//   value,
//   highlight,
//   danger,
// }: {
//   title: string;
//   value: string | number;
//   highlight?: boolean;
//   danger?: boolean;
// }) {

//   let color = "text-black";

//   if (highlight) color = "text-green-600";
//   if (danger) color = "text-red-600";

//   return (
//     <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
//       <p className="text-sm text-gray-500 mb-2">
//         {title}
//       </p>

//       <p className={`text-2xl font-bold ${color}`}>
//         {value}
//       </p>
//     </div>
//   );
// }

// /* ================= ACTION CARD ================= */

// function ActionCard({
//   title,
//   desc,
//   link,
// }: {
//   title: string;
//   desc: string;
//   link: string;
// }) {
//   return (
//     <Link
//       href={link}
//       className="bg-white border rounded-2xl p-6 hover:shadow-md transition block"
//     >
//       <h3 className="font-semibold mb-2">
//         {title}
//       </h3>

//       <p className="text-sm text-gray-600">
//         {desc}
//       </p>
//     </Link>
//   );
// }