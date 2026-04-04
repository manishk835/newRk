"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import { useProduct } from "../context/ProductContext";

export default function ImageUploader() {
  const { product, setProduct } = useProduct();

  const images = product.images || [];

  /* HANDLE UPLOAD */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await apiFetch("/upload", {
        method: "POST",
        body: formData,
      });

      const urls = res.images;

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...urls].slice(0, 6),
      }));
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  /* REMOVE IMAGE */
  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);

    setProduct((prev) => ({
      ...prev,
      images: updated,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative w-full h-32 border rounded-lg overflow-hidden"
            >
              <img
                src={img}
                alt="product"
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded"
              >
                <Trash2 size={14} />
              </button>

              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-xs bg-black text-white px-2 py-0.5 rounded">
                  Thumbnail
                </span>
              )}
            </div>
          ))}

          {images.length < 6 && (
            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-32 cursor-pointer text-gray-500 hover:bg-gray-50">
              <Plus />
              <span className="text-xs">Upload</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleUpload}
              />
            </label>
          )}
        </div>

        <p className="text-xs text-gray-500">
          Upload up to 6 images. First image will be thumbnail.
        </p>
      </CardContent>
    </Card>
  );
}