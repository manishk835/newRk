// app/(admin)/admin/approve-store/page.tsx

"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type VendorApplication = {
  _id: string;
  businessName: string;
  email: string;
  phone: string;
  category: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function ApproveStorePage() {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/vendors");
      setApplications(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setProcessingId(id);

      await apiFetch(`/vendors/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Approve Store Applications
      </h1>

      {applications.length === 0 ? (
        <div className="bg-white border rounded-xl p-6">
          No applications found.
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4">Business</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {app.businessName}
                  </td>

                  <td className="p-4">{app.email}</td>

                  <td className="p-4">{app.phone}</td>

                  <td className="p-4">{app.category}</td>

                  <td className="p-4 capitalize">
                    <StatusBadge status={app.status} />
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {app.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(app._id, "approved")
                          }
                          disabled={processingId === app._id}
                          className="px-3 py-1 bg-green-600 text-white rounded-md text-xs"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(app._id, "rejected")
                          }
                          disabled={processingId === app._id}
                          className="px-3 py-1 bg-red-600 text-white rounded-md text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}
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

/* ================= STATUS BADGE ================= */

function StatusBadge({
  status,
}: {
  status: "pending" | "approved" | "rejected";
}) {
  const color =
    status === "approved"
      ? "bg-green-100 text-green-700"
      : status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}
    >
      {status}
    </span>
  );
}