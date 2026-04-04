
"use client";

import { useProduct } from "../context/ProductContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { useParams } from "next/navigation";
import { updateProduct } from "../services/product.service";

export default function ProductActions() {
  const { id } = useParams();
  const isEdit = !!id;
  const { product } = useProduct();
  const [loading, setLoading] = useState(false);

  /* BUILD FINAL PAYLOAD (FROM CONTEXT ONLY) */
  const buildPayload = () => {
    return {
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      images: product.images || [],
      variants: product.variants || [],
      status: "active",
    };
  };

  /* SAVE PRODUCT */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isEdit) {
        await updateProduct(id as string, product);
        alert("✅ Product Updated");
      } else {
        await apiFetch("/product", {
          method: "POST",
          body: JSON.stringify(product),
        });
        alert("✅ Product Created");
      }

    } catch (err) {
      console.error(err);
      alert("❌ Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <div className="text-sm">
          <p className="text-gray-500">Status</p>
          <p className="font-medium">
            {product?.name ? "Ready to publish" : "Incomplete"}
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            const payload = buildPayload();
            localStorage.setItem("draft_product", JSON.stringify(payload));
            alert("💾 Draft Saved");
          }}
        >
          Save Draft
        </Button>

        <Button
          onClick={handleSubmit}
          className="w-full bg-black text-white"
          disabled={loading}
        >
          {loading
            ? isEdit
              ? "Updating..."
              : "Publishing..."
            : isEdit
              ? "Update Product"
              : "Publish Product"}
        </Button>

      </CardContent>
    </Card>
  );
}