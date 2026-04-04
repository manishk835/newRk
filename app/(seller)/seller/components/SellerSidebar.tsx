"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  Wallet,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    href: "/seller",
    icon: LayoutDashboard,
  },
  {
    label: "Add Product",
    href: "/seller/products/create",
    icon: PlusCircle,
  },
  {
    label: "Products",
    href: "/seller/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/seller/orders",
    icon: ShoppingCart,
  },
  {
    label: "Wallet",
    href: "/seller/wallet",
    icon: Wallet,
  },
];

export default function SellerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await apiFetch("/auth/logout", { method: "POST" });
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  /* 🔥 SMART ACTIVE LOGIC */
  const isActive = (href: string) => {
    // Dashboard
    if (href === "/seller") {
      return pathname === "/seller";
    }

    // Add Product
    if (href === "/seller/products/create") {
      return pathname === "/seller/products/create";
    }

    // Products list + edit
    if (href === "/seller/products") {
      return (
        pathname.startsWith("/seller/products") &&
        pathname !== "/seller/products/create"
      );
    }

    // default (orders, wallet etc.)
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      
      {/* LOGO */}
      <div className="px-6 py-6 border-b text-xl font-bold">
        RK<span className="text-[#F5A623]">Fashion</span>
      </div>

      {/* NAV */}
      <nav className="p-4 space-y-2 flex-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                active
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 w-full px-3 py-2 rounded-lg hover:bg-red-50"
        >
          <LogOut size={16} />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}