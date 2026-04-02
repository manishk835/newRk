"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { useToast, ConfirmModal } from "@/components/ui/ui-utils";

/* ================= TYPES ================= */

type Application = {
  _id: string;
  businessName: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  status: string;
  createdAt: string;
};

/* ================= PAGE ================= */

export default function ApproveStorePage() {
  const { showToast } = useToast();

  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* ================= LOAD ================= */

  const loadApplications = async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/vendors"); // ✅ correct API

      // 🔥 only pending show
      const pending = Array.isArray(res)
        ? res.filter((a) => a.status === "pending")
        : [];

      setApps(pending);

    } catch {
      showToast("Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  /* ================= ACTION ================= */

  const handleAction = async () => {
    if (!selectedId || !actionType) return;

    try {
      setProcessingId(selectedId);

      await apiFetch(`/vendors/${selectedId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: actionType,
        }),
      });

      // remove from UI
      setApps((prev) => prev.filter((a) => a._id !== selectedId));

      showToast(
        actionType === "approved"
          ? "Seller approved"
          : "Seller rejected",
        "success"
      );

    } catch {
      showToast("Action failed", "error");
    } finally {
      setProcessingId(null);
      setConfirmOpen(false);
      setSelectedId(null);
      setActionType(null);
    }
  };

  const openConfirm = (type: "approved" | "rejected", id: string) => {
    setSelectedId(id);
    setActionType(type);
    setConfirmOpen(true);
  };

  /* ================= FILTER ================= */

  const filtered = apps.filter((a) =>
    a.businessName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Seller Applications</h1>

        <button
          onClick={loadApplications}
          className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search business..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 rounded-lg w-72"
      />

      {/* TABLE */}
      {filtered.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
          No pending applications
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Business</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Category</th>
                <th className="p-4">Message</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((app) => {
                const isLoading = processingId === app._id;

                return (
                  <tr key={app._id} className="border-t hover:bg-gray-50">

                    <td className="p-4 font-medium">{app.businessName}</td>
                    <td className="p-4">{app.email}</td>
                    <td className="p-4">{app.phone}</td>
                    <td className="p-4">{app.category}</td>
                    <td className="p-4 text-gray-500">{app.message}</td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openConfirm("approved", app._id)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => openConfirm("rejected", app._id)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                      >
                        Reject
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      )}

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title="Confirm action?"
        description="This cannot be undone"
        onConfirm={handleAction}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>
  );
}

// // // app/(admin)/admin/approve-store/page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch } from "@/lib/api/client";
// import { useToast, ConfirmModal } from "@/components/ui/ui-utils";

// /* ================= TYPES ================= */

// type Seller = {
//   _id: string;
//   name: string;
//   email: string;
//   sellerInfo?: {
//     storeName?: string;
//     storeDescription?: string;
//   };
//   createdAt: string;
// };

// /* ================= PAGE ================= */

// export default function ApproveStorePage() {
//   const { showToast } = useToast();

//   const [sellers, setSellers] = useState<Seller[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [processingId, setProcessingId] = useState<string | null>(null);

//   const [search, setSearch] = useState("");

//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
//   const [selectedId, setSelectedId] = useState<string | null>(null);

//   /* ================= LOAD ================= */

//   const loadSellers = async () => {
//     try {
//       setLoading(true);
//       // const res = await apiFetch("/admin/sellers/pending");
//       const res = await apiFetch("/vendors");
//       setSellers(Array.isArray(res) ? res : []);
//     } catch {
//       showToast("Failed to load sellers", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadSellers();
//   }, []);

//   /* ================= ACTION ================= */

//   const handleAction = async () => {
//     if (!selectedId || !actionType) return;

//     try {
//       setProcessingId(selectedId);

//       await apiFetch(`/admin/sellers/${selectedId}/${actionType}`, {
//         method: "PUT",
//       });

//       setSellers((prev) => prev.filter((s) => s._id !== selectedId));

//       showToast(
//         actionType === "approve"
//           ? "Seller approved"
//           : "Seller rejected",
//         "success"
//       );
//     } catch {
//       showToast("Action failed", "error");
//     } finally {
//       setProcessingId(null);
//       setConfirmOpen(false);
//       setSelectedId(null);
//       setActionType(null);
//     }
//   };

//   const openConfirm = (type: "approve" | "reject", id: string) => {
//     setSelectedId(id);
//     setActionType(type);
//     setConfirmOpen(true);
//   };

//   /* ================= FILTER ================= */

//   const filtered = sellers.filter((s) =>
//     (s.sellerInfo?.storeName || s.name)
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="p-10 text-gray-500">
//         Loading sellers...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto space-y-6">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">
//           Seller Approval
//         </h1>

//         <button
//           onClick={loadSellers}
//           className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
//         >
//           Refresh
//         </button>
//       </div>

//       {/* SEARCH */}
//       <input
//         placeholder="Search seller..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="border px-4 py-2 rounded-lg w-72"
//       />

//       {/* TABLE */}
//       {filtered.length === 0 ? (
//         <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
//           No pending sellers
//         </div>
//       ) : (
//         <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100 text-left">
//               <tr>
//                 <th className="p-4">Store</th>
//                 <th className="p-4">Owner</th>
//                 <th className="p-4">Email</th>
//                 <th className="p-4">Description</th>
//                 <th className="p-4 text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filtered.map((seller) => {
//                 const isLoading = processingId === seller._id;

//                 return (
//                   <tr key={seller._id} className="border-t hover:bg-gray-50">
//                     <td className="p-4 font-medium">
//                       {seller.sellerInfo?.storeName || "-"}
//                     </td>

//                     <td className="p-4">
//                       {seller.name}
//                     </td>

//                     <td className="p-4 text-gray-600">
//                       {seller.email}
//                     </td>

//                     <td className="p-4 text-gray-500">
//                       {seller.sellerInfo?.storeDescription || "-"}
//                     </td>

//                     <td className="p-4 text-right space-x-2">
//                       <button
//                         onClick={() => openConfirm("approve", seller._id)}
//                         disabled={isLoading}
//                         className="px-3 py-1 bg-green-600 text-white rounded text-xs"
//                       >
//                         Approve
//                       </button>

//                       <button
//                         onClick={() => openConfirm("reject", seller._id)}
//                         disabled={isLoading}
//                         className="px-3 py-1 bg-red-600 text-white rounded text-xs"
//                       >
//                         Reject
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* CONFIRM MODAL */}
//       <ConfirmModal
//         open={confirmOpen}
//         title={
//           actionType === "approve"
//             ? "Approve seller?"
//             : "Reject seller?"
//         }
//         description="This action cannot be undone"
//         onConfirm={handleAction}
//         onCancel={() => setConfirmOpen(false)}
//       />
//     </div>
//   );
// }