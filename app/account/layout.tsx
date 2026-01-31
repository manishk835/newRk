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

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  useEffect(() => {
    const stored = localStorage.getItem("rk_user");
    const phone = localStorage.getItem("userPhone");

    if (!stored || !phone) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(stored);
    setUser({ name: parsed.name, phone });
  }, [router]);

  const logout = () => {
    localStorage.removeItem("rk_user");
    localStorage.removeItem("userPhone");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <main className="pt-24 bg-[#FAFAFA] min-h-screen">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">

        {/* SIDEBAR */}
        <aside className="bg-white border rounded-2xl p-6 h-fit">
          <p className="text-sm text-gray-500 mb-1">Welcome,</p>
          <p className="text-lg font-semibold mb-6">{user.name}</p>

          <nav className="space-y-2 text-sm">
            <Link
              href="/account"
              className={`block px-4 py-2 rounded-lg ${
                isActive("/account")
                  ? "bg-[#FAFAFA] font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              📦 Orders
            </Link>

            <Link
              href="/account/favorites"
              className={`block px-4 py-2 rounded-lg ${
                isActive("/account/favorites")
                  ? "bg-[#FAFAFA] font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              ❤️ Favorites
            </Link>

            <Link
              href="/account/addresses"
              className={`block px-4 py-2 rounded-lg ${
                isActive("/account/addresses")
                  ? "bg-[#FAFAFA] font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              🏠 Addresses
            </Link>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg mt-4"
            >
              🚪 Sign Out
            </button>
          </nav>
        </aside>

        {/* CONTENT */}
        <section className="lg:col-span-3">
          {children}
        </section>
      </div>
    </main>
  );
}
