"use client";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.startsWith("/admin/orders")) return "Orders";
    if (pathname.startsWith("/admin/products")) return "Products";
    if (pathname.startsWith("/admin/categories")) return "Categories";
    if (pathname.startsWith("/admin/users")) return "Users";
    if (pathname.startsWith("/admin/coupons")) return "Coupons";
    if (pathname.startsWith("/admin/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <h1 className="text-lg font-semibold">{getTitle()}</h1>

      <div className="text-sm text-gray-600">
        Admin Panel
      </div>
    </header>
  );
}
