"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/features/cart/CartContext";
import { useAuth } from "@/app/providers/AuthProvider";
import CategoryMenu from "./CategoryMenu";
import SearchBox from "@/components/ui/SearchBox";

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

  /* SCROLL */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* CLOSE DROPDOWN */
  useEffect(() => {
    const handleClick = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition ${
        scrolled ? "bg-white shadow-sm" : "bg-[#F8F8F8]"
      }`}
    >
      <div className="container mx-auto px-6">

        {/* TOP */}
        <div className={`flex items-center justify-between ${scrolled ? "h-14" : "h-16"}`}>

          {/* LOGO */}
          <Link href="/" className="text-2xl font-extrabold">
            RK<span className="text-[#F5A623]">Fashion</span>
          </Link>

          {/* SEARCH */}
          <div className="flex-1 mx-10 hidden md:block">
            <SearchBox />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6">

            {/* USER */}
            {loading ? (
              <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>

                {/* PROFILE */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden bg-gray-200"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F5A623] text-white flex items-center justify-center text-sm">
                      {user.name?.[0]}
                    </div>
                  )}
                </button>

                {/* DROPDOWN */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50">

                    {/* USER INFO */}
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                    </div>

                    {/* LINKS */}
                    <Link href="/account" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Dashboard
                    </Link>

                    <Link href="/account/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      My Profile
                    </Link>

                    <Link href="/account/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      My Orders
                    </Link>

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

            {/* CART */}
            <Link href="/cart" className="relative text-xl">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>
        </div>

        {/* CATEGORY BAR */}
        <div
          className={`flex justify-between gap-6 text-sm font-medium ${
            scrolled ? "hidden" : "pt-3 pb-2"
          }`}
        >

          {/* LEFT */}
          <div className="flex gap-10">
            {MARKETPLACE_CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat.slug;

              return (
                <div key={cat.slug} className="relative group">
                  <Link
                    href={`/?category=${cat.slug}`}
                    className={`pb-1 ${
                      isActive
                        ? "text-black font-semibold"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {cat.name}
                  </Link>

                  {isActive && (
                    <div className="h-0.5 bg-black mt-1 rounded" />
                  )}

                  {/* DROPDOWN */}
                  {cat.slug === "fashion" && (
                    <div className="absolute top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50">
                      <div className="bg-white border rounded-2xl shadow-xl p-5 min-w-65">
                        <CategoryMenu />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex gap-6 text-gray-600">
            <div className="hover:text-black cursor-pointer">📦 Track Order</div>
            <div className="hover:text-black cursor-pointer">💬 Support</div>
            <div className="hover:text-black cursor-pointer">⚙️ Offers</div>
          </div>

        </div>

      </div>
    </header>
  );
}