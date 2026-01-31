import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/app/context/cart/CartContext";
import Header from "@/components/header/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* ================= METADATA ================= */

export const metadata: Metadata = {
  title: {
    default: "RK Fashion House | Everyday Fashion for Every Family",
    template: "%s | RK Fashion House",
  },
  description:
    "RK Fashion House offers premium quality clothing for men, women and kids. Honest pricing, fast delivery and cash on delivery available across India.",
  keywords: [
    "RK Fashion House",
    "online clothing store",
    "men fashion",
    "women fashion",
    "kids clothing",
    "buy clothes online India",
  ],
  authors: [{ name: "RK Fashion House" }],
  creator: "RK Fashion House",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "RK Fashion House",
    description:
      "Premium quality fashion for men, women and kids. Shop online with cash on delivery.",
    type: "website",
    locale: "en_IN",
    siteName: "RK Fashion House",
  },
};

/* ================= ROOT LAYOUT ================= */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-[#111111]`}
      >
        {/* GLOBAL PROVIDERS */}
        <CartProvider>
          {/* HEADER */}
          <Header />

          {/* MAIN CONTENT */}
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
