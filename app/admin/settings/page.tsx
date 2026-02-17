"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Settings = {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
};

/* ================= PAGE ================= */

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    storeName: "",
    supportEmail: "",
    supportPhone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings`,
          {
            credentials: "include", // 🔥 cookie based
            cache: "no-store",
          }
        );

        if (res.status === 401 || res.status === 403) {
          window.location.href = "/admin/login";
          return;
        }

        if (!res.ok) throw new Error();

        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("Settings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings`,
        {
          method: "PUT",
          credentials: "include", // 🔥 cookie based
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      if (res.status === 401 || res.status === 403) {
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) throw new Error();

      alert("Settings saved");
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-10">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-10 pb-16 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">
        Store Settings
      </h1>

      <form
        onSubmit={handleSave}
        className="space-y-4 border rounded-xl p-6 bg-white"
      >
        <input
          placeholder="Store Name"
          className="border px-4 py-2 rounded w-full"
          value={settings.storeName}
          onChange={(e) =>
            setSettings({
              ...settings,
              storeName: e.target.value,
            })
          }
        />

        <input
          placeholder="Support Email"
          className="border px-4 py-2 rounded w-full"
          value={settings.supportEmail}
          onChange={(e) =>
            setSettings({
              ...settings,
              supportEmail: e.target.value,
            })
          }
        />

        <input
          placeholder="Support Phone"
          className="border px-4 py-2 rounded w-full"
          value={settings.supportPhone}
          onChange={(e) =>
            setSettings({
              ...settings,
              supportPhone: e.target.value,
            })
          }
        />

        <button
          disabled={saving}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
