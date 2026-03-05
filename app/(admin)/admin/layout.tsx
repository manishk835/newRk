// // app/(admin)/admin/layout.tsx

"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  /* ================= AUTH CHECK ================= */

  const checkAdminAuth = useCallback(async () => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    try {
      await apiFetch("/admin/me");
    } catch {
      router.replace("/admin/login");
      return;
    } finally {
      setCheckingAuth(false);
    }
  }, [isLoginPage, router]);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  /* ================= NAV ITEM ================= */

  const navItem = (href: string, label: string) => {
    const active =
      pathname === href || pathname.startsWith(`${href}/`);

    return (
      <Link
        href={href}
        className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${active
            ? "bg-black text-white"
            : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        {label}
      </Link>
    );
  };

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await apiFetch("/admin/logout", { method: "POST" });
      router.replace("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  if (checkingAuth && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking admin access...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      {!isLoginPage && (
        <aside className="w-64 bg-white border-r flex flex-col">
          <div className="px-6 py-6 border-b">
            <h2 className="text-xl font-bold">
              RK<span className="text-[#F5A623]">Admin</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Admin Dashboard
            </p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItem("/admin", "Dashboard")}
            {navItem("/admin/products", "Products")}
            {navItem("/admin/orders", "Orders")}
            {navItem("/admin/coupons", "Coupons")}
            {navItem("/admin/withdrawals", "Withdrawals")}
          </nav>

          <div className="px-4 py-4 border-t">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </aside>
      )}

      {/* MAIN */}
      <main className="flex-1">
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
// // app/(admin)/admin/layout.tsx
// "use client";

// import { useRouter, usePathname } from "next/navigation";
// import Link from "next/link";
// import { useState, useEffect, useCallback } from "react";
// import { apiFetch } from "@/lib/api/client";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [checkingAuth, setCheckingAuth] = useState(true);
//   const [loggingOut, setLoggingOut] = useState(false);

//   const isLoginPage = pathname === "/admin/login";

//   /* ================= AUTH CHECK ================= */

//   const checkAdminAuth = useCallback(async () => {
//     if (isLoginPage) {
//       setCheckingAuth(false);
//       return;
//     }

//     try {
//       await apiFetch("/admin/me");
//     } catch {
//       router.replace("/admin/login");
//       return;
//     } finally {
//       setCheckingAuth(false);
//     }
//   }, [isLoginPage, router]);

//   useEffect(() => {
//     checkAdminAuth();
//   }, [checkAdminAuth]);

//   /* ================= NAV ITEM ================= */

//   const navItem = (href: string, label: string) => {
//     const active =
//       pathname === href || pathname.startsWith(`${href}/`);

//     return (
//       <Link
//         href={href}
//         className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
//           active
//             ? "bg-black text-white"
//             : "text-gray-700 hover:bg-gray-100"
//         }`}
//       >
//         {label}
//       </Link>
//     );
//   };

//   /* ================= LOGOUT ================= */

//   const handleLogout = async () => {
//     try {
//       setLoggingOut(true);
//       await apiFetch("/admin/logout", { method: "POST" });
//       router.replace("/admin/login");
//     } catch (err) {
//       console.error("Logout failed:", err);
//     } finally {
//       setLoggingOut(false);
//     }
//   };

//   /* ================= LOADING ================= */

//   if (checkingAuth && !isLoginPage) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Checking admin access...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* ================= SIDEBAR ================= */}
//       {!isLoginPage && (
//         <aside className="w-64 bg-white border-r hidden lg:flex flex-col pt-24">
//           <div className="px-6 py-5 border-b">
//             <h2 className="text-xl font-bold">
//               RK<span className="text-[#F5A623]">Admin</span>
//             </h2>
//             <p className="text-xs text-gray-500 mt-1">
//               Admin Dashboard
//             </p>
//           </div>

//           <nav className="flex-1 px-4 py-6 space-y-2">
//             {navItem("/admin", "Dashboard")}
//             {navItem("/admin/coupons", "Coupons")}
//           </nav>

//           <div className="px-4 py-4 border-t">
//             <button
//               onClick={handleLogout}
//               disabled={loggingOut}
//               className="w-full text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg"
//             >
//               {loggingOut ? "Logging out..." : "Logout"}
//             </button>
//           </div>
//         </aside>
//       )}

//       {/* ================= MAIN ================= */}
//       <main className="flex-1 min-h-screen pt-24">
//         <div className="px-6 py-6">{children}</div>
//       </main>
//     </div>
//   );
// }

