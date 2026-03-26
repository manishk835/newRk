// app/(public)/page.tsx

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { fetchProducts } from "@/lib/api";
import WishlistButton from "@/components/ui/WishlistButton";
import type { Product } from "@/components/ui/product/product.types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "RK Marketplace | Multi Category Shopping",
  description:
    "Shop fashion, medical, electronics and more from verified sellers.",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {

  const params = await searchParams;

  const rawCategory = params?.category;

  const category =
    typeof rawCategory === "string"
      ? rawCategory.toLowerCase()
      : Array.isArray(rawCategory)
      ? rawCategory[0].toLowerCase()
      : "all";

  /* ================= DATA ================= */

  let featured: Product[] = [];
  let newArrivals: Product[] = [];
  let bestSellers: Product[] = [];
  let categoryProducts: Product[] = [];

  try {
    if (category === "all") {
      [featured, newArrivals, bestSellers] = await Promise.all([
        fetchProducts({ filter: "featured", limit: 8 }),
        fetchProducts({ filter: "new", limit: 8 }),
        fetchProducts({ filter: "best", limit: 8 }),
      ]);
    } else {
      categoryProducts = await fetchProducts({
        category,
        limit: 12,
      });
    }
  } catch (error) {
    console.error("Homepage fetch failed:", error);
  }

  /* ================= UI ================= */

  return (
    <div className="bg-white">

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-24 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              {category === "all"
                ? "Discover Everything in One Place"
                : `${category.toUpperCase()} Marketplace`}
            </h1>

            <p className="text-gray-600 mb-10 text-lg max-w-xl">
              Shop from verified sellers across multiple categories with fast delivery and secure checkout.
            </p>

            <Link
              href={`/products${category !== "all" ? `?category=${category}` : ""}`}
              className="px-10 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Explore Products
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="relative h-105 rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/hero-fashion.jpg"
                alt="Marketplace"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </section>

      <TrustSection />

      {/* ================= PRODUCTS ================= */}

      {category === "all" ? (
        <>
          <ProductSection title="Featured Picks" products={featured} />
          <ProductSection title="New This Week" products={newArrivals} />
          <ProductSection title="Top Selling Now" products={bestSellers} />
          <CategoryShowcase />
        </>
      ) : (
        <CategorySection category={category} products={categoryProducts} />
      )}

      <VendorCTA />
      <FinalCTA />

    </div>
  );
}

/* ================= CATEGORY SECTION ================= */

function CategorySection({
  category,
  products,
}: {
  category: string;
  products: Product[];
}) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            {category.toUpperCase()} Products
          </h2>

          <Link
            href="/"
            className="text-sm font-medium hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        {!products.length ? (
          <p className="text-gray-500">
            No products found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

/* ================= PRODUCT SECTION ================= */

function ProductSection({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  if (!products?.length) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            {title}
          </h2>

          <Link
            href="/products"
            className="text-sm font-medium hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ================= PRODUCT CARD ================= */

function ProductCard({ product }: { product: Product }) {
  const imageUrl =
    product.thumbnail ||
    product.images?.[0]?.url ||
    "/placeholder.png";

  return (
    <div className="group bg-white rounded-xl border p-3 hover:shadow-lg transition">

      <div className="relative h-52 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      <h3 className="mt-3 text-sm font-medium line-clamp-2">
        {product.title}
      </h3>

      <p className="mt-2 font-semibold text-lg">
        ₹{product.price}
      </p>

      <div className="mt-2">
        <WishlistButton productId={product._id} />
      </div>
    </div>
  );
}

/* ================= TRUST ================= */

function TrustSection() {
  const items = [
    "Secure Payments",
    "Verified Sellers",
    "Fast Delivery",
    "Easy Returns",
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item}
            className="bg-white p-6 text-center rounded-xl shadow-sm"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= CATEGORY SHOWCASE ================= */

function CategoryShowcase() {
  const cats = ["fashion", "medical", "electronics"];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-6">
        {cats.map((c) => (
          <Link
            key={c}
            href={`/?category=${c}`}
            className="p-10 border rounded-xl text-center hover:shadow-md transition"
          >
            {c.toUpperCase()}
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ================= CTA ================= */

function VendorCTA() {
  return (
    <section className="py-20 text-center">
      <Link
        href="/for-vendors"
        className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition"
      >
        Become Seller
      </Link>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-20 text-center bg-black text-white">
      Explore Marketplace
    </section>
  );
}

// // app/(public)/page.tsx

// import Link from "next/link";
// import Image from "next/image";
// import type { Metadata } from "next";
// import { fetchProducts } from "@/lib/api";
// import WishlistButton from "@/components/ui/WishlistButton";
// import type { Product } from "@/components/ui/product/product.types";

// export const revalidate = 60;

// export const metadata: Metadata = {
//   title: "RK Marketplace | Multi Category Shopping",
//   description:
//     "Shop fashion, medical, electronics and more from verified sellers.",
// };

// export default async function HomePage({
//   searchParams,
// }: {
//   searchParams: { category?: string };
// }) {
//   const rawCategory = searchParams?.category;

//   const category =
//     typeof rawCategory === "string"
//       ? rawCategory
//       : Array.isArray(rawCategory)
//       ? rawCategory[0]
//       : "all";
//   let featured: Product[] = [];
//   let newArrivals: Product[] = [];
//   let bestSellers: Product[] = [];
//   let categoryProducts: Product[] = [];

//   try {
//     if (category === "all") {
//       [featured, newArrivals, bestSellers] = await Promise.all([
//         fetchProducts({ filter: "featured", limit: 8 }),
//         fetchProducts({ filter: "new", limit: 8 }),
//         fetchProducts({ filter: "best", limit: 8 }),
//       ]);
//     } else {
//       categoryProducts = await fetchProducts({
//         category,
//         limit: 12,
//       });
//     }
//   } catch (error) {
//     console.error("Homepage fetch failed:", error);
//   }

//   return (
//     <div className="bg-white">

//       {/* HERO */}
//       <section className="pt-32 pb-24 bg-linear-to-b from-gray-50 to-white">
//         <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

//           <div>
//             <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
//               {category === "all"
//                 ? "Discover Everything in One Place"
//                 : `${category.toUpperCase()} Marketplace`}
//             </h1>

//             <p className="text-gray-600 mb-10 text-lg">
//               Browse top products from trusted sellers.
//             </p>

//             <Link
//               href={`/products?category=${category}`}
//               className="px-10 py-4 bg-black text-white rounded-xl"
//             >
//               Explore
//             </Link>
//           </div>

//           <div className="hidden lg:block">
//             <div className="relative h-105 rounded-3xl overflow-hidden shadow-xl">
//               <Image
//                 src="/hero-fashion.jpg"
//                 alt="Marketplace"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           </div>

//         </div>
//       </section>

//       <TrustSection />

//       {/* ================= PRODUCTS ================= */}

//       {category === "all" ? (
//         <>
//           <ProductSection title="Featured Picks" products={featured} />
//           <ProductSection title="New This Week" products={newArrivals} />
//           <ProductSection title="Top Selling Now" products={bestSellers} />
//         </>
//       ) : (
//         <CategorySection
//           category={category}
//           products={categoryProducts}
//         />
//       )}

//       {category === "all" && <CategoryShowcase />}

//       <VendorCTA />
//       <FinalCTA />

//     </div>
//   );
// }

// /* ================= CATEGORY SECTION ================= */

// function CategorySection({
//   category,
//   products,
// }: {
//   category: string;
//   products: Product[];
// }) {
//   return (
//     <section className="py-20">
//       <div className="container mx-auto px-6">

//         <h2 className="text-3xl font-bold mb-10">
//           {category.toUpperCase()} Products
//         </h2>

//         {!products.length ? (
//           <p className="text-gray-500">
//             No products found in this category.
//           </p>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </div>
//         )}

//       </div>
//     </section>
//   );
// }

// /* ================= PRODUCT SECTION ================= */

// function ProductSection({
//   title,
//   products,
// }: {
//   title: string;
//   products: Product[];
// }) {
//   if (!products?.length) return null;

//   return (
//     <section className="py-20 bg-gray-50">
//       <div className="container mx-auto px-6">

//         <h2 className="text-3xl font-bold mb-10">
//           {title}
//         </h2>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// }

// /* ================= PRODUCT CARD ================= */

// function ProductCard({ product }: { product: Product }) {
//   const imageUrl =
//     product.thumbnail ||
//     product.images?.[0]?.url ||
//     "/placeholder.png";

//   return (
//     <div className="group bg-white rounded-xl border p-3 hover:shadow-lg transition">

//       <div className="relative h-52 bg-gray-100 rounded-lg overflow-hidden">
//         <Image
//           src={imageUrl}
//           alt={product.title}
//           fill
//           className="object-cover group-hover:scale-105 transition"
//         />
//       </div>

//       <h3 className="mt-3 text-sm font-medium line-clamp-2">
//         {product.title}
//       </h3>

//       <p className="mt-2 font-semibold">
//         ₹{product.price}
//       </p>

//       <WishlistButton productId={product._id} />
//     </div>
//   );
// }

// /* ================= TRUST ================= */

// function TrustSection() {
//   const items = [
//     "Secure Payments",
//     "Verified Sellers",
//     "Fast Delivery",
//     "Easy Returns",
//   ];

//   return (
//     <section className="py-16 bg-gray-50">
//       <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
//         {items.map((item) => (
//           <div key={item} className="bg-white p-6 text-center rounded-xl">
//             {item}
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// /* ================= CATEGORY SHOWCASE ================= */

// function CategoryShowcase() {
//   const cats = ["fashion", "medical", "electronics"];

//   return (
//     <section className="py-20">
//       <div className="container mx-auto px-6 grid md:grid-cols-3 gap-6">
//         {cats.map((c) => (
//           <Link key={c} href={`/?category=${c}`} className="p-10 border rounded-xl text-center">
//             {c.toUpperCase()}
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// }

// /* ================= CTA ================= */

// function VendorCTA() {
//   return (
//     <section className="py-20 text-center">
//       <Link href="/for-vendors" className="bg-black text-white px-8 py-3 rounded">
//         Become Seller
//       </Link>
//     </section>
//   );
// }

// function FinalCTA() {
//   return (
//     <section className="py-20 text-center bg-black text-white">
//       Explore Marketplace
//     </section>
//   );
// }