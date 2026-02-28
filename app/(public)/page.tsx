// app/(public)/page.tsx

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { fetchProducts } from "@/lib/api";
import WishlistButton from "@/components/ui/WishlistButton";
import type { Product } from "@/components/ui/product/product.types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "RK Fashion House | Premium Everyday Fashion",
  description:
    "Discover premium fashion for men, women and kids. Trusted marketplace with fast delivery & secure checkout.",
  openGraph: {
    title: "RK Fashion House",
    description:
      "Premium clothing marketplace for modern families.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function HomePage() {
  let products: Product[] = [];

  try {
    products = await fetchProducts();
  } catch (error) {
    console.error("Homepage fetch failed:", error);
  }

  const featured = products.filter(p => p?.isFeatured).slice(0, 8);
  const newArrivals = products.filter(p => p?.isNewArrival).slice(0, 8);
  const bestSellers = products.filter(p => p?.isBestSeller).slice(0, 8);

  return (
    <div className="bg-white">

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-24 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Style That Moves <br /> With You
            </h1>

            <p className="text-gray-600 max-w-xl mb-10 text-lg">
              A trusted fashion marketplace connecting families
              with quality clothing brands. Fast shipping. Secure checkout.
            </p>

            <div className="flex gap-5 flex-wrap">
              <Link
                href="/products"
                className="px-10 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
              >
                Shop Collection
              </Link>

              <Link
                href="/new-arrivals"
                className="px-10 py-4 border border-black rounded-xl font-semibold hover:bg-black hover:text-white transition"
              >
                New Arrivals
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative h-105 rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/hero-fashion.jpg"
                alt="Fashion Marketplace"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </section>

      <TrustSection />

      <ProductSection
        title="Featured Picks"
        products={featured}
        viewAll="/featured"
        bg="bg-gray-50"
      />

      <ProductSection
        title="New This Week"
        products={newArrivals}
        viewAll="/new-arrivals"
      />

      <ProductSection
        title="Top Selling Now"
        products={bestSellers}
        viewAll="/best-sellers"
        bg="bg-gray-50"
      />

      <VendorCTA />

      <FinalCTA />

    </div>
  );
}

/* ========================================================= */

function TrustSection() {
  const items = [
    { title: "Secure Payments", icon: "🔒" },
    { title: "Verified Sellers", icon: "✔️" },
    { title: "Fast Delivery", icon: "🚚" },
    { title: "Easy Returns", icon: "↩️" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-3">{item.icon}</div>
            <p className="font-semibold text-gray-800">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ========================================================= */

function ProductSection({
  title,
  products,
  viewAll,
  bg,
}: {
  title: string;
  products: Product[];
  viewAll: string;
  bg?: string;
}) {
  if (!products?.length) return null;

  return (
    <section className={`py-24 ${bg || ""}`}>
      <div className="container mx-auto px-6">

        <div className="flex justify-between items-center mb-14">
          <h2 className="text-3xl font-bold">{title}</h2>
          <Link
            href={viewAll}
            className="text-sm font-semibold hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => {
            const imageUrl =
              product.thumbnail ||
              product.images?.[0]?.url ||
              "/placeholder.png";

            const hasDiscount =
              product.comparePrice &&
              product.comparePrice > product.price;

            return (
              <div key={product._id} className="relative group">

                {hasDiscount && (
                  <div className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full z-10">
                    Sale
                  </div>
                )}

                <div className="absolute top-3 right-3 z-10">
                  <WishlistButton productId={product._id} />
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  className="block bg-white rounded-2xl border p-4 hover:shadow-lg transition overflow-hidden"
                >
                  <div className="relative h-52 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <h3 className="mt-4 font-medium line-clamp-2">
                    {product.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <p className="font-semibold text-lg">
                      ₹{product.price}
                    </p>

                    {hasDiscount && (
                      <span className="text-sm line-through text-gray-400">
                        ₹{product.comparePrice}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* ========================================================= */

function VendorCTA() {
  return (
    <section className="py-28 bg-gray-100">
      <div className="container mx-auto px-6 text-center max-w-3xl">
        <h2 className="text-4xl font-bold mb-6">
          Start Selling With RK Fashion House
        </h2>
        <p className="text-gray-600 mb-10 text-lg">
          Launch your fashion brand online. Manage products,
          track orders and grow your business with our marketplace tools.
        </p>

        <Link
          href="/for-vendors"
          className="inline-block px-12 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          Become a Seller
        </Link>
      </div>
    </section>
  );
}

/* ========================================================= */

function FinalCTA() {
  return (
    <section className="py-28 bg-black text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Discover Fashion Without Limits
        </h2>

        <p className="text-gray-300 mb-10">
          Modern. Comfortable. Affordable.
        </p>

        <Link
          href="/products"
          className="inline-block px-12 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
}





// // app/(public)/page.tsx

// import Link from "next/link";
// import type { Metadata } from "next";
// import { fetchProducts } from "@/lib/api";
// import WishlistButton from "@/components/ui/WishlistButton";
// import type { Product } from "@/components/ui/product/product.types";

// export const revalidate = 60; // ISR - 1 minute

// export const metadata: Metadata = {
//   title: "RK Fashion House | Everyday Fashion for Every Family",
//   description:
//     "Premium quality clothing for men, women and kids. Fast delivery. Cash on Delivery available.",
//   openGraph: {
//     title: "RK Fashion House",
//     description:
//       "Premium clothing for men, women and kids.",
//     type: "website",
//   },
// };

// export default async function HomePage() {
//   let products: Product[] = [];

//   try {
//     products = await fetchProducts();
//   } catch (error) {
//     console.error("Homepage fetch failed:", error);
//   }

//   const featured = products.filter(p => p?.isFeatured).slice(0, 8);
//   const newArrivals = products.filter(p => p?.isNewArrival).slice(0, 8);
//   const bestSellers = products.filter(p => p?.isBestSeller).slice(0, 8);

//   return (
//     <div className="bg-white">

//       {/* ================= HERO ================= */}
//       <section className="pt-28 md:pt-36 pb-20 bg-linear-to-b from-gray-50 to-white">
//         <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

//           <div>
//             <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
//               Everyday Fashion <br /> For Every Family
//             </h1>

//             <p className="text-gray-600 max-w-xl mb-10 text-base md:text-lg">
//               Premium quality clothing for men, women & kids.
//               Honest pricing. Fast delivery. Cash on Delivery.
//             </p>

//             <div className="flex flex-wrap gap-4">
//               <Link
//                 href="/products"
//                 className="px-10 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
//               >
//                 Shop Now
//               </Link>

//               <Link
//                 href="/deals"
//                 className="px-10 py-4 border border-black rounded-lg font-semibold hover:bg-black hover:text-white transition"
//               >
//                 View Deals
//               </Link>
//             </div>
//           </div>

//           <div className="hidden lg:block">
//             <div className="h-96 rounded-3xl bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
//               Hero Banner
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* ================= TRUST BADGES ================= */}
//       <TrustSection />

//       {/* ================= FEATURED ================= */}
//       <ProductSection
//         title="Featured Products"
//         products={featured}
//         viewAll="/featured"
//         bg="bg-gray-50"
//       />

//       {/* ================= NEW ARRIVALS ================= */}
//       <ProductSection
//         title="New Arrivals"
//         products={newArrivals}
//         viewAll="/new-arrivals"
//       />

//       {/* ================= BEST SELLERS ================= */}
//       <ProductSection
//         title="Best Sellers"
//         products={bestSellers}
//         viewAll="/best-sellers"
//         bg="bg-gray-50"
//       />

//       {/* ================= VENDOR DISCOVERY ================= */}
//       <VendorCTA />

//       {/* ================= FINAL CTA ================= */}
//       <FinalCTA />

//     </div>
//   );
// }

// /* ========================================================= */

// function TrustSection() {
//   const items = [
//     { title: "Cash on Delivery", icon: "💰" },
//     { title: "Premium Quality", icon: "⭐" },
//     { title: "Fast Shipping", icon: "🚚" },
//     { title: "Easy Returns", icon: "↩️" },
//   ];

//   return (
//     <section className="py-14 bg-gray-50">
//       <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
//         {items.map((item) => (
//           <div
//             key={item.title}
//             className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
//           >
//             <div className="text-2xl mb-2">{item.icon}</div>
//             <p className="text-sm font-semibold text-gray-800">
//               {item.title}
//             </p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// /* ========================================================= */

// function ProductSection({
//   title,
//   products,
//   viewAll,
//   bg,
// }: {
//   title: string;
//   products: Product[];
//   viewAll: string;
//   bg?: string;
// }) {
//   if (!products?.length) return null;

//   return (
//     <section className={`py-20 ${bg || ""}`}>
//       <div className="container mx-auto px-6">

//         <div className="flex justify-between items-center mb-12">
//           <h2 className="text-3xl font-bold">{title}</h2>
//           <Link
//             href={viewAll}
//             className="text-sm font-semibold hover:underline"
//           >
//             View All
//           </Link>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {products.map((product) => {
//             const imageUrl =
//               product.thumbnail ||
//               product.images?.[0]?.url ||
//               "/placeholder.png";

//             return (
//               <div key={product._id} className="relative group">

//                 <div className="absolute top-3 right-3 z-10">
//                   <WishlistButton productId={product._id} />
//                 </div>

//                 <Link
//                   href={`/product/${product.slug}`}
//                   className="block bg-white rounded-xl border p-4 hover:shadow-md transition overflow-hidden"
//                 >
//                   <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
//                     <img
//                       src={imageUrl}
//                       alt={product.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
//                     />
//                   </div>

//                   <h3 className="mt-3 font-medium line-clamp-2">
//                     {product.title}
//                   </h3>

//                   <p className="font-semibold mt-1">
//                     ₹{product.price}
//                   </p>
//                 </Link>
//               </div>
//             );
//           })}
//         </div>

//       </div>
//     </section>
//   );
// }

// /* ========================================================= */

// function VendorCTA() {
//   return (
//     <section className="py-24 bg-gray-100">
//       <div className="container mx-auto px-6 text-center">
//         <h2 className="text-3xl font-bold mb-4">
//           Sell on RK Fashion House
//         </h2>
//         <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
//           Join our marketplace and grow your clothing business online.
//           Manage products, orders and customers in one dashboard.
//         </p>

//         <Link
//           href="/for-vendors"
//           className="inline-block px-10 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
//         >
//           Become a Vendor
//         </Link>
//       </div>
//     </section>
//   );
// }

// /* ========================================================= */

// function FinalCTA() {
//   return (
//     <section className="py-28 bg-black text-white">
//       <div className="container mx-auto px-6 text-center">
//         <h2 className="text-3xl md:text-4xl font-bold mb-6">
//           Fashion that fits your lifestyle
//         </h2>

//         <p className="text-gray-300 mb-10">
//           Comfortable. Stylish. Affordable.
//         </p>

//         <Link
//           href="/products"
//           className="inline-block px-12 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
//         >
//           Explore Collection
//         </Link>
//       </div>
//     </section>
//   );
// }

// // app/(public)/page.tsx

// import Link from "next/link";
// import { Metadata } from "next";
// import ProductCard from "@/components/ui/product/ProductCard";
// import { fetchProducts } from "@/lib/api";
// import type { Product } from "@/components/ui/product/product.types";
// import WishlistButton from "@/components/ui/WishlistButton";

// export const metadata: Metadata = {
//   title: "RK Fashion House | Everyday Fashion for Every Family",
//   description:
//     "Premium quality clothing for men, women and kids. Fast delivery. Cash on Delivery available.",
// };

// export default async function HomePage() {

//   let products: Product[] = [];  // ✅ FIXED TYPE

//   try {
//     products = await fetchProducts();
//   } catch (err) {
//     console.error("Homepage product fetch failed:", err);
//   }

//   const featured = products
//     .filter((p) => p?.isFeatured === true)
//     .slice(0, 8);

//   const newArrivals = products
//     .filter((p) => p?.isNewArrival === true)
//     .slice(0, 8);

//   const bestSellers = products
//     .filter((p) => p?.isBestSeller === true)
//     .slice(0, 8);

//   return (
//     <main className="bg-white">

//       {/* ================= HERO ================= */}
//       <section className="pt-28 md:pt-36 pb-20 bg-linear-to-b from-gray-50 to-white">
//         <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

//           <div>
//             <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
//               Everyday Fashion <br /> For Every Family
//             </h1>

//             <p className="text-gray-600 max-w-xl mb-10 text-base md:text-lg">
//               Premium quality clothing for men, women & kids.
//               Honest pricing. Fast delivery. Cash on Delivery.
//             </p>

//             <div className="flex flex-wrap gap-4">
//               <Link
//                 href="/category/men"
//                 className="px-10 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
//               >
//                 Shop Men
//               </Link>

//               <Link
//                 href="/category/women"
//                 className="px-10 py-4 border border-black rounded-lg font-semibold hover:bg-black hover:text-white transition"
//               >
//                 Shop Women
//               </Link>
//             </div>
//           </div>

//           <div className="hidden lg:block">
//             <div className="h-96 rounded-3xl bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
//               Hero Image
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* ================= TRUST BADGES ================= */}
//       <section className="py-14 bg-gray-50">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

//             {[
//               { title: "Cash on Delivery", icon: "💰" },
//               { title: "Premium Quality", icon: "⭐" },
//               { title: "Fast Shipping", icon: "🚚" },
//               { title: "Easy Returns", icon: "↩️" },
//             ].map((item) => (
//               <div
//                 key={item.title}
//                 className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
//               >
//                 <div className="text-2xl mb-2">{item.icon}</div>
//                 <p className="text-sm font-semibold text-gray-800">
//                   {item.title}
//                 </p>
//               </div>
//             ))}

//           </div>
//         </div>
//       </section>

//       {/* ================= FEATURED ================= */}
//       {featured?.length > 0 && (
//         <ProductSection
//           title="Featured Products"
//           products={featured}
//           bg="bg-gray-50"
//         />
//       )}

//       {/* ================= NEW ARRIVALS ================= */}
//       {newArrivals?.length > 0 && (
//         <ProductSection
//           title="New Arrivals"
//           products={newArrivals}
//         />
//       )}

//       {/* ================= BEST SELLERS ================= */}
//       {bestSellers?.length > 0 && (
//         <ProductSection
//           title="Best Sellers"
//           products={bestSellers}
//           bg="bg-gray-50"
//         />
//       )}

//       {/* ================= CTA ================= */}
//       <section className="py-28 bg-black text-white">
//         <div className="container mx-auto px-6 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold mb-6">
//             Fashion that fits your lifestyle
//           </h2>

//           <p className="text-gray-300 mb-10">
//             Comfortable. Stylish. Affordable.
//           </p>

//           <Link
//             href="/products"
//             className="inline-block px-12 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
//           >
//             Explore Collection
//           </Link>
//         </div>
//       </section>

//     </main>
//   );
// }

// /* ======================================================
//    REUSABLE PRODUCT SECTION (Scalable)
// ====================================================== */

// function ProductSection({
//   title,
//   products,
//   bg,
// }: {
//   title: string;
//   products: any[];
//   bg?: string;
// }) {
//   return (
//     <section className={`py-20 ${bg || ""}`}>
//       <div className="container mx-auto px-6">
//         <div className="flex justify-between items-center mb-12">
//           <h2 className="text-3xl font-bold">{title}</h2>

//           <Link
//             href="/products"
//             className="text-sm font-semibold hover:underline"
//           >
//             View All
//           </Link>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {products.map((product) => {
//             const imageUrl =
//               product.thumbnail ||
//               product.images?.[0]?.url ||
//               product.image ||
//               "/placeholder.png";

//             return (
//               <div key={product._id} className="relative group">

//                 {/* Wishlist */}
//                 <div className="absolute top-3 right-3 z-10">
//                   <WishlistButton productId={product._id} />
//                 </div>

//                 {/* CLICKABLE CARD */}
//                 <Link
//                   href={`/product/${product.slug}`}
//                   className="block bg-white rounded-xl border p-4 
//                      hover:shadow-md transition overflow-hidden"
//                 >
//                   {/* IMAGE */}
//                   <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
//                     <img
//                       src={imageUrl}
//                       alt={product.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
//                     />
//                   </div>

//                   {/* INFO */}
//                   <h2 className="mt-3 font-medium line-clamp-2">
//                     {product.title}
//                   </h2>

//                   <p className="font-semibold mt-1">
//                     ₹{product.price}
//                   </p>
//                 </Link>
//               </div>
//             );
//           })}
//         </div>

//       </div>
//     </section>
//   );
// }
