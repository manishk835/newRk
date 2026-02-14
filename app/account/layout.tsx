"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type User = {
  name: string;
  phone: string;
};

const navItems = [
  { href: "/account", label: "Dashboard", icon: "🏠" },
  { href: "/account/orders", label: "My Orders", icon: "📦" },
  { href: "/account/favorites", label: "Wishlist", icon: "❤️" },
  { href: "/account/addresses", label: "Saved Addresses", icon: "📍" },
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [orderCount, setOrderCount] = useState<number>(0);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const isActive = (href: string) =>
    href === "/account"
      ? pathname === "/account"
      : pathname.startsWith(href);

  const currentTitle = useMemo(() => {
    const found = navItems.find((item) => isActive(item.href));
    return found?.label || "My Account";
  }, [pathname]);

  /* ================= LOAD USER ================= */
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

        const orderRes = await fetch(
          `${BASE_URL}/api/orders/my`,
          { credentials: "include" }
        );
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

  /* ================= CLOSE SIDEBAR ON ROUTE CHANGE ================= */
  useEffect(() => {
    setSidebarOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  /* ================= LOCK SCROLL WHEN SIDEBAR OPEN ================= */
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [sidebarOpen]);

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
      <div className="min-h-screen bg-gray-50 p-10 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-40 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

      {/* ================= TOP BAR ================= */}
      <div className="bg-white dark:bg-gray-800 border-b px-6 py-4 flex justify-between items-center">

        {/* Mobile Menu */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-xl"
        >
          ☰
        </button>

        <h1 className="font-semibold text-lg dark:text-white">
          {currentTitle}
        </h1>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
          >
            {user.name.charAt(0).toUpperCase()}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 shadow-xl border rounded-2xl p-4 text-sm z-50">
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-500 text-xs mb-4">
                {user.phone}
              </p>

              <Link
                href="/account/security"
                className="block py-2 hover:text-black dark:hover:text-white"
              >
                Account Security
              </Link>

              <button
                onClick={logout}
                className="block w-full text-left text-red-600 mt-3"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* ================= SIDEBAR ================= */}
        <aside
          className={`fixed lg:static z-50 top-0 left-0 h-full lg:h-auto w-72 lg:w-auto bg-white dark:bg-gray-800 rounded-none lg:rounded-3xl shadow-lg lg:shadow-sm border p-6 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <nav className="space-y-2 mt-16 lg:mt-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex justify-between items-center px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-black text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span>
                  {item.icon} {item.label}
                </span>

                {item.href === "/account/orders" && (
                  <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                    {orderCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* ================= MAIN ================= */}
        <section className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border p-8 min-h-125 transition-colors">
            {children}
          </div>
        </section>

      </div>
    </main>
  );
}


// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Link from "next/link";

// type User = {
//   name: string;
//   phone: string;
// };

// const navItems = [
//   { href: "/account", label: "Dashboard", icon: "🏠" },
//   { href: "/account/orders", label: "My Orders", icon: "📦" },
//   { href: "/account/favorites", label: "Wishlist", icon: "❤️" },
//   { href: "/account/addresses", label: "Saved Addresses", icon: "📍" },
// ];

// export default function AccountLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [orderCount, setOrderCount] = useState<number>(0);

//   const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//   const isActive = (href: string) =>
//     href === "/account"
//       ? pathname === "/account"
//       : pathname.startsWith(href);

//   const currentTitle = useMemo(() => {
//     const found = navItems.find((item) => isActive(item.href));
//     return found?.label || "My Account";
//   }, [pathname]);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/api/auth/me`, {
//           credentials: "include",
//         });

//         if (!res.ok) {
//           router.replace("/login?redirect=/account");
//           return;
//         }

//         const data = await res.json();
//         setUser(data);

//         const orderRes = await fetch(
//           `${BASE_URL}/api/orders/my`,
//           { credentials: "include" }
//         );
//         const orderData = await orderRes.json();
//         setOrderCount(orderData.length);
//       } catch {
//         router.replace("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, [router, BASE_URL]);

//   const logout = async () => {
//     await fetch(`${BASE_URL}/api/auth/logout`, {
//       method: "POST",
//       credentials: "include",
//     });

//     router.push("/");
//     router.refresh();
//   };

//   /* ================= SKELETON ================= */
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-10 space-y-6 animate-pulse">
//         <div className="h-8 bg-gray-200 rounded w-1/4" />
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="h-40 bg-gray-200 rounded-2xl" />
//           <div className="h-40 bg-gray-200 rounded-2xl" />
//           <div className="h-40 bg-gray-200 rounded-2xl" />
//         </div>
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <main className="pt-20 min-h-screen bg-gray-50">

//       {/* ================= TOP BAR ================= */}
//       <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">

//         {/* Mobile Menu */}
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="lg:hidden text-xl"
//         >
//           ☰
//         </button>

//         <h1 className="font-semibold text-lg">
//           {currentTitle}
//         </h1>

//         {/* Profile Dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => setProfileOpen(!profileOpen)}
//             className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
//           >
//             {user.name.charAt(0).toUpperCase()}
//           </button>

//           {profileOpen && (
//             <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg border rounded-xl p-3 text-sm">
//               <p className="font-medium">{user.name}</p>
//               <p className="text-gray-500 text-xs mb-3">
//                 {user.phone}
//               </p>

//               <Link
//                 href="/account/security"
//                 className="block py-1 hover:underline"
//               >
//                 Account Security
//               </Link>

//               <button
//                 onClick={logout}
//                 className="block w-full text-left text-red-600 mt-2"
//               >
//                 Sign Out
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">

//         {/* ================= SIDEBAR ================= */}
//         <aside
//           className={`bg-white rounded-3xl shadow-sm border p-6 h-fit transition-all
//           ${sidebarOpen ? "block" : "hidden lg:block"}`}
//         >
//           <nav className="space-y-2">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`flex justify-between items-center px-4 py-3 rounded-xl text-sm font-medium ${
//                   isActive(item.href)
//                     ? "bg-black text-white"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <span>
//                   {item.icon} {item.label}
//                 </span>

//                 {item.href === "/account/orders" && (
//                   <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
//                     {orderCount}
//                   </span>
//                 )}
//               </Link>
//             ))}
//           </nav>
//         </aside>

//         {/* ================= MAIN ================= */}
//         <section className="lg:col-span-3">
//           <div className="bg-white rounded-3xl shadow-sm border p-8 min-h-100">
//             {children}
//           </div>
//         </section>

//       </div>
//     </main>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Link from "next/link";

// type User = {
//   name: string;
//   phone: string;
// };

// const navItems = [
//   { href: "/account", label: "Dashboard", icon: "🏠" },
//   { href: "/account/orders", label: "My Orders", icon: "📦" },
//   { href: "/account/favorites", label: "Wishlist", icon: "❤️" },
//   { href: "/account/addresses", label: "Saved Addresses", icon: "🏠" },
// ];

// export default function AccountLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//   const isActive = (href: string) => {
//     if (href === "/account") {
//       return pathname === "/account";
//     }
//     return pathname.startsWith(href);
//   };

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/api/auth/me`, {
//           credentials: "include",
//         });

//         if (!res.ok) {
//           router.replace("/login?redirect=/account");
//           return;
//         }

//         const data = await res.json();
//         setUser(data);
//       } catch {
//         router.replace("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, [router, BASE_URL]);

//   const logout = async () => {
//     await fetch(`${BASE_URL}/api/auth/logout`, {
//       method: "POST",
//       credentials: "include",
//     });

//     router.push("/");
//     router.refresh();
//   };

//   if (loading) {
//     return (
//       <div className="pt-32 text-center text-gray-500">
//         Loading your account...
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <main className="pt-24 min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">

//         {/* ================= SIDEBAR ================= */}
//         <aside className="bg-white rounded-3xl shadow-md border p-8 h-fit lg:sticky lg:top-28">

//           {/* USER CARD */}
//           <div className="mb-10">
//             <div className="w-14 h-14 bg-black text-white flex items-center justify-center rounded-full font-semibold text-xl mb-4">
//               {user.name.charAt(0).toUpperCase()}
//             </div>

//             <p className="text-xs text-gray-500">Signed in as</p>
//             <p className="font-semibold text-lg">{user.name}</p>
//             <p className="text-sm text-gray-500">{user.phone}</p>
//           </div>

//           {/* NAVIGATION */}
//           <nav className="space-y-2">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
//                   isActive(item.href)
//                     ? "bg-black text-white shadow-sm"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <span>{item.icon}</span>
//                 {item.label}
//               </Link>
//             ))}

//             <button
//               onClick={logout}
//               className="w-full flex items-center gap-3 px-4 py-3 mt-8 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
//             >
//               🚪 Sign Out
//             </button>
//           </nav>
//         </aside>

//         {/* ================= CONTENT ================= */}
//         <section className="lg:col-span-3 space-y-8">

//           {/* HEADER BAR */}
//           <div className="bg-white rounded-3xl shadow-sm border p-8">
//             <h1 className="text-2xl font-semibold">
//               {pathname === "/account" && "Dashboard"}
//               {pathname.startsWith("/account/orders") && "My Orders"}
//               {pathname.startsWith("/account/favorites") && "Wishlist"}
//               {pathname.startsWith("/account/addresses") && "Saved Addresses"}
//             </h1>

//             <p className="text-sm text-gray-500 mt-2">
//               Manage your personal account settings and activity.
//             </p>
//           </div>

//           {/* MAIN CONTENT */}
//           <div className="bg-white rounded-3xl shadow-sm border p-8 min-h-100">
//             {children}
//           </div>

//         </section>
//       </div>
//     </main>
//   );
// }