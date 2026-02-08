"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

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

/* ================= PAGE ================= */

export default function AdminDashboardPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        /* ================= ORDERS ================= */
        const ordersRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
          {
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!ordersRes.ok) throw new Error();

        const ordersData = await ordersRes.json();
        setOrders(
          Array.isArray(ordersData.orders)
            ? ordersData.orders
            : []
        );

        /* ================= LOW STOCK ================= */
        const stockRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/admin/low-stock`,
          {
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (stockRes.ok) {
          const stockData = await stockRes.json();
          setLowStock(Array.isArray(stockData) ? stockData : []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setOrders([]);
        setLowStock([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  /* ================= CALCULATIONS ================= */

  const today = new Date().toDateString();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  const todayOrders = orders.filter(
    (o) =>
      new Date(o.createdAt).toDateString() === today
  );

  const todayRevenue = todayOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-28">
        Loading dashboard...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="container mx-auto px-6 pt-10 pb-16">
      <h1 className="text-3xl font-bold mb-10">
        Admin Dashboard
      </h1>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Orders"
          value={totalOrders}
        />
        <StatCard
          title="Today Orders"
          value={todayOrders.length}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue}`}
        />
        <StatCard
          title="Today Revenue"
          value={`₹${todayRevenue}`}
        />
      </div>

      {/* ================= LOW STOCK ================= */}
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

/* ================= CARD ================= */

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


// // app/admin/page.tsx
// "use client";

// import { useEffect, useState } from "react";

// type Order = {
//   _id: string;
//   totalAmount: number;
//   createdAt: string;
// };

// export default function AdminDashboardPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("admin_token");

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
//           {
//             cache: "no-store",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!res.ok) throw new Error("Failed");

//         const data = await res.json();
//         setOrders(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Dashboard fetch error", err);
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   /* ================= CALCULATIONS ================= */

//   const today = new Date().toDateString();

//   const totalOrders = orders.length;
//   const totalRevenue = orders.reduce(
//     (sum, o) => sum + o.totalAmount,
//     0
//   );

//   const todayOrders = orders.filter(
//     (o) =>
//       new Date(o.createdAt).toDateString() ===
//       today
//   );

//   const todayRevenue = todayOrders.reduce(
//     (sum, o) => sum + o.totalAmount,
//     0
//   );

//   if (loading) {
//     return (
//       <div className="container mx-auto px-6 pt-28">
//         Loading dashboard...
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-6 pt-10 pb-16">
//       <h1 className="text-3xl font-bold mb-10">
//         Admin Dashboard
//       </h1>

//       {/* ================= CARDS ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Orders"
//           value={totalOrders}
//         />
//         <StatCard
//           title="Today Orders"
//           value={todayOrders.length}
//         />
//         <StatCard
//           title="Total Revenue"
//           value={`₹${totalRevenue}`}
//         />
//         <StatCard
//           title="Today Revenue"
//           value={`₹${todayRevenue}`}
//         />
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
//       <div className="bg-white border rounded-2xl p-6 mt-10">
//   <h2 className="text-xl font-semibold mb-4">
//     Low Stock Alerts
//   </h2>

//   {lowStock.length === 0 ? (
//     <p className="text-sm text-gray-600">
//       All products are sufficiently stocked
//     </p>
//   ) : (
//     <ul className="space-y-2 text-sm">
//       {lowStock.map((p: any) => (
//         <li
//           key={p._id}
//           className="flex justify-between"
//         >
//           <span>{p.title}</span>
//           <span className="text-red-600 font-semibold">
//             {p.totalStock} left
//           </span>
//         </li>
//       ))}
//     </ul>
//   )}
// </div>

//     </div>
//   );
// }
