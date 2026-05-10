"use client";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useState } from "react";

import { apiFetch } from "@/lib/api/client";

import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  Wallet,
  LogOut,
} from "lucide-react";

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

  const pathname =
    usePathname();

  const router =
    useRouter();

  const [loggingOut, setLoggingOut] =
    useState(false);

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    try {

      setLoggingOut(true);

      await apiFetch(
        "/auth/logout",
        {
          method: "POST",
        }
      );

      router.replace("/login");

    } finally {

      setLoggingOut(false);

    }
  };

  /* ================= ACTIVE LOGIC ================= */

  const isActive = (
    href: string
  ) => {

    // Dashboard
    if (href === "/seller") {
      return pathname === "/seller";
    }

    // Add Product
    if (
      href ===
      "/seller/products/create"
    ) {
      return (
        pathname ===
        "/seller/products/create"
      );
    }

    // Products list + edit
    if (href === "/seller/products") {
      return (
        pathname.startsWith(
          "/seller/products"
        ) &&
        pathname !==
          "/seller/products/create"
      );
    }

    // Orders / wallet
    return pathname.startsWith(
      href
    );
  };

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 min-h-screen flex flex-col transition-colors duration-300">

      {/* LOGO */}
      <div className="px-6 py-6 border-b border-gray-200 dark:border-zinc-800 text-xl font-bold text-black dark:text-white">

        RK
        <span className="text-[#F5A623]">
          Fashion
        </span>

      </div>

      {/* NAV */}
      <nav className="p-4 space-y-2 flex-1">

        {navItems.map((item) => {

          const active =
            isActive(item.href);

          const Icon =
            item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >

              <Icon size={18} />

              {item.label}

            </Link>
          );
        })}

      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-200 dark:border-zinc-800">

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 text-red-600 dark:text-red-400 w-full px-3 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition disabled:opacity-60"
        >

          <LogOut size={16} />

          {loggingOut
            ? "Logging out..."
            : "Logout"}

        </button>

      </div>

    </aside>
  );
}