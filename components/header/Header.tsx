// components/header/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cart/CartContext";
import CategoryMenu from "./CategoryMenu";


type User = {
  name: string;
  phone: string;
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const { state } = useCart();

  const cartCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /* ================= SCROLL ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const stored = localStorage.getItem("rk_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  /* ================= SEARCH ================= */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("rk_user");
    document.cookie = "rk_user=; Max-Age=0; path=/";
    window.location.href = "/";
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all ${
        scrolled ? "bg-white border-b" : "bg-[#FAFAFA]"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* BRAND */}
        <Link href="/" className="text-2xl font-extrabold">
          RK<span className="text-[#F5A623]">Fashion</span>
        </Link>

        {/* NAV */}
        <nav className="hidden lg:flex items-center gap-10 text-sm font-medium">
          <div className="flex gap-6">
            <CategoryMenu />
          </div>

          <Link
            href="/sale"
            className="px-3 py-1.5 rounded bg-[#D32F2F] text-white text-xs font-semibold"
          >
            SALE
          </Link>
        </nav>


        {/* ACTIONS */}
        <div className="flex items-center gap-5">
          {/* SEARCH */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 bg-white rounded-full px-4 py-2"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search kurta, shoes..."
              className="outline-none text-sm w-52"
            />
            🔍
          </form>

          {/* USER */}
          {user ? (
            <div className="relative group">
              <button className="w-9 h-9 rounded-full bg-gray-200 font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </button>

              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.phone}</p>
                </div>

                <Link
                  href="/account"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  My Account
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-medium">
              Login
            </Link>
          )}

          {/* CART */}
          <Link href="/cart" className="relative">
            🛍️
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          
        </div>
      </div>
    </header>
  );
}