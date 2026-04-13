"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

/* ================= TYPES ================= */

type OrderItem = {
  title: string;
  quantity: number;
};

type Customer = {
  name: string;
  phone: string;
  city?: string;
};

type Order = {
  _id: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  sellerTotal: number;
  customer: Customer;
  items: OrderItem[];
};

/* ================= STATUS COLORS ================= */

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Packed: "bg-purple-100 text-purple-700",
  Confirmed: "bg-indigo-100 text-indigo-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

const paymentColors: Record<string, string> = {
  Paid: "text-green-600",
  Pending: "text-yellow-600",
  Failed: "text-red-600",
  COD: "text-blue-600",
};

/* ================= PAGE ================= */

export default function SellerOrdersPage() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ================= LOAD ================= */

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/seller/orders");
      const list = Array.isArray(data) ? data : [];
      setOrders(list);
      setFiltered(list);
    } catch {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= FILTER ================= */

  useEffect(() => {
    let data = [...orders];

    if (search) {
      data = data.filter((o) =>
        o.customer?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      data = data.filter(
        (o) => o.status.toLowerCase() === statusFilter
      );
    }

    setFiltered(data);
  }, [search, statusFilter, orders]);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);

      await apiFetch(`/seller/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, status } : o
        )
      );

    } catch {
      alert("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>

        <button
          onClick={loadOrders}
          className="border px-4 py-2 rounded-lg text-sm"
        >
          Refresh
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 flex-wrap">

        <input
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-2xl overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading orders...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No orders found
          </div>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-left">Payment</th>
                <th className="p-4 text-left">Earnings</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Update</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map((order) => (

                <tr key={order._id} className="border-t">

                  {/* CUSTOMER */}
                  <td className="p-4">
                    <div className="font-medium">
                      {order.customer?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.customer?.phone}
                    </div>
                  </td>

                  {/* ITEMS */}
                  <td className="p-4 space-y-1">
                    {order.items.map((i, idx) => (
                      <div key={idx}>
                        {i.title} × {i.quantity}
                      </div>
                    ))}
                  </td>

                  {/* PAYMENT */}
                  <td className="p-4">
                    <span className={paymentColors[order.paymentStatus] || ""}>
                      {order.paymentStatus}
                    </span>
                  </td>

                  {/* EARNINGS */}
                  <td className="p-4 text-green-600 font-semibold">
                    ₹{order.sellerTotal}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${statusColors[order.status] || "bg-gray-100"}`}>
                      {order.status}
                    </span>
                  </td>

                  {/* UPDATE */}
                  <td className="p-4">
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                      className="border px-2 py-1 text-sm rounded"
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Packed</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>

                  {/* DATE */}
                  <td className="p-4 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

// // app/(seller)/seller/orders/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch } from "@/lib/api/client";

// type OrderItem = {
//   title: string;
//   quantity: number;
//   sellerEarning: number;
// };

// type Customer = {
//   name: string;
//   phone: string;
//   city?: string;
// };

// type Order = {
//   _id: string;
//   status: string;
//   paymentStatus: string;
//   createdAt: string;
//   sellerTotal: number;
//   customer: Customer;
//   items: OrderItem[];
// };

// export default function SellerOrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= LOAD ORDERS ================= */

//   const loadOrders = async () => {
//     try {
//       const data = await apiFetch("/seller/orders");
//       setOrders(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Order load error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   /* ================= STATUS COLOR ================= */

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Delivered":
//         return "bg-green-100 text-green-700";

//       case "Shipped":
//         return "bg-blue-100 text-blue-700";

//       case "Packed":
//         return "bg-purple-100 text-purple-700";

//       case "Confirmed":
//         return "bg-indigo-100 text-indigo-700";

//       case "Pending":
//         return "bg-yellow-100 text-yellow-700";

//       case "Cancelled":
//         return "bg-red-100 text-red-700";

//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   /* ================= LOADING ================= */

//   if (loading) {
//     return (
//       <div className="p-10 text-center text-gray-500">
//         Loading orders...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto">

//       <h1 className="text-3xl font-bold mb-8">
//         Store Orders
//       </h1>

//       <div className="bg-white rounded-2xl shadow border overflow-hidden">

//         <table className="w-full text-sm">

//           <thead className="bg-gray-50 text-gray-600">

//             <tr>

//               <th className="p-4 text-left">
//                 Customer
//               </th>

//               <th className="p-4 text-left">
//                 Items
//               </th>

//               <th className="p-4 text-left">
//                 Earnings
//               </th>

//               <th className="p-4 text-left">
//                 Status
//               </th>

//               <th className="p-4 text-left">
//                 Date
//               </th>

//             </tr>

//           </thead>

//           <tbody>

//             {orders.map((order) => (

//               <tr
//                 key={order._id}
//                 className="border-t hover:bg-gray-50"
//               >

//                 {/* CUSTOMER */}

//                 <td className="p-4">

//                   <div className="font-medium">
//                     {order.customer?.name}
//                   </div>

//                   <div className="text-gray-500 text-xs">
//                     {order.customer?.phone}
//                   </div>

//                   {order.customer?.city && (
//                     <div className="text-gray-400 text-xs">
//                       {order.customer.city}
//                     </div>
//                   )}

//                 </td>

//                 {/* ITEMS */}

//                 <td className="p-4 space-y-1">

//                   {order.items.map((item, i) => (

//                     <div key={i} className="text-sm">

//                       {item.title}

//                       <span className="text-gray-500">
//                         {" "}× {item.quantity}
//                       </span>

//                     </div>

//                   ))}

//                 </td>

//                 {/* EARNINGS */}

//                 <td className="p-4 font-semibold text-green-600">
//                   ₹{order.sellerTotal}
//                 </td>

//                 {/* STATUS */}

//                 <td className="p-4">

//                   <span
//                     className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
//                       order.status
//                     )}`}
//                   >
//                     {order.status}
//                   </span>

//                 </td>

//                 {/* DATE */}

//                 <td className="p-4 text-gray-500 text-xs">

//                   {new Date(
//                     order.createdAt
//                   ).toLocaleString()}

//                 </td>

//               </tr>

//             ))}

//           </tbody>

//         </table>

//         {orders.length === 0 && (
//           <div className="p-10 text-center text-gray-500">
//             No orders yet
//           </div>
//         )}

//       </div>

//     </div>
//   );
// }