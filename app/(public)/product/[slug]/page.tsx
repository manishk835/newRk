// ======================================================
// 📄 Product Page (FINAL PRODUCTION VERSION)
// ======================================================

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  fetchProductBySlug,
  fetchAllProducts,
} from "@/lib/api";

import type { Product } from "@/components/ui/product/product.types";
import ProductCard from "@/components/ui/product/ProductCard";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60;

/* ====================================================== */

type Props = {
  params: Promise<{ slug: string }>;
};

/* ======================================================
   SEO (STRONG + FUTURE SAFE)
====================================================== */

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const { slug } = await params;

  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product does not exist",
    };
  }

  const image =
    product.thumbnail ||
    product.images?.[0]?.url ||
    "/placeholder.png";

  const title = `${product.title} | RK Fashion`;
  const description =
    product.shortDescription ||
    product.description?.slice(0, 160) ||
    "Buy premium products at best price";

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      images: [{ url: image }],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/* ======================================================
   PAGE
====================================================== */

export default async function ProductPage({ params }: Props) {

  const { slug } = await params;

  if (!slug) notFound();

  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  /* ================= RELATED ================= */

  let related: Product[] = [];

  try {
    const { products } = await fetchAllProducts({
      category: product.category,
      limit: 10,
    });

    related =
      products
        ?.filter(
          (p: Product) =>
            p._id !== product._id &&
            p.category === product.category
        )
        ?.slice(0, 4) || [];

  } catch (err) {
    console.error("Related fetch error:", err);
  }

  /* ================= UI ================= */

  return (
    <div className="pt-24 bg-gray-50 min-h-screen pb-32">

      {/* ================= BREADCRUMB ================= */}
      <div className="container mx-auto px-4 mb-6 text-sm text-gray-600">

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          <span>/</span>

          <Link href="/products" className="hover:underline">
            Products
          </Link>

          {product.category && (
            <>
              <span>/</span>
              <span className="capitalize text-gray-700">
                {product.category}
              </span>
            </>
          )}

          <span>/</span>

          <span className="text-black font-medium line-clamp-1">
            {product.title}
          </span>
        </div>

      </div>

      {/* ================= PRODUCT ================= */}
      <ProductDetailClient product={product} />

      {/* ================= RELATED ================= */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 mt-20">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Related Products
            </h2>

            <Link
              href={`/products?category=${product.category}`}
              className="text-sm text-gray-600 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

        </section>
      )}

      {/* ================= TRUST ================= */}
      <section className="mt-20 border-t bg-white">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-600">
          ✔ Secure Payments &nbsp; • &nbsp;
          ✔ Easy Returns &nbsp; • &nbsp;
          ✔ Trusted Sellers
        </div>
      </section>

    </div>
  );
}

// // ======================================================
// // 📄 app/(public)/product/[slug]/page.tsx
// // Stable Production + Compatible Version
// // ======================================================

// import type { Metadata } from "next";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import {
//   fetchProductBySlug,
//   fetchAllProducts,
// } from "@/lib/api";
// import type { Product } from "@/components/ui/product/product.types";
// import ProductCard from "@/components/ui/product/ProductCard";
// import ProductDetailClient from "./ProductDetailClient";

// export const revalidate = 60;

// /* ======================================================
//    IMPORTANT:
//    We KEEP Promise params because your project
//    currently resolves params that way.
// ====================================================== */

// type Props = {
//   params: Promise<{ slug: string }>;
// };

// /* ======================================================
//    DYNAMIC SEO
// ====================================================== */

// export async function generateMetadata(
//   { params }: Props
// ): Promise<Metadata> {

//   const { slug } = await params;

//   if (!slug) {
//     return { title: "Product Not Found" };
//   }

//   const product = await fetchProductBySlug(slug);

//   if (!product) {
//     return {
//       title: "Product Not Found",
//       description: "This product does not exist.",
//     };
//   }

//   const imageUrl =
//     product.thumbnail ||
//     product.images?.[0]?.url ||
//     "/placeholder.png";

//   return {
//     title: `${product.title} | RK Fashion House`,
//     description:
//       product.shortDescription ||
//       product.description?.slice(0, 160) ||
//       "Premium fashion product from RK Fashion House.",

//     openGraph: {
//       title: product.title,
//       description:
//         product.shortDescription ||
//         product.description,
//       images: [{ url: imageUrl }],
//       type: "website",
//     },

//     twitter: {
//       card: "summary_large_image",
//       title: product.title,
//       description:
//         product.shortDescription ||
//         product.description,
//       images: [imageUrl],
//     },
//   };
// }

// /* ======================================================
//    PAGE
// ====================================================== */

// export default async function ProductPage({
//   params,
// }: Props) {

//   const { slug } = await params;

//   if (!slug) {
//     notFound();
//   }

//   const product = await fetchProductBySlug(slug);

//   if (!product) {
//     notFound();
//   }

//   /* ================= RELATED ================= */

//   let related: Product[] = [];

//   try {
//     const { products: allProducts } =
//       await fetchAllProducts({});

//     related =
//       allProducts
//         ?.filter(
//           (p: Product) =>
//             p._id !== product._id &&
//             p.category === product.category
//         )
//         ?.slice(0, 4) || [];

//   } catch (err) {
//     console.error("Related fetch failed:", err);
//   }

//   /* ================= RENDER ================= */

//   return (
//     <div className="pt-24 bg-gray-50 min-h-screen pb-32">

//       {/* ================= BREADCRUMB ================= */}
//       <div className="container mx-auto px-4 mb-8 text-sm text-gray-600">
//         <div className="flex items-center gap-2 flex-wrap">
//           <Link href="/">Home</Link>
//           <span>/</span>
//           <Link href="/products">Products</Link>
//           <span>/</span>
//           <span className="text-gray-900 font-medium">
//             {product.title}
//           </span>
//         </div>
//       </div>

//       {/* ================= PRODUCT ================= */}
//       <ProductDetailClient product={product} />

//       {/* ================= RELATED ================= */}
//       {related.length > 0 && (
//         <section className="container mx-auto px-4 mt-24">
//           <h2 className="text-2xl font-bold mb-10">
//             Related Products
//           </h2>

//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//             {related.map((p: Product) => (
//               <ProductCard
//                 key={p._id}
//                 product={p}
//               />
//             ))}
//           </div>
//         </section>
//       )}

//     </div>
//   );
// }