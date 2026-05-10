// app/products/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import ProductForm from "../components/ProductForm";

import { getProductById } from "../services/product.service";

export default function EditProductPage() {

  const { id } = useParams();

  const [product, setProduct] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (!id) return;

    const loadProduct = async () => {
      try {

        const res =
          await getProductById(
            id as string
          );

        const p = res.product;

        // normalize data
        setProduct({
          _id: p._id,

          name:
            p.title || p.name,

          description:
            p.description || "",

          category:
            p.category || "",

          subCategory:
            p.subCategory || "",

          price:
            p.price || 0,

          images:
            p.images || [],

          variants:
            p.variants || [],

          features:
            p.features || "",

          // dynamic fallback
          size:
            p.size || "",

          color:
            p.color || "",

          weight:
            p.weight || "",

          unit:
            p.unit || "",

          expiry:
            p.expiry || "",
        });

      } catch (err) {

        console.error(err);

        alert(
          "Failed to load product"
        );

      } finally {

        setLoading(false);

      }
    };

    loadProduct();

  }, [id]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center transition-colors duration-300">

        <div className="text-gray-500 dark:text-gray-400">
          Loading...
        </div>

      </div>
    );
  }

  /* ================= NOT FOUND ================= */

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center transition-colors duration-300">

        <div className="text-black dark:text-white">
          Product not found
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6 transition-colors duration-300">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">

          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Edit Product
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update your product information
          </p>

        </div>

        {/* FORM */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">

          <ProductForm
            initialData={product}
            isEdit
          />

        </div>

      </div>

    </div>
  );
}


// "use client";

// import { useEffect } from "react";
// import { useParams } from "next/navigation";
// import { useProduct } from "../context/ProductContext";
// import ProductForm from "../components/ProductForm";
// import { getProductById } from "../services/product.service";

// export default function EditProductPage() {
//   const { id } = useParams();
//   const { setProduct } = useProduct();

//   useEffect(() => {
//     const load = async () => {
//       const res = await getProductById(id as string);
  
//       const p = res.product;
  
//       setProduct({
//         name: p.name,
//         description: p.description,
//         category: p.category,
//         subCategory: p.subCategory,
//         images: p.images || [],
//         variants: p.variants || [],
//         features: p.features || "",
//       });
//     };
  
//     load();
//   }, [id, setProduct]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-4">
//         Edit Product
//       </h1>

//       <ProductForm />
//     </div>
//   );
// }
