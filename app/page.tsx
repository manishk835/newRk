import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { fetchProducts } from "@/lib/api";

export default async function HomePage() {
  const products = await fetchProducts();

  const featured = products.filter(p => p.isFeatured).slice(0, 8);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 8);
  // const bestSellers = products.filter(p => p.isbestSellers).slice(0, 8);

  return (
    <main className="bg-white">

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-24 bg-[#fafafa] ">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight mb-6">
              Everyday Fashion <br /> For Every Family
            </h1>

            <p className="text-gray-600 max-w-xl mb-10 text-base md:text-lg">
              Premium quality clothing for men, women & kids.  
              Honest pricing. Fast delivery. Cash on Delivery.
            </p>

            <div className="flex gap-4">
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
            <div className="h-105 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500">
              Hero Image
            </div>
          </div>

        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="border-y hover:shadow-md transition">
        <div className="container mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            "Cash on Delivery",
            "Premium Quality",
            "Fast Shipping",
            "Easy Returns",
          ].map(item => (
            <p
              key={item}
              className="text-sm font-semibold text-gray-700"
            >
              {item}
            </p>
          ))}
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Men", href: "/category/men" },
              { label: "Women", href: "/category/women" },
              { label: "Kids", href: "/category/kids" },
              { label: "Footwear", href: "/category/footwear" },
            ].map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                className="h-40 bg-[#f7f7f7] rounded-xl flex items-center justify-center text-lg font-semibold hover:bg-black hover:text-white transition"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      {featured.length > 0 && (
        <section className="py-24 bg-[#fafafa]">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">
                Featured Products
              </h2>

              <Link
                href="/products"
                className="text-sm font-semibold hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featured.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= NEW ARRIVALS ================= */}
      {newArrivals.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12">
              New Arrivals
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivals.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= BEST SELLERS ================= */}
      {/* <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12">
            Best Sellers
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section> */}

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
            className="px-12 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Explore Collection
          </Link>
        </div>
      </section>

    </main>
  );
}



// import Link from "next/link";
// import ProductCard from "@/components/product/ProductCard";
// import { fetchProducts } from "@/lib/api";

// export default async function HomePage() {
//   const products = await fetchProducts();

//   const featured = products.filter(p => p.isFeatured).slice(0, 8);
//   const newArrivals = products.filter(p => p.isNewArrival).slice(0, 8);
//   const bestSellers = products.slice(0, 8);

//   return (
//     <main className="pt-24 bg-white">

//       {/* ================= HERO ================= */}
//       <section className="bg-linear-to-r from-[#fafafa] to-[#f1f1f1]">
//         <div className="container mx-auto px-6 py-28 grid lg:grid-cols-2 gap-14 items-center">

//           <div>
//             <h1 className="text-4xl md:text-6xl font-extrabold text-[#111] leading-tight mb-6">
//               Everyday Fashion <br /> For Every Family
//             </h1>

//             <p className="text-gray-600 max-w-xl mb-10 text-lg">
//               Premium quality clothing for men, women & kids.  
//               Honest pricing • Fast delivery • COD available
//             </p>

//             <div className="flex flex-wrap gap-4">
//               <Link
//                 href="/category/men"
//                 className="px-10 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
//               >
//                 Shop Men
//               </Link>

//               <Link
//                 href="/category/women"
//                 className="px-10 py-4 bg-white border rounded-xl font-semibold hover:shadow-md transition"
//               >
//                 Shop Women
//               </Link>
//             </div>
//           </div>

//           <div className="hidden lg:block">
//             <div className="h-105 rounded-3xl bg-gray-200 flex items-center justify-center text-gray-500">
//               Hero Banner Image
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* ================= TRUST ================= */}
//       <section className="container mx-auto px-6 py-20">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

//           {[
//             { title: "Cash on Delivery", desc: "Pay after delivery" },
//             { title: "Premium Quality", desc: "Top fabric & comfort" },
//             { title: "Fast Shipping", desc: "Across India" },
//             { title: "Easy Returns", desc: "Hassle-free policy" },
//           ].map(item => (
//             <div
//               key={item.title}
//               className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition"
//             >
//               <h3 className="font-semibold mb-2">{item.title}</h3>
//               <p className="text-sm text-gray-600">{item.desc}</p>
//             </div>
//           ))}

//         </div>
//       </section>

//       {/* ================= CATEGORIES ================= */}
//       <section className="bg-[#fafafa]">
//         <div className="container mx-auto px-6 py-24">
//           <h2 className="text-3xl font-bold text-center mb-14 italic">
//             Shop by Category
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {[
//               { label: "Men", href: "/category/men" },
//               { label: "Women", href: "/category/women" },
//               { label: "Kids", href: "/category/kids" },
//               { label: "Footwear", href: "/category/footwear" },
//             ].map(cat => (
//               <Link
//                 key={cat.label}
//                 href={cat.href}
//                 className="h-44 bg-white rounded-2xl flex items-center justify-center text-xl font-semibold shadow-sm hover:shadow-lg transition"
//               >
//                 {cat.label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= FEATURED ================= */}
//       {featured.length > 0 && (
//         <section className="container mx-auto px-6 py-24">
//           <div className="flex justify-between items-center mb-10">
//             <h2 className="text-3xl font-bold italic">Featured Products</h2>
//             <Link href="/products" className="text-sm font-medium text-black hover:underline">
//               View All →
//             </Link>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {featured.map(product => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </div>
//         </section>
//       )}

//       {/* ================= NEW ARRIVALS ================= */}
//       {newArrivals.length > 0 && (
//         <section className="container mx-auto px-6 pb-24">
//           <h2 className="text-3xl font-bold mb-10 text-center italic">New Arrivals</h2>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {newArrivals.map(product => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </div>
//         </section>
//       )}

//       {/* ================= BEST SELLERS ================= */}
//       <section className="bg-[#fafafa]">
//         <div className="container mx-auto px-6 py-24">
//           <h2 className="text-3xl font-bold mb-12 text-center italic">
//             Best Sellers
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {bestSellers.map(product => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= NEWSLETTER ================= */}
//       <section className="container mx-auto px-6 py-24 text-center">
//         <h2 className="text-3xl font-bold mb-4">
//           Join Our Newsletter
//         </h2>
//         <p className="text-gray-600 mb-8">
//           Get updates on new arrivals & exclusive offers
//         </p>

//         <div className="max-w-md mx-auto flex gap-3">
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="flex-1 px-4 py-3 border rounded-xl outline-none"
//           />
//           <button className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition">
//             Subscribe
//           </button>
//         </div>
//       </section>

//       {/* ================= PROMO ================= */}
//       <section className="bg-black text-white">
//         <div className="container mx-auto px-6 py-24 text-center">
//           <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
//             Fashion that fits your lifestyle
//           </h2>
//           <p className="text-gray-300 mb-10">
//             Comfortable • Stylish • Affordable
//           </p>

//           <Link
//             href="/products"
//             className="inline-block px-12 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition"
//           >
//             Explore Collection
//           </Link>
//         </div>
//       </section>

//     </main>
//   );
// }