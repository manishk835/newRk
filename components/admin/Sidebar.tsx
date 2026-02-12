"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItem = (href: string, label: string) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`block px-4 py-2 rounded-lg text-sm font-medium transition
          ${
            active
              ? "bg-black text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
      >
        {label}
      </Link>
    );
  };

  return (
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
        {navItem("/admin/categories", "Categories")}
        {navItem("/admin/users", "Users")}
        {navItem("/admin/coupons", "Coupons")}
        {navItem("/admin/settings", "Settings")}
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
  );
}
