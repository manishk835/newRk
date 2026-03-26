// app/(user)/account/layout.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type User = {
  name: string;
  phone: string;
};

type NavItem = {
  href: string;
  label: string;
  icon: string;
  badge?: boolean;
};

/* ================= NAV STRUCTURE (PRO LEVEL) ================= */

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { href: "/account", label: "Dashboard", icon: "🏠" },
      { href: "/account/orders", label: "My Orders", icon: "📦", badge: true },
      { href: "/account/returns", label: "Returns & Refunds", icon: "↩️" },
    ],
  },
  {
    title: "Shopping",
    items: [
      { href: "/account/favorites", label: "Wishlist", icon: "❤️" },
      { href: "/account/address", label: "Saved Addresses", icon: "📍" },
      { href: "/account/coupons", label: "Coupons & Offers", icon: "🏷️" },
    ],
  },
  {
    title: "Payments",
    items: [
      { href: "/account/wallet", label: "Wallet", icon: "💰" },
      { href: "/account/payments", label: "Payment Methods", icon: "💳" },
      { href: "/account/transactions", label: "Transactions", icon: "📜" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/account/security", label: "Login & Security", icon: "🔐" },
      { href: "/account/notifications", label: "Notifications", icon: "🔔" },
      { href: "/account/support", label: "Help & Support", icon: "📞" },
    ],
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState<number>(0);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const isActive = (href: string) =>
    href === "/account"
      ? pathname === "/account"
      : pathname.startsWith(href);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          router.replace("/login?redirect=/account");
          return;
        }

        const data = await res.json();
        setUser(data);

        const orderRes = await fetch(`${BASE_URL}/api/orders/my`, {
          credentials: "include",
        });

        const orderData = await orderRes.json();
        setOrderCount(orderData.length);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router, BASE_URL]);

  const logout = async () => {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-10 animate-pulse">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="pt-16 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ================= SIDEBAR ================= */}
        <aside className="bg-white rounded-2xl shadow-sm p-5 flex flex-col justify-between sticky top-20 h-fit">

          <div>

            {/* USER */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {user.name?.[0]}
              </div>

              <div>
                <h2 className="font-semibold text-sm">{user.name}</h2>
                <p className="text-xs text-gray-500">{user.phone}</p>
              </div>
            </div>

            {/* NAV SECTIONS */}
            <div className="space-y-6">

              {navSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase">
                    {section.title}
                  </h3>

                  <nav className="space-y-1 text-sm">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg transition ${
                          isActive(item.href)
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon} {item.label}
                        </span>

                        {item.badge && (
                          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                            {orderCount}
                          </span>
                        )}
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}

            </div>

            {/* SELLER CTA */}
            <div className="mt-6 p-3 rounded-xl bg-linear-to-r from-black to-gray-800 text-white text-sm">
              <p className="font-semibold">🔥 Become a Seller</p>
              <p className="text-xs opacity-80">
                Start selling on RK Fashion
              </p>
            </div>

          </div>

          {/* BOTTOM */}
          <div className="space-y-2 mt-6">

            <button
              onClick={() => router.push("/account/security")}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-sm text-gray-700 hover:bg-gray-200"
            >
              🔐 Account Security
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 text-red-600 text-sm hover:bg-red-50"
            >
              🚪 Sign Out
            </button>

          </div>

        </aside>

        {/* ================= MAIN ================= */}
        <section className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm p-6 min-h-125">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">

              <div>
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {user.name}! 👋
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                  🔔
                </div>

                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                  {user.name?.[0]}
                </div>
              </div>

            </div>

            {children}

          </div>
        </section>

      </div>
    </main>
  );
}