"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

type Order = {
  _id: string;
  totalAmount: number;
  createdAt: string;
};

type LowStockProduct = {
  _id: string;
  title: string;
  totalStock: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);

        // 🔐 VERIFY ADMIN FIRST
        await apiFetch("/admin/me");

        // 📊 LOAD DATA
        const [ordersData, stockData] = await Promise.all([
          apiFetch("/admin/orders"),
          apiFetch("/admin/products/admin/low-stock"),
        ]);

        if (!mounted) return;

        setOrders(
          Array.isArray(ordersData.orders)
            ? ordersData.orders
            : []
        );

        setLowStock(
          Array.isArray(stockData)
            ? stockData
            : []
        );
      } catch (err: any) {
        if (!mounted) return;

        if (err.message?.includes("401")) {
          router.replace("/admin/login");
          return;
        }

        setError("Unable to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-28">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 pt-28 text-red-600">
        {error}
      </div>
    );
  }

  const todayString = new Date().toDateString();

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  const todayOrders = orders.filter(
    (o) =>
      new Date(o.createdAt).toDateString() === todayString
  );

  const todayRevenue = todayOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="container mx-auto px-6 pt-10 pb-16">
      <h1 className="text-3xl font-bold mb-10">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard
          title="Today Orders"
          value={todayOrders.length}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
        />
        <StatCard
          title="Today Revenue"
          value={formatCurrency(todayRevenue)}
        />
      </div>

      <div className="bg-white border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Low Stock Alerts
        </h2>

        {lowStock.length === 0 ? (
          <p className="text-sm text-gray-600">
            All products are sufficiently stocked
          </p>
        ) : (
          <ul className="space-y-3 text-sm">
            {lowStock.map((p) => (
              <li
                key={p._id}
                className="flex justify-between"
              >
                <span>{p.title}</span>
                <span className="text-red-600 font-semibold">
                  {p.totalStock} left
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
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

// import { useEffect, useState } from "react";
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

// /* ================= PAGE ================= */

// export default function AdminDashboardPage() {
//   const router = useRouter();

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let mounted = true;

//     const loadDashboard = async () => {
//       try {
//         setLoading(true);

//         /* ===== PARALLEL REQUESTS ===== */
//         const [ordersData, stockData] = await Promise.all([
//           apiFetch("/admin/orders"),
//           apiFetch("/admin/products/admin/low-stock"),
//         ]);

//         if (!mounted) return;

//         setOrders(
//           Array.isArray(ordersData.orders)
//             ? ordersData.orders
//             : []
//         );

//         setLowStock(
//           Array.isArray(stockData)
//             ? stockData
//             : []
//         );
//       } catch (err: any) {
//         if (!mounted) return;

//         if (err.message?.includes("401")) {
//           router.replace("/admin/login");
//           return;
//         }

//         setError("Unable to load dashboard data");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     loadDashboard();

//     return () => {
//       mounted = false;
//     };
//   }, [router]);

//   /* ================= CALCULATIONS ================= */

//   const todayString = new Date().toDateString();

//   const totalOrders = orders.length;

//   const totalRevenue = orders.reduce(
//     (sum, o) => sum + o.totalAmount,
//     0
//   );

//   const todayOrders = orders.filter(
//     (o) =>
//       new Date(o.createdAt).toDateString() === todayString
//   );

//   const todayRevenue = todayOrders.reduce(
//     (sum, o) => sum + o.totalAmount,
//     0
//   );

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
//     <div className="container mx-auto px-6 pt-10 pb-16">
//       <h1 className="text-3xl font-bold mb-10">
//         Admin Dashboard
//       </h1>

//       {/* ================= STATS ================= */}
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

//       {/* ================= LOW STOCK ================= */}
//       <div className="bg-white border rounded-2xl p-6">
//         <h2 className="text-xl font-semibold mb-4">
//           Low Stock Alerts
//         </h2>

//         {lowStock.length === 0 ? (
//           <p className="text-sm text-gray-600">
//             All products are sufficiently stocked
//           </p>
//         ) : (
//           <ul className="space-y-3 text-sm">
//             {lowStock.map((p) => (
//               <li
//                 key={p._id}
//                 className="flex justify-between"
//               >
//                 <span>{p.title}</span>
//                 <span className="text-red-600 font-semibold">
//                   {p.totalStock} left
//                 </span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================= CARD ================= */

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

// // // app/(admin)/admin/page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

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

// /* ================= PAGE ================= */

// export default function AdminDashboardPage() {
//   const router = useRouter();

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let isMounted = true;

//     const fetchDashboardData = async () => {
//       try {
//         /* ================= ORDERS ================= */
//         const ordersRes = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`,
//           {
//             credentials: "include",
//             cache: "no-store",
//           }
//         );

//         if (ordersRes.status === 401 || ordersRes.status === 403) {
//           router.replace("/admin/login");
//           return;
//         }
        

//         if (!ordersRes.ok) {
//           const errData = await ordersRes.json();
//           console.log("Orders API Error:", ordersRes.status, errData);
//           throw new Error(errData.message || "Failed to fetch orders");
//         }
        

//         const ordersData = await ordersRes.json();

//         if (isMounted) {
//           setOrders(
//             Array.isArray(ordersData.orders)
//               ? ordersData.orders
//               : []
//           );
//         }

//         /* ================= LOW STOCK ================= */
//         const stockRes = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/admin/low-stock`,
//           {
//             credentials: "include",
//             cache: "no-store",
//           }
//         );

//         if (stockRes.ok) {
//           const stockData = await stockRes.json();
//           if (isMounted) {
//             setLowStock(
//               Array.isArray(stockData) ? stockData : []
//             );
//           }
//         }

//       } catch (err) {
//         console.error("Dashboard fetch error:", err);
//         if (isMounted) {
//           setError("Unable to load dashboard");
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchDashboardData();

//     return () => {
//       isMounted = false;
//     };
//   }, [router]);

//   /* ================= CALCULATIONS ================= */

//   const today = new Date().toDateString();

//   const totalOrders = orders.length;
//   const totalRevenue = orders.reduce(
//     (sum, o) => sum + o.totalAmount,
//     0
//   );

//   const todayOrders = orders.filter(
//     (o) =>
//       new Date(o.createdAt).toDateString() === today
//   );

//   const todayRevenue = todayOrders.reduce(
//     (sum, o) => sum + o.totalAmount,
//     0
//   );

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
//     <div className="container mx-auto px-6 pt-10 pb-16">
//       <h1 className="text-3xl font-bold mb-10">
//         Admin Dashboard
//       </h1>

//       {/* ================= STATS ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         <StatCard title="Total Orders" value={totalOrders} />
//         <StatCard title="Today Orders" value={todayOrders.length} />
//         <StatCard title="Total Revenue" value={`₹${totalRevenue}`} />
//         <StatCard title="Today Revenue" value={`₹${todayRevenue}`} />
//       </div>

//       {/* ================= LOW STOCK ================= */}
//       <div className="bg-white border rounded-2xl p-6">
//         <h2 className="text-xl font-semibold mb-4">
//           Low Stock Alerts
//         </h2>

//         {lowStock.length === 0 ? (
//           <p className="text-sm text-gray-600">
//             All products are sufficiently stocked
//           </p>
//         ) : (
//           <ul className="space-y-3 text-sm">
//             {lowStock.map((p) => (
//               <li
//                 key={p._id}
//                 className="flex justify-between"
//               >
//                 <span>{p.title}</span>
//                 <span className="text-red-600 font-semibold">
//                   {p.totalStock} left
//                 </span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================= CARD ================= */

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
