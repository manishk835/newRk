// // // 📄 app/(public)/product/page.tsx


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
    <div className="pt-24 bg-gray-50 dark:bg-black min-h-screen pb-32 transition-colors duration-300">

      {/* ================= BREADCRUMB ================= */}
      <div className="container mx-auto px-4 mb-6 text-sm text-gray-600 dark:text-gray-400">

        <div className="flex items-center gap-2 flex-wrap">

          <Link
            href="/"
            className="hover:underline hover:text-black dark:hover:text-white transition"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/products"
            className="hover:underline hover:text-black dark:hover:text-white transition"
          >
            Products
          </Link>

          {product.category && (
            <>
              <span>/</span>

              <span className="capitalize text-gray-700 dark:text-gray-300">
                {product.category}
              </span>
            </>
          )}

          <span>/</span>

          <span className="text-black dark:text-white font-medium line-clamp-1">
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

            <h2 className="text-xl font-semibold text-black dark:text-white">
              Related Products
            </h2>

            <Link
              href={`/products?category=${product.category}`}
              className="text-sm text-gray-600 dark:text-gray-400 hover:underline hover:text-black dark:hover:text-white transition"
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
      <section className="mt-20 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors duration-300">

        <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400">
          ✔ Secure Payments &nbsp; • &nbsp;
          ✔ Easy Returns &nbsp; • &nbsp;
          ✔ Trusted Sellers
        </div>

      </section>

    </div>
  );
}