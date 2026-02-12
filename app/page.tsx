// app/page.tsx

import Link from "next/link";
import { Metadata } from "next";
import ProductCard from "@/components/product/ProductCard";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/components/product/product.types";

export const metadata: Metadata = {
  title: "RK Fashion House | Everyday Fashion for Every Family",
  description:
    "Premium quality clothing for men, women and kids. Fast delivery. Cash on Delivery available.",
};

export default async function HomePage() {

  let products: Product[] = [];  // ✅ FIXED TYPE

  try {
    products = await fetchProducts();
  } catch (err) {
    console.error("Homepage product fetch failed:", err);
  }

  const featured = products
    .filter((p) => p?.isFeatured === true)
    .slice(0, 8);

  const newArrivals = products
    .filter((p) => p?.isNewArrival === true)
    .slice(0, 8);

  const bestSellers = products
    .filter((p) => p?.isBestSeller === true)
    .slice(0, 8);

  return (
    <main className="bg-white">

      {/* ================= HERO ================= */}
      <section className="pt-28 md:pt-36 pb-20 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Everyday Fashion <br /> For Every Family
            </h1>

            <p className="text-gray-600 max-w-xl mb-10 text-base md:text-lg">
              Premium quality clothing for men, women & kids.
              Honest pricing. Fast delivery. Cash on Delivery.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/category/men"
                className="px-10 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Shop Men
              </Link>

              <Link
                href="/category/women"
                className="px-10 py-4 border border-black rounded-lg font-semibold hover:bg-black hover:text-white transition"
              >
                Shop Women
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="h-96 rounded-3xl bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
              Hero Image
            </div>
          </div>

        </div>
      </section>

      {/* ================= TRUST BADGES ================= */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {[
              { title: "Cash on Delivery", icon: "💰" },
              { title: "Premium Quality", icon: "⭐" },
              { title: "Fast Shipping", icon: "🚚" },
              { title: "Easy Returns", icon: "↩️" },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-sm font-semibold text-gray-800">
                  {item.title}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      {featured?.length > 0 && (
        <ProductSection
          title="Featured Products"
          products={featured}
          bg="bg-gray-50"
        />
      )}

      {/* ================= NEW ARRIVALS ================= */}
      {newArrivals?.length > 0 && (
        <ProductSection
          title="New Arrivals"
          products={newArrivals}
        />
      )}

      {/* ================= BEST SELLERS ================= */}
      {bestSellers?.length > 0 && (
        <ProductSection
          title="Best Sellers"
          products={bestSellers}
          bg="bg-gray-50"
        />
      )}

      {/* ================= CTA ================= */}
      <section className="py-28 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Fashion that fits your lifestyle
          </h2>

          <p className="text-gray-300 mb-10">
            Comfortable. Stylish. Affordable.
          </p>

          <Link
            href="/products"
            className="inline-block px-12 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Explore Collection
          </Link>
        </div>
      </section>

    </main>
  );
}

/* ======================================================
   REUSABLE PRODUCT SECTION (Scalable)
====================================================== */

function ProductSection({
  title,
  products,
  bg,
}: {
  title: string;
  products: any[];
  bg?: string;
}) {
  return (
    <section className={`py-20 ${bg || ""}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">{title}</h2>

          <Link
            href="/products"
            className="text-sm font-semibold hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


// // app/page.tsx
// import Link from "next/link";
// import ProductCard from "@/components/product/ProductCard";
// import { fetchProducts } from "@/lib/api";

// export default async function HomePage() {
//   const products = await fetchProducts();

//   const featured = products.filter(p => p.isFeatured).slice(0, 8);
//   const newArrivals = products.filter(p => p.isNewArrival).slice(0, 8);
//   const bestSellers = products.filter(p => p.isbestSellers).slice(0, 8);

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
//             <div className="h-105 rounded-3xl bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
//               Hero Image
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* ================= TRUST ================= */}
//       <section className="py-14 bg-gray-50">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

//             {[
//               { title: "Cash on Delivery", icon: "💰" },
//               { title: "Premium Quality", icon: "⭐" },
//               { title: "Fast Shipping", icon: "🚚" },
//               { title: "Easy Returns", icon: "↩️" },
//             ].map(item => (
//               <div
//                 key={item.title}
//                 className="
//                   bg-white rounded-xl
//                   p-4 text-center
//                   shadow-sm
//                   hover:shadow-md transition
//                 "
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


// {/* ================= CATEGORIES ================= */}
// <section className="py-20 bg-white">
//   <div className="container mx-auto px-6">

//     <h2 className="text-3xl font-bold mb-10">
//       Shop by Category
//     </h2>

//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">

//       {[
//         {
//           label: "Men",
//           href: "/category/men",
//           icon: "👔",
//           bg: "bg-blue-50",
//           border: "border-blue-200",
//           text: "text-blue-700",
//         },
//         {
//           label: "Women",
//           href: "/category/women",
//           icon: "👗",
//           bg: "bg-pink-50",
//           border: "border-pink-200",
//           text: "text-pink-700",
//         },
//         {
//           label: "Kids",
//           href: "/category/kids",
//           icon: "🧸",
//           bg: "bg-yellow-50",
//           border: "border-yellow-200",
//           text: "text-yellow-700",
//         },
//         {
//           label: "Footwear",
//           href: "/category/footwear",
//           icon: "👟",
//           bg: "bg-green-50",
//           border: "border-green-200",
//           text: "text-green-700",
//         },
//       ].map(cat => (
//         <Link
//           key={cat.label}
//           href={cat.href}
//           className={`
//             group
//             rounded-2xl
//             border ${cat.border}
//             ${cat.bg}
//             p-6
//             flex flex-col items-center justify-center
//             text-center
//             transition
//             hover:scale-105 hover:shadow-lg
//             active:scale-95
//           `}
//         >
//           <div className="text-3xl mb-3 transition-transform group-hover:scale-110">
//             {cat.icon}
//           </div>

//           <p className={`text-base font-semibold ${cat.text}`}>
//             {cat.label}
//           </p>
//         </Link>
//       ))}

//     </div>
//   </div>
// </section>




//       {/* ================= FEATURED ================= */}
//       {featured.length > 0 && (
//         <section className="py-20 bg-gray-50">
//           <div className="container mx-auto px-6">
//             <div className="flex justify-between items-center mb-12">
//               <h2 className="text-3xl font-bold">Featured Products</h2>
//               <Link href="/products" className="text-sm font-semibold hover:underline">
//                 View All
//               </Link>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//               {featured.map(product => (
//                 <ProductCard key={product._id} product={product} />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ================= NEW ARRIVALS ================= */}
//       {newArrivals.length > 0 && (
//         <section className="py-20">
//           <div className="container mx-auto px-6">
//             <div className="flex justify-between items-center mb-12">
//               <h2 className="text-3xl font-bold">New Arrivals</h2>
//               <Link href="/products" className="text-sm font-semibold hover:underline">
//                 View All
//               </Link>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//               {newArrivals.map(product => (
//                 <ProductCard key={product._id} product={product} />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ================= BEST SELLERS ================= */}
//       {bestSellers.length > 0 && (
//         <section className="py-20 bg-gray-50">
//           <div className="container mx-auto px-6">
//             <h2 className="text-3xl font-bold mb-12">Best Sellers</h2>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//               {bestSellers.map(product => (
//                 <ProductCard key={product._id} product={product} />
//               ))}
//             </div>
//           </div>
//         </section>
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