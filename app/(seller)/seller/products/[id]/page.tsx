"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "../components/ProductForm";
import { getProductById } from "../services/product.service";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const res = await getProductById(id as string);

        const p = res.product;

        // normalize data (important)
        setProduct({
          _id: p._id,
          name: p.title || p.name,
          description: p.description || "",
          category: p.category || "",
          subCategory: p.subCategory || "",
          price: p.price || 0,
          images: p.images || [],
          variants: p.variants || [],
          features: p.features || "",

          // dynamic (safe fallback)
          size: p.size || "",
          color: p.color || "",

          weight: p.weight || "",
          unit: p.unit || "",
          expiry: p.expiry || "",
        });

      } catch (err) {
        console.error(err);
        alert("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!product) {
    return <div className="p-6">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Edit Product
      </h1>

      <ProductForm initialData={product} isEdit />
    </div>
  );
}

// //  app/products/[id]/page.tsx

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
