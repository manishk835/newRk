// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { AuthProvider } from "@/app/providers/AuthProvider";
import { CartProvider } from "@/features/cart/CartContext";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://rkfashionhouse.com"),
  title: {
    default: "RK Fashion House | Everyday Fashion for Every Family",
    template: "%s | RK Fashion House",
  },
  description:
    "RK Fashion House offers premium quality clothing for men, women and kids.",
  openGraph: {
    title: "RK Fashion House",
    description:
      "Premium clothing for men, women and kids.",
    type: "website",
    locale: "en_IN",
  },
};

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
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />

        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

// // app/layout.tsx
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// import { AuthProvider } from "@/app/providers/AuthProvider";
// import { CartProvider } from "@/features/cart/CartContext";
// import Header from "@/components/layout/header/Header";
// import Footer from "@/components/layout/footer/Footer";
// import Script from "next/script";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
//   display: "swap",
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: {
//     default: "RK Fashion House | Everyday Fashion for Every Family",
//     template: "%s | RK Fashion House",
//   },
//   description:
//     "RK Fashion House offers premium quality clothing for men, women and kids.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-[#111111]`}
//       >
//         {/* Razorpay Script */}
//         <Script
//           src="https://checkout.razorpay.com/v1/checkout.js"
//           strategy="afterInteractive"
//         />

//         {/* 🔐 Auth must wrap everything */}
//         <AuthProvider>
//           <CartProvider>
//             <Header />
//             <main>{children}</main>
//             <Footer />
//           </CartProvider>
//         </AuthProvider>

//       </body>
//     </html>
//   );
// }
