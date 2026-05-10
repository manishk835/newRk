"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Plus,
  Trash2,
} from "lucide-react";

import { apiFetch } from "@/lib/api/client";

/* ================= TYPES ================= */

type Props = {
  product: any;

  setProduct: (
    data: any
  ) => void;
};

/* ================= COMPONENT ================= */

export default function ImageUploader({
  product,
  setProduct,
}: Props) {

  const images =
    product.images || [];

  /* ================= UPLOAD ================= */

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files =
      e.target.files;

    if (!files) return;

    const formData =
      new FormData();

    Array.from(files).forEach(
      (file) => {
        formData.append(
          "images",
          file
        );
      }
    );

    try {

      const res =
        await apiFetch(
          "/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      // backend returns:
      // [{ url, public_id }]
      const uploaded =
        res.images || [];

      setProduct(
        (prev: any) => ({
          ...prev,

          images: [
            ...(prev.images ||
              []),
            ...uploaded,
          ].slice(0, 6),
        })
      );

    } catch (err) {

      console.error(err);

      alert(
        "Upload failed"
      );

    }
  };

  /* ================= REMOVE ================= */

  const removeImage = (
    index: number
  ) => {

    const updated =
      images.filter(
        (
          _: any,
          i: number
        ) => i !== index
      );

    setProduct(
      (prev: any) => ({
        ...prev,
        images: updated,
      })
    );
  };

  return (
    <Card className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300">

      <CardHeader>

        <CardTitle className="text-black dark:text-white">
          Product Images
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-5">

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

          {images.map(
            (
              img: any,
              i: number
            ) => (

              <div
                key={i}
                className="relative w-full h-36 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden group bg-gray-100 dark:bg-zinc-800"
              >

                <img
                  src={
                    img.url ||
                    img
                  }
                  alt="product"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* DELETE */}
                <button
                  onClick={() =>
                    removeImage(
                      i
                    )
                  }
                  className="absolute top-2 right-2 bg-black/70 dark:bg-white/20 backdrop-blur text-white dark:text-white p-1.5 rounded-lg hover:opacity-90 transition"
                >

                  <Trash2
                    size={14}
                  />

                </button>

                {/* THUMBNAIL */}
                {i === 0 && (

                  <span className="absolute bottom-2 left-2 text-[11px] bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded-md font-medium">
                    Thumbnail
                  </span>

                )}

              </div>

            )
          )}

          {/* UPLOAD BOX */}
          {images.length < 6 && (

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl h-36 cursor-pointer text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition">

              <Plus
                size={24}
              />

              <span className="text-xs mt-2">
                Upload Images
              </span>

              <input
                type="file"
                multiple
                className="hidden"
                onChange={
                  handleUpload
                }
              />

            </label>

          )}

        </div>

        {/* INFO */}
        <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-3">

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Upload up to{" "}
            <span className="font-medium text-black dark:text-white">
              6 images
            </span>
            . First image will be used as product thumbnail.
          </p>

        </div>

      </CardContent>

    </Card>
  );
}