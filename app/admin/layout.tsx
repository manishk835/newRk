"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  const navItem = (href: string, label: string) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
          active
            ? "bg-black text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {label}
      </Link>
    );
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/logout`,
        {
          method: "POST",
          credentials: "include", // 🔥 important for cookies
        }
      );

      router.replace("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      {!isLoginPage && (
        <aside className="w-64 bg-white border-r hidden lg:flex flex-col pt-24">
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
            {navItem("/admin/categories", "Categories")}
            {navItem("/admin/users", "Users")}
            {navItem("/admin/coupons", "Coupons")}
            {navItem("/admin/settings", "Settings")}
          </nav>

          <div className="px-4 py-4 border-t">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </aside>
      )}

      {/* ================= MAIN ================= */}
      <main className="flex-1 min-h-screen pt-24">
        <div className="px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
