"use client";

import { ReactNode } from "react";
import SellerSidebar from "./components/SellerSidebar";
import SellerHeader from "./components/SellerHeader";
import useSellerAuth from "./hooks/useSellerAuth";

export default function SellerLayout({ children }: { children: ReactNode }) {
  const { checkingAuth } = useSellerAuth();

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Checking seller access...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />

      <div className="flex-1">
        <SellerHeader />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// // // app/(seller)/seller/layout.tsx

// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState, useCallback } from "react";
// import { apiFetch } from "@/lib/api/client";
// import {
//   LayoutDashboard,
//   Package,
//   PlusCircle,
//   ShoppingCart,
//   Wallet,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";

// type User = {
//   role: string;
//   sellerStatus?: string;
//   name?: string;
// };

// export default function SellerLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [checkingAuth, setCheckingAuth] = useState(true);
//   const [loggingOut, setLoggingOut] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [user, setUser] = useState<User | null>(null);

//   const isLoginPage = pathname === "/login";

//   /* ================= AUTH ================= */

//   const checkSellerAuth = useCallback(async () => {
//     if (isLoginPage) {
//       setCheckingAuth(false);
//       return;
//     }

//     try {
//       const res = await apiFetch("/auth/me");
//       const u: User = res.user || res.admin || res;

//       if (!u) {
//         router.replace("/login");
//         return;
//       }

//       if (u.sellerStatus !== "approved") {
//         router.replace("/for-vendors");
//         return;
//       }

//       setUser(u);
//     } catch (err) {
//       router.replace("/login");
//     } finally {
//       setCheckingAuth(false);
//     }
//   }, [isLoginPage, router]);

//   useEffect(() => {
//     checkSellerAuth();
//   }, [checkSellerAuth]);

//   /* ================= NAV ================= */

//   const navItems = [
//     {
//       label: "Dashboard",
//       href: "/seller",
//       icon: LayoutDashboard,
//     },
//     {
//       label: "Add Product",
//       href: "/seller/products/create",
//       icon: PlusCircle,
//     },
//     {
//       label: "Products",
//       href: "/seller/products",
//       icon: Package,
//     },
//     {
//       label: "Orders",
//       href: "/seller/orders",
//       icon: ShoppingCart,
//     },
//     {
//       label: "Wallet",
//       href: "/seller/wallet",
//       icon: Wallet,
//     },
//   ];

//   const NavLink = ({
//     href,
//     label,
//     icon: Icon,
//   }: any) => {
//     const active =
//       pathname === href || pathname.startsWith(href + "/");

//     return (
//       <Link
//         href={href}
//         className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
//           active
//             ? "bg-black text-white"
//             : "text-gray-600 hover:bg-gray-100"
//         }`}
//       >
//         <Icon size={18} />
//         {label}
//       </Link>
//     );
//   };

//   /* ================= LOGOUT ================= */

//   const handleLogout = async () => {
//     try {
//       setLoggingOut(true);
//       await apiFetch("/auth/logout", { method: "POST" });
//       router.replace("/login");
//     } finally {
//       setLoggingOut(false);
//     }
//   };

//   /* ================= LOADING ================= */

//   if (checkingAuth && !isLoginPage) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
//         Checking seller access...
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">

//       {/* MOBILE OVERLAY */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* SIDEBAR */}
//       {!isLoginPage && (
//         <aside
//           className={`fixed z-50 lg:static top-0 left-0 h-full w-64 bg-white border-r transform transition ${
//             sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//           }`}
//         >
//           <div className="px-6 py-6 border-b flex justify-between items-center">
//             <h2 className="text-xl font-bold">
//               RK<span className="text-[#F5A623]">Fashion</span>
//             </h2>

//             <button
//               className="lg:hidden"
//               onClick={() => setSidebarOpen(false)}
//             >
//               <X size={20} />
//             </button>
//           </div>

//           <nav className="p-4 space-y-2">
//             {navItems.map((item) => (
//               <NavLink key={item.href} {...item} />
//             ))}
//           </nav>

//           <div className="mt-auto p-4 border-t">
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 text-red-600 w-full px-3 py-2 rounded-lg hover:bg-red-50"
//             >
//               <LogOut size={16} />
//               {loggingOut ? "Logging out..." : "Logout"}
//             </button>
//           </div>
//         </aside>
//       )}

//       {/* MAIN */}
//       <main className="flex-1">

//         {/* HEADER */}
//         {!isLoginPage && (
//           <div className="bg-white border-b px-6 py-4 flex justify-between items-center">

//             <div className="flex items-center gap-3">
//               <button
//                 className="lg:hidden"
//                 onClick={() => setSidebarOpen(true)}
//               >
//                 <Menu size={20} />
//               </button>

//               <span className="text-sm text-gray-600">
//                 Seller Panel
//               </span>
//             </div>

//             <div className="text-sm text-gray-700">
//               👋 {user?.name || "Seller"}
//             </div>
//           </div>
//         )}

//         {/* CONTENT */}
//         <div className="p-6">{children}</div>

//       </main>
//     </div>
//   );
// }