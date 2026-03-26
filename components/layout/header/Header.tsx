"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/features/cart/CartContext";
import { useAuth } from "@/app/providers/AuthProvider";
import CategoryMenu from "./CategoryMenu";
import SearchBox from "@/components/ui/SearchBox";

/* ================= CONFIG ================= */

const MARKETPLACE_CATEGORIES = [
  { name: "All", slug: "all" },
  { name: "Fashion", slug: "fashion" },
  { name: "Medical", slug: "medical" },
  { name: "Electronics", slug: "electronics" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout, loading } = useAuth();
  const { state } = useCart();
  const searchParams = useSearchParams();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCategory = searchParams.get("category") || "all";

  const cartCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /* ================= SCROLL ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClick = (e: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-[#FAFAFA]"
      }`}
    >
      <div className="container mx-auto px-6">

        {/* ================= TOP BAR ================= */}
        <div
          className={`flex items-center justify-between ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          {/* LOGO */}
          <Link href="/" className="text-2xl font-extrabold">
            RK<span className="text-[#F5A623]">Fashion</span>
          </Link>

          {/* SEARCH */}
          <div className="hidden md:block w-112.5">
            <SearchBox />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">

            {/* ================= USER ================= */}
            {loading ? (
              <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-full bg-black text-white font-semibold"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50">

                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                    </div>

                    <Link href="/account" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      My Account
                    </Link>

                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Orders
                    </Link>

                    {/* 🔥 seller shortcut */}
                    {user.role === "seller" && (
                      <Link href="/seller" className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Seller Panel
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-sm font-medium">
                Login
              </Link>
            )}

            {/* ================= CART ================= */}
            <Link href="/cart" className="relative text-lg">
              🛍️
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>
        </div>

        {/* ================= CATEGORY NAV ================= */}
        <div
          className={`flex items-center gap-8 text-sm font-medium ${
            scrolled
              ? "opacity-0 h-0 overflow-hidden"
              : "opacity-100 pt-3 pb-2"
          }`}
        >
          {MARKETPLACE_CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.slug;

            return (
              <div key={cat.slug} className="relative group">
                <Link
                  href={`/?category=${cat.slug}`}
                  className={`transition ${
                    isActive
                      ? "text-black font-semibold"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {cat.name}
                </Link>

                {cat.slug === "fashion" && (
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50">
                    <div className="bg-white border rounded-xl shadow-lg p-4 min-w-55">
                      <CategoryMenu />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </header>
  );
}