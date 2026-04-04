"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProduct } from "../context/ProductContext";
import ImageUploader from "./ImageUploader";
import VariantGenerator from "./VariantGenerator";
import PricingTable from "./PricingTable";
import ProductActions from "./ProductActions";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api/client";

export default function ProductForm() {
  const { product, setProduct } = useProduct();

  const generateAI = async () => {
    try {
      const res = await apiFetch("/ai/generate-description", {
        method: "POST",
        body: JSON.stringify({
          name: product.name,
          category: product.category,
          features: product.features || "",
        }),
      });

      setProduct((prev) => ({
        ...prev,
        description: res.description,
      }));
    } catch (err) {
      console.error(err);
      alert("AI failed");
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">

      {/* LEFT */}
      <div className="col-span-8 space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* FEATURES */}
            <input
              placeholder="Key features (optional)"
              value={product.features || ""}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  features: e.target.value,
                }))
              }
              className="w-full border p-2 rounded"
            />

            {/* DESCRIPTION */}
            <textarea
              placeholder="Description"
              value={product.description || ""}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full border p-2 rounded"
            />

            {/* AI BUTTON */}
            <Button type="button" variant="outline" onClick={generateAI}>
              ✨ Generate AI Description
            </Button>

          </CardContent>
        </Card>

        <ImageUploader />
        <VariantGenerator />
        <PricingTable />

      </div>

      {/* RIGHT */}
      <div className="col-span-4">
        <ProductActions />
      </div>

    </div>
  );
}