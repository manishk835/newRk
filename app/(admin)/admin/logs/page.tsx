// 📄 app/(admin)/admin/logs/page.tsx

"use client";

import {
  useEffect,
  useState,
} from "react";

const API =
  process.env
    .NEXT_PUBLIC_API_URL;

/* ================= TYPES ================= */

type Log = {
  action: string;

  ip: string;

  createdAt: string;

  admin?: {
    email?: string;
  };
};

/* ================= PAGE ================= */

export default function LogsPage() {

  const [logs, setLogs] =
    useState<Log[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {

    const loadLogs =
      async () => {
        try {

          setLoading(true);

          const res =
            await fetch(
              `${API}/api/admin/logs`,
              {
                credentials:
                  "include",
              }
            );

          const data =
            await res.json();

          setLogs(
            Array.isArray(
              data
            )
              ? data
              : []
          );

        } catch {

          setLogs([]);

        } finally {

          setLoading(false);

        }
      };

    loadLogs();

  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-5">

        <div>

          <div className="h-8 w-60 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-2" />

          <div className="h-4 w-72 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />

        </div>

        {[...Array(6)].map(
          (_, i) => (

            <div
              key={i}
              className="h-28 bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse"
            />

          )
        )}

      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold text-black dark:text-white">
          Admin Activity Logs
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track admin actions and security activity
        </p>

      </div>

      {/* EMPTY */}
      {logs.length ===
      0 ? (

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-10 text-center shadow-sm">

          <p className="text-gray-500 dark:text-gray-400">
            No logs found
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {logs.map(
            (
              log,
              i
            ) => (

              <div
                key={i}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
              >

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                  {/* LEFT */}
                  <div className="space-y-4 flex-1">

                    {/* ACTION */}
                    <div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Action
                      </p>

                      <p className="font-semibold text-black dark:text-white">
                        {log.action}
                      </p>

                    </div>

                    {/* DETAILS */}
                    <div className="grid sm:grid-cols-2 gap-4">

                      {/* EMAIL */}
                      <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">

                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Admin Email
                        </p>

                        <p className="text-sm text-black dark:text-white break-all">
                          {log.admin
                            ?.email ||
                            "Unknown"}
                        </p>

                      </div>

                      {/* IP */}
                      <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">

                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          IP Address
                        </p>

                        <p className="text-sm text-black dark:text-white">
                          {log.ip ||
                            "N/A"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* DATE */}
                  <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">

                    {new Date(
                      log.createdAt
                    ).toLocaleString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute:
                          "2-digit",
                      }
                    )}

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}