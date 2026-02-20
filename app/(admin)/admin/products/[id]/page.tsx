// app/admin/products/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById } from "@/lib/api/admin/products";
import { updateProduct } from "@/lib/api/admin/products";
import { uploadImage } from "@/lib/api/admin/upload";

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

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ================= FORM STATE ================= */

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [tags, setTags] = useState("");

  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] =
    useState<number>(0);
  const [discountPercent, setDiscountPercent] =
    useState<number>(0);

  const [thumbnail, setThumbnail] = useState("");
  const [images, setImages] = useState<Image[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] =
    useState(false);
  const [isBestSeller, setIsBestSeller] =
    useState(false);
  const [isActive, setIsActive] = useState(true);

  /* ================= LOAD PRODUCT ================= */

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const p = await fetchProductById(id);

        setTitle(p.title);
        setSlug(p.slug);
        setBrand(p.brand || "");
        setShortDescription(p.shortDescription || "");
        setDescription(p.description);
        setCategory(p.category);
        setSubCategory(p.subCategory || "");
        setTags((p.tags || []).join(", "));

        setPrice(p.price);
        setOriginalPrice(p.originalPrice || 0);
        setDiscountPercent(p.discountPercent || 0);

        setThumbnail(p.thumbnail);
        setImages(p.images || []);
        setVariants(p.variants || []);

        setIsFeatured(!!p.isFeatured);
        setIsNewArrival(!!p.isNewArrival);
        setIsBestSeller(!!p.isBestSeller);
        setIsActive(!!p.isActive);
      } catch {
        alert("Failed to load product");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, router]);

  /* ================= HELPERS ================= */

  const updateVariant = (
    index: number,
    key: keyof Variant,
    value: any
  ) => {
    const copy = [...variants];
    copy[index] = { ...copy[index], [key]: value };
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

  /* ================= SAVE ================= */

  const handleSave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProduct(id, {
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

      alert("Product updated successfully");
      router.push("/admin/products");
    } catch (err: any) {
      alert(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-28">
        Loading product...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-16 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">
        Edit Product
      </h1>

      <form
        onSubmit={handleSave}
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
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
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
              />
            </div>
          ))}
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

        {/* SAVE */}
        <button
          disabled={saving}
          className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          {saving
            ? "Saving Changes..."
            : "Save Changes"}
        </button>
      </form>
    </div>
  );
}