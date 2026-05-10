// app/(admin)/admin/layout.tsx

"use client";

import {
  useRouter,
  usePathname,
} from "next/navigation";

import Link from "next/link";

import {
  useState,
  useEffect,
  useCallback,
} from "react";

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

  const router =
    useRouter();

  const pathname =
    usePathname();

  const [
    checkingAuth,
    setCheckingAuth,
  ] = useState(true);

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const isLoginPage =
    pathname ===
    "/admin/login";

  /* ================= AUTH ================= */

  const checkAdminAuth =
    useCallback(async () => {

      if (isLoginPage) {

        setCheckingAuth(
          false
        );

        return;
      }

      try {

        await apiFetch(
          "/admin/me"
        );

      } catch {

        router.replace(
          "/admin/login"
        );

        return;

      } finally {

        setCheckingAuth(
          false
        );

      }
    }, [
      isLoginPage,
      router,
    ]);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  /* ================= NAV ================= */

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    // USERS
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
    },

    {
      href: "/admin/stores",
      label: "Stores",
      icon: Store,
    },

    {
      href:
        "/admin/approve-store",
      label:
        "Approve Store",
      icon: ShieldCheck,
    },

    // PRODUCTS
    {
      href:
        "/admin/products",
      label: "Products",
      icon: Package,
    },

    {
      href:
        "/admin/orders",
      label: "Orders",
      icon: ShoppingCart,
    },

    // FINANCE
    {
      href:
        "/admin/withdraw",
      label:
        "Withdrawals",
      icon: Wallet,
    },

    // MARKETING
    {
      href:
        "/admin/coupons",
      label: "Coupons",
      icon: Ticket,
    },

    // ANALYTICS
    {
      href:
        "/admin/analytics",
      label:
        "Analytics",
      icon: BarChart3,
    },

    // LOGS
    {
      href: "/admin/logs",
      label: "Logs",
      icon:
        ClipboardList,
    },
  ];

  /* ================= ACTIVE ================= */

  const navItem = (
    item: any
  ) => {

    const active =
      pathname ===
        item.href ||
      pathname.startsWith(
        `${item.href}/`
      );

    const Icon =
      item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() =>
          setSidebarOpen(
            false
          )
        }
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
          active
            ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
        }`}
      >

        <Icon size={18} />

        {item.label}

      </Link>
    );
  };

  /* ================= LOGOUT ================= */

  const handleLogout =
    async () => {
      try {

        setLoggingOut(
          true
        );

        await apiFetch(
          "/admin/logout",
          {
            method: "POST",
          }
        );

        router.replace(
          "/admin/login"
        );

      } finally {

        setLoggingOut(
          false
        );

      }
    };

  /* ================= LOADING ================= */

  if (
    checkingAuth &&
    !isLoginPage
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black transition-colors duration-300">

        <p className="text-gray-500 dark:text-gray-400">
          Checking admin access...
        </p>

      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-black transition-colors duration-300">

      {/* MOBILE SIDEBAR */}
      {!isLoginPage &&
        sidebarOpen && (

          <div className="fixed inset-0 z-50 flex">

            {/* SIDEBAR */}
            <div className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-4 shadow-xl">

              <div className="flex justify-between items-center mb-6">

                <div>

                  <h2 className="font-bold text-lg text-black dark:text-white">
                    RK
                    <span className="text-[#F5A623]">
                      Admin
                    </span>
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Control Panel
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSidebarOpen(
                      false
                    )
                  }
                  className="text-black dark:text-white"
                >

                  <X
                    size={20}
                  />

                </button>

              </div>

              <nav className="space-y-2">
                {navItems.map(
                  navItem
                )}
              </nav>

            </div>

            {/* OVERLAY */}
            <div
              className="flex-1 bg-black/40 backdrop-blur-sm"
              onClick={() =>
                setSidebarOpen(
                  false
                )
              }
            />

          </div>

        )}

      {/* DESKTOP SIDEBAR */}
      {!isLoginPage && (

        <aside className="hidden md:flex w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex-col transition-colors duration-300">

          {/* LOGO */}
          <div className="px-6 py-6 border-b border-gray-200 dark:border-zinc-800">

            <h2 className="text-xl font-bold text-black dark:text-white">
              RK
              <span className="text-[#F5A623]">
                Admin
              </span>
            </h2>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Control Panel
            </p>

          </div>

          {/* NAV */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map(
              navItem
            )}
          </nav>

          {/* FOOTER */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-zinc-800">

            <button
              onClick={
                handleLogout
              }
              disabled={
                loggingOut
              }
              className="flex items-center justify-center gap-2 w-full text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-3 rounded-xl transition disabled:opacity-60"
            >

              <LogOut
                size={16}
              />

              {loggingOut
                ? "Logging out..."
                : "Logout"}

            </button>

          </div>

        </aside>

      )}

      {/* MAIN */}
      <main className="flex-1 flex flex-col">

        {/* HEADER */}
        {!isLoginPage && (

          <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-6 transition-colors duration-300">

            <button
              className="md:hidden text-black dark:text-white"
              onClick={() =>
                setSidebarOpen(
                  true
                )
              }
            >

              <Menu
                size={20}
              />

            </button>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Admin Panel
            </p>

            <div className="text-sm font-medium text-black dark:text-white">
              RK Fashion
            </div>

          </header>

        )}

        {/* CONTENT */}
        <div className="p-6 md:p-8 flex-1">

          <ToastProvider>

            {children}

          </ToastProvider>

        </div>

      </main>

    </div>
  );
}