"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/* ================= TYPES ================= */

type Props = {
  onSubmit: () => void;

  loading: boolean;

  isEdit?: boolean;

  product?: {
    name?: string;
    category?: string;
    price?: number;
  };
};

/* ================= COMPONENT ================= */

export default function ProductActions({
  onSubmit,
  loading,
  isEdit,
  product,
}: Props) {

  const isReady =
    product?.name &&
    product?.category &&
    product?.price;

  /* ================= SAVE DRAFT ================= */

  const handleSaveDraft = () => {

    localStorage.setItem(
      "draft_product",
      JSON.stringify(product)
    );

    alert("💾 Draft Saved");
  };

  return (
    <Card className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300">

      <CardHeader>

        <CardTitle className="text-black dark:text-white">
          Actions
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-5">

        {/* STATUS */}
        <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Product Status
          </p>

          <div className="flex items-center gap-2">

            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isReady
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
            />

            <p
              className={`text-sm font-medium ${
                isReady
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {isReady
                ? "Ready to publish"
                : "Incomplete"}
            </p>

          </div>

        </div>

        {/* SAVE DRAFT */}
        <Button
          variant="outline"
          className="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          onClick={handleSaveDraft}
        >
          💾 Save Draft
        </Button>

        {/* SUBMIT */}
        <Button
          onClick={onSubmit}
          disabled={
            loading || !isReady
          }
          className="w-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition disabled:opacity-50"
        >

          {loading
            ? isEdit
              ? "Updating..."
              : "Publishing..."
            : isEdit
            ? "Update Product"
            : "Publish Product"}

        </Button>

        {/* INFO */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Make sure all required product details are filled before publishing.
        </p>

      </CardContent>

    </Card>
  );
}

// "use client";

// import { useProduct } from "../context/ProductContext";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useState } from "react";
// import { apiFetch } from "@/lib/api/client";
// import { useParams } from "next/navigation";
// import { updateProduct } from "../services/product.service";

// export default function ProductActions() {
//   const { id } = useParams();
//   const isEdit = !!id;
//   const { product } = useProduct();
//   const [loading, setLoading] = useState(false);

//   /* BUILD FINAL PAYLOAD (FROM CONTEXT ONLY) */
//   const buildPayload = () => {
//     return {
//       name: product.name || "",
//       description: product.description || "",
//       category: product.category || "",
//       subCategory: product.subCategory || "",
//       images: product.images || [],
//       variants: product.variants || [],
//       status: "active",
//     };
//   };

//   /* SAVE PRODUCT */
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       if (isEdit) {
//         await updateProduct(id as string, product);
//         alert("✅ Product Updated");
//       } else {
//         await apiFetch("/product", {
//           method: "POST",
//           body: JSON.stringify(product),
//         });
//         alert("✅ Product Created");
//       }

//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Actions</CardTitle>
//       </CardHeader>

//       <CardContent className="space-y-4">

//         <div className="text-sm">
//           <p className="text-gray-500">Status</p>
//           <p className="font-medium">
//             {product?.name ? "Ready to publish" : "Incomplete"}
//           </p>
//         </div>

//         <Button
//           variant="outline"
//           className="w-full"
//           onClick={() => {
//             const payload = buildPayload();
//             localStorage.setItem("draft_product", JSON.stringify(payload));
//             alert("💾 Draft Saved");
//           }}
//         >
//           Save Draft
//         </Button>

//         <Button
//           onClick={handleSubmit}
//           className="w-full bg-black text-white"
//           disabled={loading}
//         >
//           {loading
//             ? isEdit
//               ? "Updating..."
//               : "Publishing..."
//             : isEdit
//               ? "Update Product"
//               : "Publish Product"}
//         </Button>

//       </CardContent>
//     </Card>
//   );
// }