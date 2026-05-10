// app/(admin)/admin/stores/page.tsx

"use client";

import {
  useEffect,
  useState,
} from "react";

import { apiFetch } from "@/lib/api/client";

/* ================= TYPES ================= */

type VendorApplication = {
  _id: string;

  businessName: string;

  email: string;

  phone: string;

  category: string;

  message?: string;

  status:
    | "pending"
    | "approved"
    | "rejected";

  createdAt: string;
};

/* ================= PAGE ================= */

export default function StoresPage() {

  const [stores, setStores] =
    useState<
      VendorApplication[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  /* ================= LOAD ================= */

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores =
    async () => {
      try {

        const res =
          await apiFetch(
            "/vendors"
          );

        const approvedStores =
          (res || []).filter(
            (
              s: VendorApplication
            ) =>
              s.status ===
              "approved"
          );

        setStores(
          approvedStores
        );

      } catch {

        console.error(
          "Failed to load stores"
        );

      } finally {

        setLoading(false);

      }
    };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-5">

        <div>

          <div className="h-8 w-52 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-2" />

          <div className="h-4 w-72 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />

        </div>

        {[...Array(4)].map(
          (_, i) => (

            <div
              key={i}
              className="h-40 bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse"
            />

          )
        )}

      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold text-black dark:text-white">
          Live Stores
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Approved stores currently active on marketplace
        </p>

      </div>

      {/* EMPTY */}
      {stores.length ===
      0 ? (

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-10 text-center shadow-sm">

          <p className="text-gray-500 dark:text-gray-400">
            No live stores found
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {stores.map(
            (store) => (

              <StoreCard
                key={
                  store._id
                }
                store={store}
              />

            )
          )}

        </div>

      )}

    </div>
  );
}

/* ================= STORE CARD ================= */

function StoreCard({
  store,
}: {
  store: VendorApplication;
}) {

  const [active, setActive] =
    useState(true);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">

      <div className="flex flex-col lg:flex-row lg:justify-between gap-8">

        {/* LEFT */}
        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-3">

            <h2 className="text-2xl font-semibold text-black dark:text-white">
              {
                store.businessName
              }
            </h2>

            <span className="px-3 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 rounded-full font-medium">
              Approved
            </span>

          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 capitalize">
            {
              store.category
            }
          </p>

          {store.message && (

            <div className="mt-5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4">

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {
                  store.message
                }
              </p>

            </div>

          )}

          {/* CONTACT */}
          <div className="mt-5 grid sm:grid-cols-2 gap-4">

            <div className="bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Email
              </p>

              <p className="text-sm text-black dark:text-white break-all">
                📧{" "}
                {
                  store.email
                }
              </p>

            </div>

            <div className="bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Phone
              </p>

              <p className="text-sm text-black dark:text-white">
                📞{" "}
                {
                  store.phone
                }
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-start lg:items-end justify-between gap-6">

          {/* ACTIVE TOGGLE */}
          <div className="flex items-center gap-3">

            <span className="text-sm text-gray-600 dark:text-gray-400">
              {active
                ? "Active"
                : "Inactive"}
            </span>

            <button
              onClick={() =>
                setActive(
                  !active
                )
              }
              className={`w-12 h-6 rounded-full relative transition ${
                active
                  ? "bg-green-500"
                  : "bg-gray-300 dark:bg-zinc-700"
              }`}
            >

              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
                  active
                    ? "translate-x-6"
                    : ""
                }`}
              />

            </button>

          </div>

          {/* DATE */}
          <div className="text-xs text-gray-400 dark:text-gray-500">

            Applied on{" "}

            {new Date(
              store.createdAt
            ).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            )}

          </div>

        </div>

      </div>

    </div>
  );
}