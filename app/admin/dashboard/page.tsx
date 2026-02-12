// app/admin/dashboard/page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import StatsCard from "@/components/admin/StatsCard";
// import DataTable from "@/components/admin/DataTable";

// /* ================= TYPES ================= */

// type DashboardStats = {
//   totalOrders: number;
//   totalRevenue: number;
//   totalUsers: number;
//   totalProducts: number;
// };

// type RecentOrder = {
//   _id: string;
//   totalAmount: number;
//   status: string;
//   createdAt: string;
// };

// /* ================= PAGE ================= */

// export default function AdminDashboardPage() {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [orders, setOrders] = useState<RecentOrder[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const token = localStorage.getItem("admin_token");

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             cache: "no-store",
//           }
//         );

//         if (!res.ok) throw new Error("Failed");

//         const data = await res.json();
//         setStats(data.stats);
//         setOrders(data.recentOrders || []);
//       } catch (err) {
//         console.error("Dashboard fetch error", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
//   }, []);

//   /* ================= UI ================= */

//   if (loading) {
//     return (
//       <div className="container mx-auto px-6 pt-10">
//         Loading dashboard...
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-6 pt-10 pb-16 max-w-6xl space-y-10">
//       {/* ================= STATS ================= */}
//       {stats && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatsCard title="Total Orders" value={stats.totalOrders} />
//           <StatsCard
//             title="Revenue"
//             value={`₹${stats.totalRevenue}`}
//           />
//           <StatsCard title="Users" value={stats.totalUsers} />
//           <StatsCard
//             title="Products"
//             value={stats.totalProducts}
//           />
//         </div>
//       )}

//       {/* ================= RECENT ORDERS ================= */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">
//           Recent Orders
//         </h2>

//         <DataTable<RecentOrder>
//           columns={[
//             { key: "_id", label: "Order ID" },
//             { key: "totalAmount", label: "Amount" },
//             { key: "status", label: "Status" },
//             { key: "createdAt", label: "Date" },
//           ]}
//           data={orders.map((o) => ({
//             ...o,
//             _id: `#${o._id.slice(-6)}`,
//             createdAt: new Date(o.createdAt).toLocaleDateString(
//               "en-IN"
//             ),
//           }))}
//         />
//       </div>
//     </div>
//   );
// }
