// 📄 app/(admin)/admin/logs/page.tsx
"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/admin/logs`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setLogs);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Activity Logs</h1>

      <div className="space-y-3">
        {logs.map((log, i) => (
          <div
            key={i}
            className="border p-3 rounded bg-white shadow-sm"
          >
            <p><b>Action:</b> {log.action}</p>
            <p><b>Email:</b> {log.admin?.email}</p>
            <p><b>IP:</b> {log.ip}</p>
            <p className="text-xs text-gray-500">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}