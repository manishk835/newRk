// app/admin/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  const navItem = (
    href: string,
    label: string
  ) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`block px-4 py-2 rounded-lg text-sm font-medium transition
          ${
            active
              ? "bg-black text-white"
              : "text-gray-700 hover:bg-gray-100"
          }
        `}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col">
        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-bold">
            RK<span className="text-[#F5A623]">Admin</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Admin Dashboard
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
        {navItem("/admin", "Dashboard")}
{navItem("/admin/orders", "Orders")}
{navItem("/admin/products", "Products")}

        </nav>

        <div className="px-4 py-4 border-t">
          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              router.replace("/admin/login");
            }}
            className="w-full text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 min-h-screen">
        {/* Top spacing so content doesn’t stick */}
        <div className="px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
