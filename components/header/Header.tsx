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
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all ${
        scrolled
          ? "bg-white border-b"
          : "bg-[#FAFAFA]"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-6">
        
        {/* BRAND */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wide text-[#111111]"
        >
          RK<span className="text-[#F5A623]">Fashion</span>
        </Link>

        {/* NAV */}
        <nav className="hidden lg:flex items-center gap-10 text-[15px] font-medium text-gray-700">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.slug} item={item} />
          ))}

          <Link
            href="/sale"
            className="px-3 py-1.5 rounded-md bg-[#D32F2F] text-white text-sm font-semibold hover:bg-red-700 transition"
          >
            SALE
          </Link>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-5">
          
          {/* SEARCH */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 bg-white  rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-[#F5A623]"
          >
            <input
              type="text"
              placeholder="Search kurta, shoes, saree..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none text-sm w-52 bg-transparent"
            />
            <button
              type="submit"
              className="text-gray-600 hover:text-black"
            >
              🔍
            </button>
          </form>

          {/* CART */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition"
          >
            <span className="text-xl">🛍️</span>

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D32F2F] text-white text-[11px] px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import NavItem from "./NavItem";
// import { NAV_ITEMS } from "./navData";
// import { useCart } from "@/app/context/cart/CartContext";

// export default function Header() {
//   const [scrolled, setScrolled] = useState(false);
//   const [query, setQuery] = useState("");
//   const router = useRouter();

//   const { state } = useCart();

//   const cartCount = state.items.reduce(
//     (sum, item) => sum + item.quantity,
//     0
//   );

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query.trim()) return;
//     router.push(`/search?q=${encodeURIComponent(query)}`);
//   };

//   return (
//     <header
//       className={`fixed top-0 w-full z-50 bg-white transition-shadow ${
//         scrolled ? "shadow-lg" : "shadow-sm"
//       }`}
//     >
//       <div className="container mx-auto px-4 h-[72] flex items-center justify-between gap-6">
//         {/* LOGO */}
//         <Link href="/" className="text-2xl font-bold tracking-wide text-gray-800">
//           RkFashion
//         </Link>

//         {/* NAV */}
//         <nav className="hidden lg:flex items-center gap-8 text-gray-700 font-medium">
//           {NAV_ITEMS.map((item) => (
//             <NavItem key={item.slug} item={item} />
//           ))}
//           <Link href="/sale" className="text-yellow-500 font-semibold">
//             Sale
//           </Link>
//         </nav>

//         {/* SEARCH + CART */}
//         <div className="flex items-center gap-4">
//           {/* SEARCH */}
//           <form
//             onSubmit={handleSearch}
//             className="hidden md:flex items-center rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-yellow-400"
//           >
//             <input
//               type="text"
//               placeholder="Search for products..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               className="outline-none text-sm w-44 lg:w-56 bg-transparent"
//             />
//             <button type="submit">🔍</button>
//           </form>

//           {/* CART */}
//           <Link href="/cart" className="relative text-xl">
//             🛒
//             {cartCount > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
//                 {cartCount}
//               </span>
//             )}
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }
