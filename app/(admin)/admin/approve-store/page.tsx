// app/(admin)/admin/approve-store/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

/* ================= TYPES ================= */

type Seller = {
  _id: string;
  name: string;
  email: string;
  sellerInfo?: {
    storeName?: string;
    storeDescription?: string;
  };
  createdAt: string;
};

/* ================= PAGE ================= */

export default function ApproveStorePage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  /* ================= LOAD ================= */

  const loadSellers = async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/admin/sellers/pending");
      setSellers(Array.isArray(res) ? res : []);

    } catch {
      console.error("Failed to load sellers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  /* ================= ACTIONS ================= */

  const approveSeller = async (id: string) => {
    if (!confirm("Approve this seller?")) return;

    try {
      setProcessingId(id);

      await apiFetch(`/admin/sellers/${id}/approve`, {
        method: "PUT",
      });

      setSellers((prev) =>
        prev.filter((s) => s._id !== id)
      );

    } catch {
      alert("Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const rejectSeller = async (id: string) => {
    if (!confirm("Reject this seller?")) return;

    try {
      setProcessingId(id);

      await apiFetch(`/admin/sellers/${id}/reject`, {
        method: "PUT",
      });

      setSellers((prev) =>
        prev.filter((s) => s._id !== id)
      );

    } catch {
      alert("Reject failed");
    } finally {
      setProcessingId(null);
    }
  };

  /* ================= FILTER ================= */

  const filtered = sellers.filter((s) =>
    (s.sellerInfo?.storeName || s.name)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-10">Loading sellers...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">
          Seller Approval
        </h1>

        <button
          onClick={loadSellers}
          className="border px-4 py-2 rounded-lg text-sm"
        >
          Refresh
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search seller..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 rounded-lg mb-6 w-72"
      />

      {/* TABLE */}
      {filtered.length === 0 ? (

        <div className="bg-white border rounded-xl p-8 text-center">
          No pending sellers
        </div>

      ) : (

        <div className="bg-white border rounded-xl overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4">Store</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Email</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map((seller) => (

                <tr
                  key={seller._id}
                  className="border-t"
                >

                  <td className="p-4 font-medium">
                    {seller.sellerInfo?.storeName || "-"}
                  </td>

                  <td className="p-4">
                    {seller.name}
                  </td>

                  <td className="p-4">
                    {seller.email}
                  </td>

                  <td className="p-4 text-gray-600">
                    {seller.sellerInfo?.storeDescription || "-"}
                  </td>

                  <td className="p-4 text-right space-x-2">

                    <button
                      onClick={() =>
                        approveSeller(seller._id)
                      }
                      disabled={processingId === seller._id}
                      className="px-3 py-1 bg-green-600 text-white rounded-md text-xs"
                    >
                      {processingId === seller._id
                        ? "..."
                        : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        rejectSeller(seller._id)
                      }
                      disabled={processingId === seller._id}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-xs"
                    >
                      Reject
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

// // // // app/(admin)/admin/approve-store/page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch } from "@/lib/api/client";

// type VendorApplication = {
//   _id: string;
//   businessName: string;
//   email: string;
//   phone: string;
//   category: string;
//   message?: string;
//   status: "pending" | "approved" | "rejected";
//   createdAt: string;
// };

// export default function ApproveStorePage() {
//   const [applications, setApplications] = useState<VendorApplication[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [processingId, setProcessingId] = useState<string | null>(null);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   /* ================= LOAD DATA ================= */

//   useEffect(() => {
//     loadApplications();
//   }, []);

//   const loadApplications = async () => {
//     try {
//       setLoading(true);

//       const res = await apiFetch("/vendors");

//       setApplications(Array.isArray(res) ? res : []);
//     } catch {
//       console.error("Failed to load applications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UPDATE STATUS ================= */

//   const updateStatus = async (
//     id: string,
//     status: "approved" | "rejected"
//   ) => {
//     const confirmAction = confirm(
//       `Are you sure you want to ${status} this vendor?`
//     );

//     if (!confirmAction) return;

//     try {
//       setProcessingId(id);

//       await apiFetch(`/vendors/${id}/status`, {
//         method: "PATCH",
//         body: JSON.stringify({ status }),
//       });

//       setApplications((prev) =>
//         prev.map((app) =>
//           app._id === id ? { ...app, status } : app
//         )
//       );
//     } catch {
//       alert("Failed to update status");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   /* ================= FILTER ================= */

//   const filtered = applications
//     .filter((app) =>
//       app.businessName
//         .toLowerCase()
//         .includes(search.toLowerCase())
//     )
//     .filter((app) =>
//       statusFilter === "all"
//         ? true
//         : app.status === statusFilter
//     );

//   /* ================= STATS ================= */

//   const pending = applications.filter(
//     (a) => a.status === "pending"
//   ).length;

//   const approved = applications.filter(
//     (a) => a.status === "approved"
//   ).length;

//   const rejected = applications.filter(
//     (a) => a.status === "rejected"
//   ).length;

//   if (loading) {
//     return (
//       <div className="p-10 text-gray-500">
//         Loading vendor applications...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto">

//       {/* HEADER */}

//       <div className="flex justify-between items-center mb-10">

//         <h1 className="text-3xl font-bold">
//           Vendor Applications
//         </h1>

//         <button
//           onClick={loadApplications}
//           className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
//         >
//           Refresh
//         </button>

//       </div>

//       {/* STATS */}

//       <div className="grid grid-cols-3 gap-6 mb-10">

//         <StatCard title="Pending" value={pending} />
//         <StatCard title="Approved" value={approved} />
//         <StatCard title="Rejected" value={rejected} />

//       </div>

//       {/* FILTERS */}

//       <div className="flex gap-4 mb-6">

//         <input
//           placeholder="Search business..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border px-4 py-2 rounded-lg w-72"
//         />

//         <select
//           value={statusFilter}
//           onChange={(e) =>
//             setStatusFilter(e.target.value)
//           }
//           className="border px-4 py-2 rounded-lg"
//         >
//           <option value="all">All</option>
//           <option value="pending">
//             Pending
//           </option>
//           <option value="approved">
//             Approved
//           </option>
//           <option value="rejected">
//             Rejected
//           </option>
//         </select>

//       </div>

//       {/* TABLE */}

//       {filtered.length === 0 ? (

//         <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
//           No vendor applications found.
//         </div>

//       ) : (

//         <div className="bg-white border rounded-xl overflow-hidden">

//           <table className="w-full text-sm">

//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="p-4">Business</th>
//                 <th className="p-4">Email</th>
//                 <th className="p-4">Phone</th>
//                 <th className="p-4">Category</th>
//                 <th className="p-4">Message</th>
//                 <th className="p-4">Status</th>
//                 <th className="p-4 text-right">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody>

//               {filtered.map((app) => (

//                 <tr
//                   key={app._id}
//                   className="border-t hover:bg-gray-50"
//                 >

//                   <td className="p-4 font-medium">
//                     {app.businessName}
//                   </td>

//                   <td className="p-4">
//                     {app.email}
//                   </td>

//                   <td className="p-4">
//                     {app.phone}
//                   </td>

//                   <td className="p-4 capitalize">
//                     {app.category}
//                   </td>

//                   <td className="p-4 max-w-xs text-gray-600">
//                     {app.message || "-"}
//                   </td>

//                   <td className="p-4">
//                     <StatusBadge status={app.status} />
//                   </td>

//                   <td className="p-4 text-right space-x-2">

//                     {app.status === "pending" && (

//                       <>

//                         <button
//                           onClick={() =>
//                             updateStatus(
//                               app._id,
//                               "approved"
//                             )
//                           }
//                           disabled={
//                             processingId === app._id
//                           }
//                           className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
//                         >
//                           {processingId === app._id
//                             ? "..."
//                             : "Approve"}
//                         </button>

//                         <button
//                           onClick={() =>
//                             updateStatus(
//                               app._id,
//                               "rejected"
//                             )
//                           }
//                           disabled={
//                             processingId === app._id
//                           }
//                           className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
//                         >
//                           Reject
//                         </button>

//                       </>

//                     )}

//                   </td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>

//         </div>

//       )}

//     </div>
//   );
// }

// /* ================= STATUS BADGE ================= */

// function StatusBadge({
//   status,
// }: {
//   status: "pending" | "approved" | "rejected";
// }) {

//   const color =
//     status === "approved"
//       ? "bg-green-100 text-green-700"
//       : status === "rejected"
//       ? "bg-red-100 text-red-700"
//       : "bg-yellow-100 text-yellow-700";

//   return (
//     <span
//       className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${color}`}
//     >
//       {status}
//     </span>
//   );
// }

// /* ================= STAT CARD ================= */

// function StatCard({
//   title,
//   value,
// }: {
//   title: string;
//   value: number;
// }) {

//   return (

//     <div className="bg-white border rounded-xl p-6">

//       <p className="text-sm text-gray-500">
//         {title}
//       </p>

//       <p className="text-2xl font-bold mt-2">
//         {value}
//       </p>

//     </div>

//   );

// }