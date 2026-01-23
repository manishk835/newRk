"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavItem from "./NavItem";
import { NAV_ITEMS } from "./navData";
import { useCart } from "@/app/context/cart/CartContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { state } = useCart();

  const cartCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-white transition-shadow ${
        scrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 h-[72] flex items-center justify-between gap-6">
        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold tracking-wide text-gray-800">
          RkFashion
        </Link>

        {/* NAV */}
        <nav className="hidden lg:flex items-center gap-8 text-gray-700 font-medium">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.slug} item={item} />
          ))}
          <Link href="/sale" className="text-yellow-500 font-semibold">
            Sale
          </Link>
        </nav>

        {/* SEARCH + CART */}
        <div className="flex items-center gap-4">
          {/* SEARCH */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-yellow-400"
          >
            <input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none text-sm w-44 lg:w-56 bg-transparent"
            />
            <button type="submit">🔍</button>
          </form>

          {/* CART */}
          <Link href="/cart" className="relative text-xl">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
