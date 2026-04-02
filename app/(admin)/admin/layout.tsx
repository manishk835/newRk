"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api/client";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Ticket,
  Wallet,
  BarChart3,
  Store,
  ShieldCheck,
  ClipboardList,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { ToastProvider } from "@/components/ui/ui-utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  /* ================= AUTH CHECK ================= */

  const checkAdminAuth = useCallback(async () => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    try {
      await apiFetch("/admin/me");
    } catch {
      router.replace("/admin/login");
      return;
    } finally {
      setCheckingAuth(false);
    }
  }, [isLoginPage, router]);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  /* ================= NAV ITEMS ================= */

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  
    // 👥 USERS & SELLERS
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/stores", label: "Stores", icon: Store },
    { href: "/admin/approve-store", label: "Approve Store", icon: ShieldCheck },
  
    // 📦 PRODUCTS & ORDERS
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  
    // 💰 FINANCE
    { href: "/admin/withdraw", label: "Withdrawals", icon: Wallet },
  
    // 🎟 MARKETING
    { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  
    // 📊 ANALYTICS
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  
    // 📋 LOGS / SYSTEM
    { href: "/admin/logs", label: "Logs", icon: ClipboardList },
  
    // 🔔 FUTURE (optional)
    // { href: "/admin/notifications", label: "Notifications", icon: Bell },
  ];

  const navItem = (item: any) => {
    const active =
      pathname === item.href || pathname.startsWith(`${item.href}/`);

    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active
            ? "bg-black text-white shadow"
            : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        <Icon size={18} />
        {item.label}
      </Link>
    );
  };

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await apiFetch("/admin/logout", { method: "POST" });
      router.replace("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  if (checkingAuth && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking admin access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* MOBILE SIDEBAR */}
      {!isLoginPage && sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white p-4 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">RK Admin</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map(navItem)}
            </nav>
          </div>

          <div
            className="flex-1 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* SIDEBAR DESKTOP */}
      {!isLoginPage && (
        <aside className="hidden md:flex w-64 bg-white border-r flex-col">
          <div className="px-6 py-6 border-b">
            <h2 className="text-xl font-bold">
              RK<span className="text-[#F5A623]">Admin</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Control Panel
            </p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map(navItem)}
          </nav>

          <div className="px-4 py-4 border-t">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center justify-center gap-2 w-full text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg"
            >
              <LogOut size={16} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </aside>
      )}

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        {!isLoginPage && (
          <header className="h-16 bg-white border-b flex items-center justify-between px-6">
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            <p className="text-sm text-gray-600">Admin Panel</p>

            <div className="text-sm font-medium">RK Fashion</div>
          </header>
        )}

        <div className="p-6 md:p-8 flex-1">
          <ToastProvider>

            {children}
          </ToastProvider>

        </div>
      </main>
    </div>
  );
}
