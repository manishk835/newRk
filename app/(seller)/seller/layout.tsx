"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api/client";

type User = {
  role: string;
  sellerStatus?: string;
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const isLoginPage = pathname === "/seller/login";

  /* ================= AUTH CHECK ================= */

  const checkSellerAuth = useCallback(async () => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    try {
      const user: User = await apiFetch("/auth/me");

      if (user.role !== "seller") {
        router.replace("/");
        return;
      }

      if (user.sellerStatus !== "approved") {
        router.replace("/for-vendors");
        return;
      }
    } catch {
      router.replace("/seller/login");
      return;
    } finally {
      setCheckingAuth(false);
    }
  }, [isLoginPage, router]);

  useEffect(() => {
    checkSellerAuth();
  }, [checkSellerAuth]);

  /* ================= NAV ITEM ================= */

  const navItem = (href: string, label: string) => {
    const active =
      pathname === href || pathname.startsWith(href + "/");

    return (
      <Link
        href={href}
        className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
          active
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

      await apiFetch("/auth/logout", {
        method: "POST",
      });

      router.replace("/seller/login");
    } finally {
      setLoggingOut(false);
    }
  };

  /* ================= LOADING ================= */

  if (checkingAuth && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Checking seller access...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}

      {!isLoginPage && (
        <aside className="w-64 bg-white border-r flex flex-col">

          <div className="px-6 py-6 border-b">

            <h2 className="text-xl font-bold">
              RK<span className="text-[#F5A623]">Fashion</span>
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Seller Panel
            </p>

          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">

            {navItem("/seller", "Dashboard")}
            {navItem("/seller/products/create", "Add Product")}
            {navItem("/seller/products", "Manage Products")}
            {navItem("/seller/orders", "Orders")}
            {navItem("/seller/wallet", "Wallet")}

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

      {/* MAIN AREA */}

      <main className="flex-1">

        {!isLoginPage && (
          <div className="bg-white border-b px-8 py-4 flex justify-end">
            <span className="text-sm text-gray-600">
              Seller Dashboard 👋
            </span>
          </div>
        )}

        <div className="p-8">{children}</div>

      </main>

    </div>
  );
}

// // app/(seller)/seller/layout.tsx
// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState, useCallback } from "react";
// import { apiFetch } from "@/lib/api/client";

// export default function SellerLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [checkingAuth, setCheckingAuth] = useState(true);
//   const [loggingOut, setLoggingOut] = useState(false);

//   const isLoginPage = pathname === "/seller/login";

//   /* ================= AUTH CHECK ================= */

//   const checkSellerAuth = useCallback(async () => {
//     if (isLoginPage) {
//       setCheckingAuth(false);
//       return;
//     }

//     try {
//       await apiFetch("/auth/me");
//     } catch {
//       router.replace("/seller/login");
//       return;
//     } finally {
//       setCheckingAuth(false);
//     }
//   }, [isLoginPage, router]);

//   useEffect(() => {
//     checkSellerAuth();
//   }, [checkSellerAuth]);

//   /* ================= NAV ITEM ================= */

//   const navItem = (href: string, label: string) => {
//     const active =
//       pathname === href || pathname.startsWith(href + "/");

//     return (
//       <Link
//         href={href}
//         className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${active
//             ? "bg-black text-white"
//             : "text-gray-600 hover:bg-gray-100"
//           }`}
//       >
//         {label}
//       </Link>
//     );
//   };

//   /* ================= LOGOUT ================= */

//   const handleLogout = async () => {
//     try {
//       setLoggingOut(true);
//       await apiFetch("/auth/logout", { method: "POST" });
//       router.replace("/seller/login");
//     } finally {
//       setLoggingOut(false);
//     }
//   };

//   /* ================= LOADING ================= */

//   if (checkingAuth && !isLoginPage) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Checking seller access...
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* SIDEBAR */}
//       {!isLoginPage && (
//         <aside className="w-64 bg-white border-r flex flex-col">
//           <div className="px-6 py-6 border-b">
//             <h2 className="text-xl font-bold">
//               RK<span className="text-[#F5A623]">Fashion</span>
//             </h2>

//             <p className="text-xs text-gray-500 mt-1">
//               Seller Panel
//             </p>
//           </div>

//           <nav className="flex-1 px-4 py-6 space-y-2">
//             {navItem("/seller", "Dashboard")}
//             {navItem("/seller/products/create", "Add Product")}
//             {navItem("/seller/products", "Manage Products")}
//             {navItem("/seller/orders", "Orders")}
//             {navItem("/seller/wallet", "Wallet")}
//           </nav>

//           {/* LOGOUT */}
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

//       {/* MAIN AREA */}
//       <main className="flex-1">
//         {!isLoginPage && (
//           <div className="bg-white border-b px-8 py-4 flex justify-end">
//             <span className="text-sm text-gray-600">
//               Seller Dashboard 👋
//             </span>
//           </div>
//         )}

//         <div className="p-8">{children}</div>
//       </main>
//     </div>
//   );
// }