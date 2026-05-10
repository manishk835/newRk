"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import useSellerAuth from "../hooks/useSellerAuth";

export default function SellerHeader() {

  const { user } = useSellerAuth();

  return (
    <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-6 transition-colors duration-300">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        <Menu
          size={20}
          className="lg:hidden cursor-pointer text-black dark:text-white"
        />

        <span className="text-sm text-gray-600 dark:text-gray-400">
          Seller Panel
        </span>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <Link
          href="/seller/products/create"
          className="text-sm bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          + Add Product
        </Link>

        <div className="flex items-center gap-2">

          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-700">

            {user?.profileImage ? (

              <img
                src={user.profileImage}
                alt={user.name}
                className="w-full h-full object-cover"
              />

            ) : (

              <div className="w-full h-full flex items-center justify-center bg-black dark:bg-white text-white dark:text-black text-sm font-semibold">
                {user?.name?.[0] || "S"}
              </div>

            )}

          </div>

          <div className="hidden sm:block">

            <p className="text-sm font-medium text-black dark:text-white">
              👋 {user?.name || "Seller"}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Welcome back
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}