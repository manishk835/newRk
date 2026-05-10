"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import ImageUploader from "./ImageUploader";

import VariantGenerator from "./VariantGenerator";

import PricingTable from "./PricingTable";

import ProductActions from "./ProductActions";

import {
  createProduct,
  updateProduct,
} from "../services/product.service";

/* ================= TYPES ================= */

type Product = {
  _id?: string;

  name: string;

  category: string;

  subCategory?: string;

  price: number;

  description?: string;

  features?: string;

  images?: any[];

  variants?: any[];

  // fashion
  size?: string;

  color?: string;

  // grocery
  weight?: string;

  unit?: string;

  expiry?: string;
};

type Props = {
  initialData?: Product;

  isEdit?: boolean;
};

/* ================= PAGE ================= */

export default function ProductForm({
  initialData,
  isEdit,
}: Props) {

  const [product, setProduct] =
    useState<Product>({
      name: "",
      category: "",
      price: 0,
      description: "",
      features: "",
      images: [],
      variants: [],
    });

  const [loading, setLoading] =
    useState(false);

  /* ================= LOAD ================= */

  useEffect(() => {

    if (initialData) {
      setProduct(initialData);
    }

  }, [initialData]);

  /* ================= AI ================= */

  const generateAI = async () => {
    try {

      const res = await fetch(
        "/api/ai/generate-description",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: product.name,
            category:
              product.category,
            features:
              product.features,
          }),
        }
      );

      const data =
        await res.json();

      setProduct((prev) => ({
        ...prev,
        description:
          data.description,
      }));

    } catch {

      alert("AI failed");

    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {

      setLoading(true);

      if (
        isEdit &&
        product._id
      ) {

        await updateProduct(
          product._id,
          product
        );

        alert(
          "Product updated"
        );

      } else {

        await createProduct(
          product
        );

        alert(
          "Product created"
        );

      }

    } catch (err) {

      console.error(err);

      alert(
        "Error saving product"
      );

    } finally {

      setLoading(false);

    }
  };

  /* ================= UI ================= */

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

      {/* LEFT */}
      <div className="xl:col-span-8 space-y-6">

        {/* BASIC INFO */}
        <Card className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300">

          <CardHeader>

            <CardTitle className="text-black dark:text-white">
              Basic Info
            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-4">

            {/* PRODUCT NAME */}
            <div>

              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                Product Name
              </label>

              <input
                placeholder="Enter product name"
                value={product.name}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    name:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
              />

            </div>

            {/* CATEGORY */}
            <div>

              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                Category
              </label>

              <select
                value={
                  product.category
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    category:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
              >

                <option value="">
                  Select Category
                </option>

                <option value="fashion">
                  Fashion
                </option>

                <option value="grocery">
                  Grocery
                </option>

              </select>

            </div>

            {/* PRICE */}
            <div>

              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                Base Price
              </label>

              <input
                type="number"
                placeholder="Enter price"
                value={
                  product.price
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    price: Number(
                      e.target.value
                    ),
                  })
                }
                className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
              />

            </div>

            {/* FEATURES */}
            <div>

              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                Features
              </label>

              <input
                placeholder="Cotton, oversized, breathable..."
                value={
                  product.features
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    features:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
              />

            </div>

            {/* DESCRIPTION */}
            <div>

              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                Description
              </label>

              <textarea
                placeholder="Write product description..."
                value={
                  product.description
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    description:
                      e.target.value,
                  })
                }
                rows={5}
                className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-xl outline-none resize-none"
              />

            </div>

            {/* AI */}
            <Button
              type="button"
              variant="outline"
              onClick={generateAI}
              className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              ✨ Generate AI Description
            </Button>

          </CardContent>

        </Card>

        {/* ================= DYNAMIC ================= */}

        {product.category ===
          "fashion" && (

          <Card className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300">

            <CardHeader>

              <CardTitle className="text-black dark:text-white">
                Fashion Details
              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <input
                placeholder="Size (M, L, XL)"
                value={
                  product.size ||
                  ""
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    size:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
              />

              <input
                placeholder="Color"
                value={
                  product.color ||
                  ""
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    color:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
              />

            </CardContent>

          </Card>

        )}

        {product.category ===
          "grocery" && (

          <Card className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300">

            <CardHeader>

              <CardTitle className="text-black dark:text-white">
                Grocery Details
              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <input
                placeholder="Weight"
                value={
                  product.weight ||
                  ""
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    weight:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
              />

              <input
                placeholder="Unit (kg, g, L)"
                value={
                  product.unit ||
                  ""
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    unit:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
              />

              <input
                type="date"
                value={
                  product.expiry ||
                  ""
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    expiry:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
              />

            </CardContent>

          </Card>

        )}

        {/* COMMON */}
        <ImageUploader
          product={product}
          setProduct={setProduct}
        />

        <VariantGenerator
          product={product}
          setProduct={setProduct}
        />

        <PricingTable
          product={product}
          setProduct={setProduct}
        />

      </div>

      {/* RIGHT */}
      <div className="xl:col-span-4">

        <div className="sticky top-24">

          <ProductActions
            onSubmit={
              handleSubmit
            }
            loading={loading}
            isEdit={isEdit}
            product={product}
          />

        </div>

      </div>

    </div>
  );
}

// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useProduct } from "../context/ProductContext";
// import ImageUploader from "./ImageUploader";
// import VariantGenerator from "./VariantGenerator";
// import PricingTable from "./PricingTable";
// import ProductActions from "./ProductActions";
// import { Button } from "@/components/ui/button";
// import { apiFetch } from "@/lib/api/client";

// export default function ProductForm() {
//   const { product, setProduct } = useProduct();

//   const generateAI = async () => {
//     try {
//       const res = await apiFetch("/ai/generate-description", {
//         method: "POST",
//         body: JSON.stringify({
//           name: product.name,
//           category: product.category,
//           features: product.features || "",
//         }),
//       });

//       setProduct((prev) => ({
//         ...prev,
//         description: res.description,
//       }));
//     } catch (err) {
//       console.error(err);
//       alert("AI failed");
//     }
//   };

//   return (
//     <div className="grid grid-cols-12 gap-6">

//       {/* LEFT */}
//       <div className="col-span-8 space-y-6">

//         <Card>
//           <CardHeader>
//             <CardTitle>Basic Info</CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-4">

//             {/* FEATURES */}
//             <input
//               placeholder="Key features (optional)"
//               value={product.features || ""}
//               onChange={(e) =>
//                 setProduct((prev) => ({
//                   ...prev,
//                   features: e.target.value,
//                 }))
//               }
//               className="w-full border p-2 rounded"
//             />

//             {/* DESCRIPTION */}
//             <textarea
//               placeholder="Description"
//               value={product.description || ""}
//               onChange={(e) =>
//                 setProduct((prev) => ({
//                   ...prev,
//                   description: e.target.value,
//                 }))
//               }
//               className="w-full border p-2 rounded"
//             />

//             {/* AI BUTTON */}
//             <Button type="button" variant="outline" onClick={generateAI}>
//               ✨ Generate AI Description
//             </Button>

//           </CardContent>
//         </Card>

//         <ImageUploader />
//         <VariantGenerator />
//         <PricingTable />

//       </div>

//       {/* RIGHT */}
//       <div className="col-span-4">
//         <ProductActions />
//       </div>

//     </div>
//   );
// }