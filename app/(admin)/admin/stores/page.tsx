// app/(admin)/admin/stores/page.tsx

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

export default function StoresPage() {
  const [stores, setStores] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const res = await apiFetch("/vendors");
      const approvedStores = (res || []).filter(
        (s: VendorApplication) => s.status === "approved"
      );
      setStores(approvedStores);
    } catch (err) {
      console.error("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading stores...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Live Stores</h1>

      {stores.length === 0 ? (
        <div className="bg-white border rounded-xl p-6">
          No live stores found.
        </div>
      ) : (
        <div className="space-y-6">
          {stores.map((store) => (
            <StoreCard key={store._id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= STORE CARD ================= */

function StoreCard({ store }: { store: VendorApplication }) {
  const [active, setActive] = useState(true);

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        {/* LEFT SIDE */}
        <div>
          <h2 className="text-xl font-semibold">
            {store.businessName}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {store.category}
          </p>

          {store.message && (
            <p className="text-sm text-gray-600 mt-3 max-w-xl">
              {store.message}
            </p>
          )}

          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <p>📧 {store.email}</p>
            <p>📞 {store.phone}</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-end gap-4">
          <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
            Approved
          </span>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Active
            </span>

            <button
              onClick={() => setActive(!active)}
              className={`w-10 h-5 rounded-full relative transition ${
                active ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${
                  active ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-400">
        Applied on{" "}
        {new Date(store.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}