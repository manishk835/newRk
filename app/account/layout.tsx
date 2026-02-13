"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type User = {
  name: string;
  phone: string;
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

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
    router.refresh();
  };

  if (loading) {
    return (
      <div className="pt-32 text-center text-gray-500">
        Loading your account...
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="pt-24 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* ================= SIDEBAR ================= */}
        <aside className="bg-white rounded-2xl shadow-sm border p-6 h-fit lg:sticky lg:top-28">

          {/* USER INFO */}
          <div className="mb-8 border-b pb-6">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full font-semibold text-lg mb-3">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-gray-500">{user.phone}</p>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-2 text-sm">

            <Link
              href="/account"
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition ${isActive("/account") &&
                  !pathname.includes("/favorites") &&
                  !pathname.includes("/addresses")
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              📦 My Orders
            </Link>

            <Link
              href="/account/favorites"
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition ${isActive("/account/favorites")
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              ❤️ Wishlist
            </Link>

            <Link
              href="/account/addresses"
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition ${isActive("/account/addresses")
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              🏠 Saved Addresses
            </Link>

            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-3 mt-6 rounded-xl text-red-600 hover:bg-red-50 transition"
            >
              🚪 Sign Out
            </button>

          </nav>
        </aside>

        {/* ================= CONTENT ================= */}
        <section className="lg:col-span-3 space-y-6">

          {/* HEADER BAR */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold">
                My Account
              </h1>
              <p className="text-sm text-gray-500">
                Manage your orders, wishlist and addresses
              </p>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 min-h-100">
            {children}
          </div>

        </section>


      </div>
    </main>
  );
}
