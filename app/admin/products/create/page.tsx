"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/adminProducts";
import { uploadImage } from "@/lib/adminUpload";

/* ================= TYPES ================= */

type Variant = {
  size: string;
  color: string;
  stock: number;
  sku: string;
  priceOverride?: number;
};

type Image = {
  url: string;
  alt?: string;
};

/* ================= PAGE ================= */

export default function CreateProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ================= BASIC ================= */

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [shortDescription, setShortDescription] =
    useState("");
  const [description, setDescription] =
    useState("");

  /* ================= CATEGORY ================= */

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] =
    useState("");
  const [tags, setTags] = useState("");

  /* ================= PRICING ================= */

  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] =
    useState<number>(0);
  const [discountPercent, setDiscountPercent] =
    useState<number>(0);

  /* ================= IMAGES ================= */

  const [thumbnail, setThumbnail] = useState("");
  const [images, setImages] = useState<Image[]>([]);

  /* ================= FLAGS ================= */

  const [isFeatured, setIsFeatured] =
    useState(false);
  const [isNewArrival, setIsNewArrival] =
    useState(false);
  const [isBestSeller, setIsBestSeller] =
    useState(false);
  const [isActive, setIsActive] = useState(true);

  /* ================= VARIANTS ================= */

  const [variants, setVariants] = useState<
    Variant[]
  >([{ size: "", color: "", stock: 0, sku: "" }]);

  /* ================= HELPERS ================= */

  const addVariant = () =>
    setVariants([
      ...variants,
      { size: "", color: "", stock: 0, sku: "" },
    ]);

  const updateVariant = (
    i: number,
    key: keyof Variant,
    value: any
  ) => {
    const copy = [...variants];
    copy[i] = { ...copy[i], [key]: value };
    setVariants(copy);
  };

  const handleThumbnailUpload = async (
    file: File
  ) => {
    try {
      setUploading(true);
      const { url } = await uploadImage(file);
      setThumbnail(url);
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProduct({
        title,
        slug,
        brand,
        shortDescription,
        description,
        category,
        subCategory,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        price,
        originalPrice,
        discountPercent,
        thumbnail,
        images,
        variants,
        isFeatured,
        isNewArrival,
        isBestSeller,
        isActive,
      });

      alert("Product created successfully");
      router.push("/admin/products");
    } catch (err: any) {
      alert(err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="container mx-auto px-4 pt-28 pb-16 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">
        Create Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 border rounded-xl p-6 bg-white"
      >
        {/* BASIC INFO */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">
            Basic Information
          </h2>

          <input
            placeholder="Product Title"
            className="w-full border px-4 py-2 rounded"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(
                e.target.value
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]+/g, "-")
              );
            }}
            required
          />

          <input
            placeholder="Slug"
            className="w-full border px-4 py-2 rounded bg-gray-50"
            value={slug}
            readOnly
          />

          <textarea
            placeholder="Short Description"
            className="w-full border px-4 py-2 rounded"
            value={shortDescription}
            onChange={(e) =>
              setShortDescription(e.target.value)
            }
          />

          <textarea
            placeholder="Full Description"
            className="w-full border px-4 py-2 rounded min-h-30"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            required
          />
        </section>

        {/* CATEGORY */}
        <section className="grid grid-cols-2 gap-4">
          <input
            placeholder="Category (men / women)"
            className="border px-4 py-2 rounded"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            required
          />

          <input
            placeholder="Sub Category"
            className="border px-4 py-2 rounded"
            value={subCategory}
            onChange={(e) =>
              setSubCategory(e.target.value)
            }
          />
        </section>

        {/* PRICING */}
        <section className="grid grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Price"
            className="border px-4 py-2 rounded"
            value={price}
            onChange={(e) =>
              setPrice(Number(e.target.value))
            }
            required
          />

          <input
            type="number"
            placeholder="Original Price"
            className="border px-4 py-2 rounded"
            value={originalPrice}
            onChange={(e) =>
              setOriginalPrice(
                Number(e.target.value)
              )
            }
          />

          <input
            type="number"
            placeholder="Discount %"
            className="border px-4 py-2 rounded"
            value={discountPercent}
            onChange={(e) =>
              setDiscountPercent(
                Number(e.target.value)
              )
            }
          />
        </section>

        {/* THUMBNAIL */}
        <section className="space-y-3">
          <h2 className="font-semibold text-lg">
            Thumbnail Image
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files &&
              handleThumbnailUpload(
                e.target.files[0]
              )
            }
          />

          {uploading && (
            <p className="text-sm text-gray-500">
              Uploading image...
            </p>
          )}

          {thumbnail && (
            <img
              src={thumbnail}
              alt="Thumbnail"
              className="h-28 rounded border"
            />
          )}
        </section>

        {/* VARIANTS */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">
            Variants & Stock
          </h2>

          {variants.map((v, i) => (
            <div
              key={i}
              className="grid grid-cols-4 gap-3"
            >
              <input
                placeholder="Size"
                className="border px-2 py-1 rounded"
                value={v.size}
                onChange={(e) =>
                  updateVariant(
                    i,
                    "size",
                    e.target.value
                  )
                }
                required
              />

              <input
                placeholder="Color"
                className="border px-2 py-1 rounded"
                value={v.color}
                onChange={(e) =>
                  updateVariant(
                    i,
                    "color",
                    e.target.value
                  )
                }
                required
              />

              <input
                type="number"
                placeholder="Stock"
                className="border px-2 py-1 rounded"
                value={v.stock}
                onChange={(e) =>
                  updateVariant(
                    i,
                    "stock",
                    Number(e.target.value)
                  )
                }
              />

              <input
                className="border px-2 py-1 rounded bg-gray-100"
                value={v.sku}
                readOnly
                placeholder="SKU (auto)"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="text-sm text-blue-600"
          >
            + Add Variant
          </button>
        </section>

        {/* FLAGS */}
        <section className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) =>
                setIsFeatured(e.target.checked)
              }
            />
            Featured
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) =>
                setIsNewArrival(
                  e.target.checked
                )
              }
            />
            New Arrival
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) =>
                setIsBestSeller(
                  e.target.checked
                )
              }
            />
            Best Seller
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) =>
                setIsActive(e.target.checked)
              }
            />
            Active
          </label>
        </section>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          {loading
            ? "Creating Product..."
            : "Create Product"}
        </button>
      </form>
    </div>
  );
}
