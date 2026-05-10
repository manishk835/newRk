// 📄 app/(admin)/admin/orders/page.tsx

"use client";

import {
  useEffect,
  useState,
} from "react";

import { apiFetch } from "@/lib/api/client";

import {
  useToast,
  ConfirmModal,
} from "@/components/ui/ui-utils";

/* ================= TYPES ================= */

type Order = {
  _id: string;

  user: {
    name: string;
    email: string;
  };

  totalAmount: number;

  status: string;

  paymentStatus: string;

  createdAt: string;
};

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

/* ================= COLORS ================= */

const statusColors: Record<
  string,
  string
> = {
  Delivered:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",

  Cancelled:
    "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",

  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",

  Confirmed:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",

  Packed:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",

  Shipped:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
};

const paymentColors: Record<
  string,
  string
> = {
  Paid:
    "text-green-600 dark:text-green-400",

  Pending:
    "text-yellow-600 dark:text-yellow-400",

  Failed:
    "text-red-600 dark:text-red-400",

  COD:
    "text-blue-600 dark:text-blue-400",
};

/* ================= PAGE ================= */

export default function AdminOrdersPage() {

  const { showToast } =
    useToast();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    actionLoading,
    setActionLoading,
  ] = useState<
    string | null
  >(null);

  const [
    confirmOpen,
    setConfirmOpen,
  ] = useState(false);

  const [
    selectedId,
    setSelectedId,
  ] = useState<
    string | null
  >(null);

  const [
    nextStatus,
    setNextStatus,
  ] = useState<
    string | null
  >(null);

  /* ================= LOAD ================= */

  const loadOrders =
    async () => {
      try {

        setLoading(true);

        const res =
          await apiFetch(
            "/admin/orders"
          );

        setOrders(
          Array.isArray(
            res
          )
            ? res
            : []
        );

      } catch {

        showToast(
          "Failed to load orders",
          "error"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= UPDATE ================= */

  const updateStatus =
    async () => {

      if (
        !selectedId ||
        !nextStatus
      ) {
        return;
      }

      try {

        setActionLoading(
          selectedId
        );

        await apiFetch(
          `/admin/orders/${selectedId}/status`,
          {
            method:
              "PUT",

            body: JSON.stringify(
              {
                status:
                  nextStatus,
              }
            ),
          }
        );

        setOrders(
          (prev) =>
            prev.map(
              (o) =>
                o._id ===
                selectedId
                  ? {
                      ...o,
                      status:
                        nextStatus,
                    }
                  : o
            )
        );

        showToast(
          "Order updated",
          "success"
        );

      } catch {

        showToast(
          "Update failed",
          "error"
        );

      } finally {

        setActionLoading(
          null
        );

        setConfirmOpen(
          false
        );

        setSelectedId(
          null
        );

        setNextStatus(
          null
        );

      }
    };

  const openConfirm = (
    id: string,
    status: string
  ) => {

    setSelectedId(id);

    setNextStatus(status);

    setConfirmOpen(true);
  };

  /* ================= FILTER ================= */

  const filtered =
    orders.filter(
      (o) => {

        const matchSearch =
          o.user?.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        if (
          statusFilter ===
          "all"
        ) {
          return matchSearch;
        }

        return (
          o.status ===
            statusFilter &&
          matchSearch
        );
      }
    );

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
      <div className="max-w-7xl mx-auto space-y-5">

        <div>

          <div className="h-8 w-52 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-2" />

          <div className="h-4 w-72 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />

        </div>

        {[...Array(6)].map(
          (_, i) => (

            <div
              key={i}
              className="h-16 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse"
            />

          )
        )}

      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-black dark:text-white">
            Orders Management
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and track all marketplace orders
          </p>

        </div>

        <button
          onClick={
            loadOrders
          }
          className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
        >
          Refresh
        </button>

      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* SEARCH */}
        <input
          placeholder="Search user..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-3 rounded-xl outline-none w-full md:w-72"
        />

        {/* FILTER */}
        <select
          value={
            statusFilter
          }
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
        >

          <option value="all">
            All Status
          </option>

          {STATUS_OPTIONS.map(
            (s) => (

              <option
                key={s}
                value={s}
              >
                {s}
              </option>

            )
          )}

        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">

        {filtered.length ===
        0 ? (

          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            No orders found
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              {/* HEAD */}
              <thead className="bg-gray-100 dark:bg-zinc-800 text-left text-gray-700 dark:text-gray-300">

                <tr>

                  <th className="p-4">
                    User
                  </th>

                  <th className="p-4">
                    Amount
                  </th>

                  <th className="p-4">
                    Payment
                  </th>

                  <th className="p-4">
                    Status
                  </th>

                  <th className="p-4">
                    Date
                  </th>

                  <th className="p-4">
                    Update
                  </th>

                </tr>

              </thead>

              {/* BODY */}
              <tbody>

                {filtered.map(
                  (o) => {

                    const isLoading =
                      actionLoading ===
                      o._id;

                    return (
                      <tr
                        key={
                          o._id
                        }
                        className="border-t border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition"
                      >

                        {/* USER */}
                        <td className="p-4">

                          <div className="font-medium text-black dark:text-white">
                            {
                              o.user
                                ?.name
                            }
                          </div>

                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {
                              o.user
                                ?.email
                            }
                          </div>

                        </td>

                        {/* AMOUNT */}
                        <td className="p-4 font-semibold text-black dark:text-white">

                          {formatCurrency(
                            o.totalAmount
                          )}

                        </td>

                        {/* PAYMENT */}
                        <td className="p-4">

                          <span
                            className={`font-medium ${
                              paymentColors[
                                o
                                  .paymentStatus
                              ] ||
                              ""
                            }`}
                          >

                            {
                              o.paymentStatus
                            }

                          </span>

                        </td>

                        {/* STATUS */}
                        <td className="p-4">

                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                              statusColors[
                                o.status
                              ] ||
                              ""
                            }`}
                          >

                            {
                              o.status
                            }

                          </span>

                        </td>

                        {/* DATE */}
                        <td className="p-4 text-xs text-gray-500 dark:text-gray-400">

                          {new Date(
                            o.createdAt
                          ).toLocaleString()}

                        </td>

                        {/* UPDATE */}
                        <td className="p-4">

                          <select
                            disabled={
                              isLoading
                            }
                            value={
                              o.status
                            }
                            onChange={(
                              e
                            ) =>
                              openConfirm(
                                o._id,
                                e
                                  .target
                                  .value
                              )
                            }
                            className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white px-3 py-2 rounded-lg text-xs outline-none"
                          >

                            {STATUS_OPTIONS.map(
                              (
                                s
                              ) => (

                                <option
                                  key={
                                    s
                                  }
                                  value={
                                    s
                                  }
                                >
                                  {
                                    s
                                  }
                                </option>

                              )
                            )}

                          </select>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title="Update order status?"
        description={`Change status to ${nextStatus}`}
        onConfirm={
          updateStatus
        }
        onCancel={() =>
          setConfirmOpen(
            false
          )
        }
      />

    </div>
  );
}

// // app/(admin)/admin/orders/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch } from "@/lib/api/client";
// import { useToast, ConfirmModal } from "@/components/ui/ui-utils";

// /* ================= TYPES ================= */

// type Order = {
//   _id: string;
//   user: { name: string; email: string };
//   totalAmount: number;
//   status: string;
//   createdAt: string;
// };

// const STATUS_OPTIONS = [
//   "Pending",
//   "Confirmed",
//   "Packed",
//   "Shipped",
//   "Delivered",
//   "Cancelled",
// ];

// export default function AdminOrdersPage() {
//   const { showToast } = useToast();

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const [actionLoading, setActionLoading] = useState<string | null>(null);

//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [nextStatus, setNextStatus] = useState<string | null>(null);

//   /* ================= LOAD ================= */

//   const loadOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await apiFetch("/admin/orders");
//       setOrders(res || []);
//     } catch {
//       showToast("Failed to load orders", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   /* ================= UPDATE STATUS ================= */

//   const updateStatus = async () => {
//     if (!selectedId || !nextStatus) return;

//     try {
//       setActionLoading(selectedId);

//       await apiFetch(`/admin/orders/${selectedId}/status`, {
//         method: "PUT",
//         body: JSON.stringify({ status: nextStatus }),
//       });

//       setOrders((prev) =>
//         prev.map((o) =>
//           o._id === selectedId ? { ...o, status: nextStatus } : o
//         )
//       );

//       showToast("Order updated", "success");
//     } catch {
//       showToast("Update failed", "error");
//     } finally {
//       setActionLoading(null);
//       setConfirmOpen(false);
//       setSelectedId(null);
//       setNextStatus(null);
//     }
//   };

//   const openConfirm = (id: string, status: string) => {
//     setSelectedId(id);
//     setNextStatus(status);
//     setConfirmOpen(true);
//   };

//   /* ================= FILTER ================= */

//   const filtered = orders.filter((o) => {
//     const matchSearch = o.user?.name
//       ?.toLowerCase()
//       .includes(search.toLowerCase());

//     if (statusFilter === "all") return matchSearch;

//     return o.status === statusFilter && matchSearch;
//   });

//   const formatCurrency = (value: number) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value || 0);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Delivered":
//         return "bg-green-100 text-green-700";
//       case "Cancelled":
//         return "bg-red-100 text-red-700";
//       case "Pending":
//         return "bg-yellow-100 text-yellow-700";
//       default:
//         return "bg-blue-100 text-blue-700";
//     }
//   };

//   /* ================= UI ================= */

//   if (loading) {
//     return (
//       <div className="p-6 text-gray-500">Loading orders...</div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto space-y-6">
//       <h1 className="text-2xl font-bold">Orders Management</h1>

//       {/* FILTERS */}
//       <div className="flex gap-3 flex-wrap">
//         <input
//           placeholder="Search user..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border px-3 py-2 rounded-lg"
//         />

//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="border px-3 py-2 rounded-lg"
//         >
//           <option value="all">All Status</option>
//           {STATUS_OPTIONS.map((s) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-3">User</th>
//               <th className="p-3">Amount</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Date</th>
//               <th className="p-3">Update</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filtered.map((o) => {
//               const isLoading = actionLoading === o._id;

//               return (
//                 <tr key={o._id} className="border-t hover:bg-gray-50">
//                   <td className="p-3">
//                     <div className="font-medium">{o.user?.name}</div>
//                     <div className="text-xs text-gray-500">
//                       {o.user?.email}
//                     </div>
//                   </td>

//                   <td className="p-3 font-semibold">
//                     {formatCurrency(o.totalAmount)}
//                   </td>

//                   <td className="p-3">
//                     <span
//                       className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
//                         o.status
//                       )}`}
//                     >
//                       {o.status}
//                     </span>
//                   </td>

//                   <td className="p-3 text-gray-500">
//                     {new Date(o.createdAt).toLocaleString()}
//                   </td>

//                   <td className="p-3">
//                     <select
//                       disabled={isLoading}
//                       value={o.status}
//                       onChange={(e) =>
//                         openConfirm(o._id, e.target.value)
//                       }
//                       className="border px-2 py-1 rounded text-xs"
//                     >
//                       {STATUS_OPTIONS.map((s) => (
//                         <option key={s} value={s}>
//                           {s}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* CONFIRM */}
//       <ConfirmModal
//         open={confirmOpen}
//         title="Update order status?"
//         description={`Change status to ${nextStatus}`}
//         onConfirm={updateStatus}
//         onCancel={() => setConfirmOpen(false)}
//       />
//     </div>
//   );
// }
