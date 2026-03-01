// ======================================================
// 📄 app/(public)/product/[slug]/page.tsx
// Stable Production + Compatible Version
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

/* ======================================================
   IMPORTANT:
   We KEEP Promise params because your project
   currently resolves params that way.
====================================================== */

type Props = {
  params: Promise<{ slug: string }>;
};

/* ======================================================
   DYNAMIC SEO
====================================================== */

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const { slug } = await params;

  if (!slug) {
    return { title: "Product Not Found" };
  }

  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product does not exist.",
    };
  }

  const imageUrl =
    product.thumbnail ||
    product.images?.[0]?.url ||
    "/placeholder.png";

  return {
    title: `${product.title} | RK Fashion House`,
    description:
      product.shortDescription ||
      product.description?.slice(0, 160) ||
      "Premium fashion product from RK Fashion House.",

    openGraph: {
      title: product.title,
      description:
        product.shortDescription ||
        product.description,
      images: [{ url: imageUrl }],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: product.title,
      description:
        product.shortDescription ||
        product.description,
      images: [imageUrl],
    },
  };
}

/* ======================================================
   PAGE
====================================================== */

export default async function ProductPage({
  params,
}: Props) {

  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  /* ================= RELATED ================= */

  let related: Product[] = [];

  try {
    const { products: allProducts } =
      await fetchAllProducts({});

    related =
      allProducts
        ?.filter(
          (p: Product) =>
            p._id !== product._id &&
            p.category === product.category
        )
        ?.slice(0, 4) || [];

  } catch (err) {
    console.error("Related fetch failed:", err);
  }

  /* ================= RENDER ================= */

  return (
    <div className="pt-24 bg-gray-50 min-h-screen pb-32">

      {/* ================= BREADCRUMB ================= */}
      <div className="container mx-auto px-4 mb-8 text-sm text-gray-600">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/products">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            {product.title}
          </span>
        </div>
      </div>

      {/* ================= PRODUCT ================= */}
      <ProductDetailClient product={product} />

      {/* ================= RELATED ================= */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 mt-24">
          <h2 className="text-2xl font-bold mb-10">
            Related Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((p: Product) => (
              <ProductCard
                key={p._id}
                product={p}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

// // ======================================================
// // 📄 app/(public)/product/[slug]/page.tsx
// // ======================================================

// import type { Metadata } from "next";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { fetchProductBySlug, fetchAllProducts } from "@/lib/api";
// import type { Product } from "@/components/ui/product/product.types";
// import ProductCard from "@/components/ui/product/ProductCard";
// import ProductDetailClient from "./ProductDetailClient";

// export const revalidate = 60;

// // type Props = {
// //   params: { slug: string };
// // };
// type Props = {
//   params: Promise<{ slug: string }>;
// };
// /* =======================
//    Dynamic SEO
// ======================= */
// export async function generateMetadata(
//   { params }: Props
// ): Promise<Metadata> {

//   const { slug } = await params;

//   const product = await fetchProductBySlug(slug);

//   if (!product) {
//     return { title: "Product Not Found" };
//   }

//   return {
//     title: product.title,
//     description:
//       product.description?.slice(0, 160) ||
//       "Premium fashion product from RK Fashion House.",
//     openGraph: {
//       title: product.title,
//       description: product.description,
//       images: [
//         {
//           url:
//             product.thumbnail ||
//             product.images?.[0]?.url ||
//             "/placeholder.png",
//         },
//       ],
//       type: "website",
//     },
//   };
// }

// /* =======================
//    Page Component
// ======================= */
// // export default async function ProductPage({
// //   params,
// // }: Props) {

// //   const product: Product | null =
// //     await fetchProductBySlug(params.slug);
// export default async function ProductPage({
//   params,
// }: Props) {
//   const { slug } = await params;

//   const product = await fetchProductBySlug(slug);
//   if (!product) notFound();

//   /* ===== Related Products ===== */
//   const { products: allProducts } =
//     await fetchAllProducts({});

//   const related =
//     allProducts
//       ?.filter(
//         (p: Product) =>
//           p._id !== product._id &&
//           p.category === product.category
//       )
//       ?.slice(0, 4) || [];

//   return (
//     <div className="pt-24 bg-[#f7f7f7] min-h-screen pb-32">

//       {/* ================= BREADCRUMB ================= */}
//       <div className="container mx-auto px-4 mb-6 text-sm text-gray-600">
//         <Link href="/">Home</Link> /
//         <Link href="/products" className="ml-1">
//           Products
//         </Link>{" "}
//         / <span className="text-gray-900">{product.title}</span>
//       </div>

//       {/* ================= PRODUCT ================= */}
//       <ProductDetailClient product={product} />

//       {/* ================= RELATED ================= */}
//       {related.length > 0 && (
//         <section className="container mx-auto px-4 mt-20">
//           <h2 className="text-2xl font-bold mb-8">
//             Related Products
//           </h2>

//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//             {related.map((p: Product) => (
//               <ProductCard key={p._id} product={p} />
//             ))}
//           </div>
//         </section>
//       )}

//     </div>
//   );
// }
