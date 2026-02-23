"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col pt-24">
        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-bold">
            Seller Panel
          </h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItem("/seller", "Dashboard")}
          {navItem("/seller/products", "My Products")}
          {navItem("/seller/orders", "My Orders")}
        </nav>
      </aside>

      <main className="flex-1 pt-24 px-6">
        {children}
      </main>
    </div>
  );
}