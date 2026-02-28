"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/api/admin/products";
import { uploadImage } from "@/lib/api/admin/upload";

/* ================= TYPES ================= */

type Variant = {
  size: string;
  color: string;
  stock: number;
  sku: string;
};

type ImageType = {
  url: string;
  public_id: string;
  alt?: string;
  order: number;
};

/* ================= HELPERS ================= */

const slugify = (val: string) =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const generateSKU = (
  title: string,
  size: string,
  color: string
) =>
  `${title.slice(0, 3)}-${size}-${color}`
    .toUpperCase()
    .replace(/\s+/g, "");

/* ================= PAGE ================= */

export default function CreateProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* BASIC */
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");

  /* CATEGORY */
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  /* PRICING */
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] =
    useState<number>(0);

  /* IMAGES */
  const [images, setImages] = useState<ImageType[]>(
    []
  );

  /* VARIANTS */
  const [variants, setVariants] = useState<
    Variant[]
  >([{ size: "", color: "", stock: 0, sku: "" }]);

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = async (
    files: FileList
  ) => {
    try {
      setUploading(true);

      const uploaded: ImageType[] = [];

      for (let i = 0; i < files.length; i++) {
        const { url, publicId } =
          await uploadImage(files[i]);

        uploaded.push({
          url,
          public_id: publicId,
          alt: title,
          order: images.length + i,
        });
      }

      setImages((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter(
      (_, i) => i !== index
    );
    setImages(updated);
  };

  const setAsThumbnail = (index: number) => {
    const updated = [...images];
    const selected = updated.splice(index, 1)[0];
    updated.unshift(selected);
    setImages(updated);
  };

  /* ================= VARIANTS ================= */

  const addVariant = () =>
    setVariants([
      ...variants,
      { size: "", color: "", stock: 0, sku: "" },
    ]);

  const removeVariant = (index: number) => {
    setVariants(
      variants.filter((_, i) => i !== index)
    );
  };

  const updateVariant = (
    index: number,
    key: keyof Variant,
    value: any
  ) => {
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    if (key === "size" || key === "color") {
      updated[index].sku = generateSKU(
        title,
        updated[index].size,
        updated[index].color
      );
    }

    setVariants(updated);
  };

  /* ================= VALIDATION ================= */

  const validate = () => {
    if (!title || !category || !description)
      return "Required fields missing";

    if (images.length === 0)
      return "At least one image required";

    if (
      variants.some(
        (v) => !v.size || !v.color
      )
    )
      return "Variant fields incomplete";

    const skuSet = new Set(
      variants.map((v) => v.sku)
    );
    if (skuSet.size !== variants.length)
      return "Duplicate SKUs found";

    return null;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    try {
      setLoading(true);

      await createProduct({
        title,
        slug,
        brand,
        description,
        category,
        subCategory,
        price,
        originalPrice,
        discountPercent:
          originalPrice > 0
            ? Math.round(
                ((originalPrice - price) /
                  originalPrice) *
                  100
              )
            : 0,
        thumbnail: images[0].url,
        images,
        variants,
        isActive: true,
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
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <h1 className="text-3xl font-bold mb-8">
        Create Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-10 bg-white p-8 rounded-2xl shadow"
      >
        {/* BASIC */}
        <section className="space-y-4">
          <input
            placeholder="Product Title"
            className="w-full border px-4 py-3 rounded-lg"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(slugify(e.target.value));
            }}
            required
          />

          <input
            className="w-full border px-4 py-3 rounded-lg bg-gray-50"
            value={slug}
            readOnly
          />

          <textarea
            placeholder="Description"
            className="w-full border px-4 py-3 rounded-lg min-h-28"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            required
          />
        </section>

        {/* CATEGORY + PRICE */}
        <section className="grid grid-cols-3 gap-6">
          <input
            placeholder="Category"
            className="border px-4 py-3 rounded-lg"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            required
          />

          <input
            placeholder="Sub Category"
            className="border px-4 py-3 rounded-lg"
            value={subCategory}
            onChange={(e) =>
              setSubCategory(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Price"
            className="border px-4 py-3 rounded-lg"
            value={price}
            onChange={(e) =>
              setPrice(Number(e.target.value))
            }
            required
          />
        </section>

        {/* IMAGES */}
        <section>
          <h2 className="font-semibold mb-3">
            Product Images
          </h2>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              e.target.files &&
              handleImageUpload(
                e.target.files
              )
            }
          />

          {uploading && (
            <p className="text-sm text-gray-500 mt-2">
              Uploading...
            </p>
          )}

          <div className="grid grid-cols-5 gap-4 mt-6">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative border rounded-lg overflow-hidden"
              >
                <img
                  src={img.url}
                  className="h-32 w-full object-cover"
                />

                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 py-1 rounded">
                    Thumbnail
                  </span>
                )}

                <div className="absolute bottom-1 left-1 right-1 flex justify-between text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      setAsThumbnail(i)
                    }
                    className="bg-white px-2 py-1 rounded shadow"
                  >
                    Set Main
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      removeImage(i)
                    }
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* VARIANTS */}
        <section>
          <h2 className="font-semibold mb-3">
            Variants
          </h2>

          {variants.map((v, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 mb-3"
            >
              <input
                placeholder="Size"
                className="border px-3 py-2 rounded"
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
                className="border px-3 py-2 rounded"
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
                className="border px-3 py-2 rounded"
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
                readOnly
                className="border px-3 py-2 rounded bg-gray-100"
                value={v.sku}
              />
              <button
                type="button"
                onClick={() =>
                  removeVariant(i)
                }
                className="bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="text-blue-600 text-sm"
          >
            + Add Variant
          </button>
        </section>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl text-lg"
        >
          {loading
            ? "Creating..."
            : "Create Product"}
        </button>
      </form>
    </div>
  );
}

// // app/admin/products/create/page.tsx

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { createProduct } from "@/lib/api/admin/products";
// import { uploadImage } from "@/lib/api/admin/upload";

// /* ================= TYPES ================= */

// type Variant = {
//   size: string;
//   color: string;
//   stock: number;
//   sku: string;
//   priceOverride?: number;
// };

// // type Image = {
// //   url: string;
// //   alt?: string;
// // };
// type Image = {
//   url: string;
//   public_id: string;
//   alt?: string;
//   order?: number;
// };
// /* ================= PAGE ================= */

// export default function CreateProductPage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   /* ================= BASIC ================= */

//   const [title, setTitle] = useState("");
//   const [slug, setSlug] = useState("");
//   const [brand, setBrand] = useState("");
//   const [shortDescription, setShortDescription] =
//     useState("");
//   const [description, setDescription] =
//     useState("");

//   /* ================= CATEGORY ================= */

//   const [category, setCategory] = useState("");
//   const [subCategory, setSubCategory] =
//     useState("");
//   const [tags, setTags] = useState("");

//   /* ================= PRICING ================= */

//   const [price, setPrice] = useState<number>(0);
//   const [originalPrice, setOriginalPrice] =
//     useState<number>(0);
//   const [discountPercent, setDiscountPercent] =
//     useState<number>(0);

//   /* ================= IMAGES ================= */

//   const [thumbnail, setThumbnail] = useState("");
//   const [images, setImages] = useState<Image[]>([]);

//   /* ================= FLAGS ================= */

//   const [isFeatured, setIsFeatured] =
//     useState(false);
//   const [isNewArrival, setIsNewArrival] =
//     useState(false);
//   const [isBestSeller, setIsBestSeller] =
//     useState(false);
//   const [isActive, setIsActive] = useState(true);

//   /* ================= VARIANTS ================= */

//   const [variants, setVariants] = useState<
//     Variant[]
//   >([{ size: "", color: "", stock: 0, sku: "" }]);

//   /* ================= HELPERS ================= */

//   const addVariant = () =>
//     setVariants([
//       ...variants,
//       { size: "", color: "", stock: 0, sku: "" },
//     ]);

//   const updateVariant = (
//     i: number,
//     key: keyof Variant,
//     value: any
//   ) => {
//     const copy = [...variants];
//     copy[i] = { ...copy[i], [key]: value };
//     setVariants(copy);
//   };

//   const handleThumbnailUpload = async (
//     file: File
//   ) => {
//     try {
//       setUploading(true);
//       // const { url } = await uploadImage(file);
//       // setThumbnail(url);
//       const { url, publicId } = await uploadImage(file);

//       setThumbnail(url);

//       setImages([
//         {
//           url,
//           public_id: publicId,
//           alt: title,
//           order: 0,
//         },
//       ]);
//     } catch (err: any) {
//       alert(err.message || "Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   /* ================= SUBMIT ================= */

//   const handleSubmit = async (
//     e: React.FormEvent
//   ) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await createProduct({
//         title,
//         slug,
//         brand,
//         shortDescription,
//         description,
//         category,
//         subCategory,
//         tags: tags
//           .split(",")
//           .map((t) => t.trim())
//           .filter(Boolean),
//         price,
//         originalPrice,
//         discountPercent,
//         thumbnail,
//         images,
//         variants,
//         isFeatured,
//         isNewArrival,
//         isBestSeller,
//         isActive,
//       });

//       alert("Product created successfully");
//       router.push("/admin/products");
//     } catch (err: any) {
//       alert(err.message || "Create failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="container mx-auto px-4 pt-28 pb-16 max-w-5xl">
//       <h1 className="text-2xl font-bold mb-6">
//         Create Product
//       </h1>

//       <form
//         onSubmit={handleSubmit}
//         className="space-y-8 border rounded-xl p-6 bg-white"
//       >
//         {/* BASIC INFO */}
//         <section className="space-y-4">
//           <h2 className="font-semibold text-lg">
//             Basic Information
//           </h2>

//           <input
//             placeholder="Product Title"
//             className="w-full border px-4 py-2 rounded"
//             value={title}
//             onChange={(e) => {
//               setTitle(e.target.value);
//               setSlug(
//                 e.target.value
//                   .toLowerCase()
//                   .trim()
//                   .replace(/[^a-z0-9]+/g, "-")
//               );
//             }}
//             required
//           />

//           <input
//             placeholder="Slug"
//             className="w-full border px-4 py-2 rounded bg-gray-50"
//             value={slug}
//             readOnly
//           />

//           <textarea
//             placeholder="Short Description"
//             className="w-full border px-4 py-2 rounded"
//             value={shortDescription}
//             onChange={(e) =>
//               setShortDescription(e.target.value)
//             }
//           />

//           <textarea
//             placeholder="Full Description"
//             className="w-full border px-4 py-2 rounded min-h-30"
//             value={description}
//             onChange={(e) =>
//               setDescription(e.target.value)
//             }
//             required
//           />
//         </section>

//         {/* CATEGORY */}
//         <section className="grid grid-cols-2 gap-4">
//           <input
//             placeholder="Category (men / women)"
//             className="border px-4 py-2 rounded"
//             value={category}
//             onChange={(e) =>
//               setCategory(e.target.value)
//             }
//             required
//           />

//           <input
//             placeholder="Sub Category"
//             className="border px-4 py-2 rounded"
//             value={subCategory}
//             onChange={(e) =>
//               setSubCategory(e.target.value)
//             }
//           />
//         </section>

//         {/* PRICING */}
//         <section className="grid grid-cols-3 gap-4">
//           <input
//             type="number"
//             placeholder="Price"
//             className="border px-4 py-2 rounded"
//             value={price}
//             onChange={(e) =>
//               setPrice(Number(e.target.value))
//             }
//             required
//           />

//           <input
//             type="number"
//             placeholder="Original Price"
//             className="border px-4 py-2 rounded"
//             value={originalPrice}
//             onChange={(e) =>
//               setOriginalPrice(
//                 Number(e.target.value)
//               )
//             }
//           />

//           <input
//             type="number"
//             placeholder="Discount %"
//             className="border px-4 py-2 rounded"
//             value={discountPercent}
//             onChange={(e) =>
//               setDiscountPercent(
//                 Number(e.target.value)
//               )
//             }
//           />
//         </section>

//         {/* THUMBNAIL */}
//         <section className="space-y-3">
//           <h2 className="font-semibold text-lg">
//             Thumbnail Image
//           </h2>

//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) =>
//               e.target.files &&
//               handleThumbnailUpload(
//                 e.target.files[0]
//               )
//             }
//           />

//           {uploading && (
//             <p className="text-sm text-gray-500">
//               Uploading image...
//             </p>
//           )}

//           {thumbnail && (
//             <img
//               src={thumbnail}
//               alt="Thumbnail"
//               className="h-28 rounded border"
//             />
//           )}
//         </section>

//         {/* VARIANTS */}
//         <section className="space-y-4">
//           <h2 className="font-semibold text-lg">
//             Variants & Stock
//           </h2>

//           {variants.map((v, i) => (
//             <div
//               key={i}
//               className="grid grid-cols-4 gap-3"
//             >
//               <input
//                 placeholder="Size"
//                 className="border px-2 py-1 rounded"
//                 value={v.size}
//                 onChange={(e) =>
//                   updateVariant(
//                     i,
//                     "size",
//                     e.target.value
//                   )
//                 }
//                 required
//               />

//               <input
//                 placeholder="Color"
//                 className="border px-2 py-1 rounded"
//                 value={v.color}
//                 onChange={(e) =>
//                   updateVariant(
//                     i,
//                     "color",
//                     e.target.value
//                   )
//                 }
//                 required
//               />

//               <input
//                 type="number"
//                 placeholder="Stock"
//                 className="border px-2 py-1 rounded"
//                 value={v.stock}
//                 onChange={(e) =>
//                   updateVariant(
//                     i,
//                     "stock",
//                     Number(e.target.value)
//                   )
//                 }
//               />

//               <input
//                 className="border px-2 py-1 rounded bg-gray-100"
//                 value={v.sku}
//                 readOnly
//                 placeholder="SKU (auto)"
//               />
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={addVariant}
//             className="text-sm text-blue-600"
//           >
//             + Add Variant
//           </button>
//         </section>

//         {/* FLAGS */}
//         <section className="flex flex-wrap gap-6">
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={isFeatured}
//               onChange={(e) =>
//                 setIsFeatured(e.target.checked)
//               }
//             />
//             Featured
//           </label>

//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={isNewArrival}
//               onChange={(e) =>
//                 setIsNewArrival(
//                   e.target.checked
//                 )
//               }
//             />
//             New Arrival
//           </label>

//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={isBestSeller}
//               onChange={(e) =>
//                 setIsBestSeller(
//                   e.target.checked
//                 )
//               }
//             />
//             Best Seller
//           </label>

//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={isActive}
//               onChange={(e) =>
//                 setIsActive(e.target.checked)
//               }
//             />
//             Active
//           </label>
//         </section>

//         {/* SUBMIT */}
//         <button
//           disabled={loading}
//           className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
//         >
//           {loading
//             ? "Creating Product..."
//             : "Create Product"}
//         </button>
//       </form>
//     </div>
//   );
// }
