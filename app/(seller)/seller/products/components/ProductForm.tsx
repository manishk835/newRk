"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ImageUploader from "./ImageUploader";
import VariantGenerator from "./VariantGenerator";
import PricingTable from "./PricingTable";
import ProductActions from "./ProductActions";
import { createProduct, updateProduct } from "../services/product.service";

type Product = {
  _id?: string;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  description?: string;
  features?: string;

  // dynamic
  size?: string;
  color?: string;

  weight?: string;
  unit?: string;
  expiry?: string;
};

type Props = {
  initialData?: Product;
  isEdit?: boolean;
};

export default function ProductForm({ initialData, isEdit }: Props) {
  const [product, setProduct] = useState<Product>({
    name: "",
    category: "",
    price: 0,
    description: "",
    features: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setProduct(initialData);
    }
  }, [initialData]);

  // ================= AI =================
  const generateAI = async () => {
    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        body: JSON.stringify({
          name: product.name,
          category: product.category,
          features: product.features,
        }),
      });

      const data = await res.json();

      setProduct((prev) => ({
        ...prev,
        description: data.description,
      }));
    } catch (err) {
      alert("AI failed");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isEdit && product._id) {
        await updateProduct(product._id, product);
        alert("Product updated");
      } else {
        await createProduct(product);
        alert("Product created");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT */}
      <div className="col-span-8 space-y-6">

        {/* BASIC INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            <input
              placeholder="Product Name"
              value={product.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <select
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              className="w-full border p-2 rounded"
            >
              <option value="">Select Category</option>
              <option value="fashion">Fashion</option>
              <option value="grocery">Grocery</option>
            </select>

            <input
              type="number"
              placeholder="Price"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
              className="w-full border p-2 rounded"
            />

            {/* FEATURES */}
            <input
              placeholder="Key features"
              value={product.features}
              onChange={(e) =>
                setProduct({ ...product, features: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            {/* DESCRIPTION */}
            <textarea
              placeholder="Description"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <Button type="button" variant="outline" onClick={generateAI}>
              ✨ Generate AI Description
            </Button>

          </CardContent>
        </Card>

        {/* ================= DYNAMIC FIELDS ================= */}

        {product.category === "fashion" && (
          <Card>
            <CardHeader>
              <CardTitle>Fashion Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <input
                placeholder="Size (M, L, XL)"
                value={product.size || ""}
                onChange={(e) =>
                  setProduct({ ...product, size: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Color"
                value={product.color || ""}
                onChange={(e) =>
                  setProduct({ ...product, color: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </CardContent>
          </Card>
        )}

        {product.category === "grocery" && (
          <Card>
            <CardHeader>
              <CardTitle>Grocery Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <input
                placeholder="Weight"
                value={product.weight || ""}
                onChange={(e) =>
                  setProduct({ ...product, weight: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Unit (kg, g, L)"
                value={product.unit || ""}
                onChange={(e) =>
                  setProduct({ ...product, unit: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="date"
                value={product.expiry || ""}
                onChange={(e) =>
                  setProduct({ ...product, expiry: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </CardContent>
          </Card>
        )}

        {/* ================= COMMON ================= */}
        <ImageUploader product={product} setProduct={setProduct} />
        <VariantGenerator product={product} setProduct={setProduct} />
        <PricingTable product={product} setProduct={setProduct} />

      </div>

      {/* RIGHT */}
      <div className="col-span-4">
        <ProductActions
          onSubmit={handleSubmit}
          loading={loading}
          isEdit={isEdit}
          product={product}
        />
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