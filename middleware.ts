import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ================= ADMIN TOKEN =================

  const adminToken =
    req.cookies.get("admin_token")?.value;

  // ================= PROTECT ADMIN ROUTES =================

  if (pathname.startsWith("/admin")) {

    // Allow admin login page
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Admin token required
    if (!adminToken) {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }
  }

  return NextResponse.next();
}

/* ================= MATCHER ================= */

export const config = {
  matcher: ["/admin/:path*"],
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   const token = req.cookies.get("token")?.value;

//   // ================= PROTECT ADMIN ROUTES =================
//   if (pathname.startsWith("/admin")) {
//     // Allow login page without token
//     if (pathname === "/admin/login") {
//       return NextResponse.next();
//     }

//     if (!token) {
//       return NextResponse.redirect(
//         new URL("/admin/login", req.url)
//       );
//     }
//   }

//   return NextResponse.next();
// }

// /* ================= MATCHER ================= */
// export const config = {
//   matcher: ["/admin/:path*"],
// };
