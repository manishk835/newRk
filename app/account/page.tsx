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


// "use client";

// import { useEffect, useState } from "react";

// export default function DashboardPage() {
//   const [stats, setStats] = useState({
//     orders: 0,
//     spent: 0,
//     delivered: 0,
//   });

//   const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await fetch(`${BASE_URL}/api/orders/my`, {
//         credentials: "include",
//       });

//       const data = await res.json();

//       const delivered = data.filter(
//         (o: any) => o.status === "Delivered"
//       ).length;

//       const spent = data.reduce(
//         (sum: number, o: any) => sum + o.totalAmount,
//         0
//       );

//       setStats({
//         orders: data.length,
//         delivered,
//         spent,
//       });
//     };

//     fetchData();
//   }, [BASE_URL]);

//   return (
//     <div className="grid md:grid-cols-3 gap-6">

//       <div className="bg-gray-50 rounded-2xl p-6">
//         <p className="text-sm text-gray-500">Total Orders</p>
//         <h2 className="text-2xl font-bold mt-2">
//           {stats.orders}
//         </h2>
//       </div>

//       <div className="bg-gray-50 rounded-2xl p-6">
//         <p className="text-sm text-gray-500">
//           Delivered Orders
//         </p>
//         <h2 className="text-2xl font-bold mt-2">
//           {stats.delivered}
//         </h2>
//       </div>

//       <div className="bg-gray-50 rounded-2xl p-6">
//         <p className="text-sm text-gray-500">
//           Total Spent
//         </p>
//         <h2 className="text-2xl font-bold mt-2">
//           ₹{stats.spent}
//         </h2>
//       </div>

//     </div>
//   );
// }


// "use client";

// import Link from "next/link";

// export default function AccountDashboard() {
//   return (
//     <div className="space-y-10">

//       {/* HEADER */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">
//           My Account
//         </h1>
//         <p className="text-gray-500 mt-2">
//           Manage your orders, wishlist and delivery details
//         </p>
//       </div>

//       {/* CARDS GRID */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

//         {/* ORDERS */}
//         <Link
//           href="/account/orders"
//           className="group bg-white border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//         >
//           <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-black text-white text-2xl mb-6 group-hover:scale-110 transition">
//             📦
//           </div>

//           <h2 className="text-lg font-semibold mb-2">
//             My Orders
//           </h2>

//           <p className="text-sm text-gray-500 mb-6">
//             Track your orders, request returns or buy again.
//           </p>

//           <span className="text-sm font-medium text-black group-hover:underline">
//             Manage Orders →
//           </span>
//         </Link>


//         {/* WISHLIST */}
//         <Link
//           href="/account/favorites"
//           className="group bg-white border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//         >
//           <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-red-500 text-white text-2xl mb-6 group-hover:scale-110 transition">
//             ❤️
//           </div>

//           <h2 className="text-lg font-semibold mb-2">
//             Wishlist
//           </h2>

//           <p className="text-sm text-gray-500 mb-6">
//             View and manage products you love.
//           </p>

//           <span className="text-sm font-medium text-black group-hover:underline">
//             View Wishlist →
//           </span>
//         </Link>


//         {/* ADDRESSES */}
//         <Link
//           href="/account/addresses"
//           className="group bg-white border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//         >
//           <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-600 text-white text-2xl mb-6 group-hover:scale-110 transition">
//             🏠
//           </div>

//           <h2 className="text-lg font-semibold mb-2">
//             Saved Addresses
//           </h2>

//           <p className="text-sm text-gray-500 mb-6">
//             Add or edit delivery addresses easily.
//           </p>

//           <span className="text-sm font-medium text-black group-hover:underline">
//             Manage Addresses →
//           </span>
//         </Link>

//       </div>

//     </div>
//   );
// }
