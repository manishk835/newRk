"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { uploadImage } from "@/lib/api/admin/upload";

/* ================= CONFIG ================= */

const CATEGORY_CONFIG: Record<string, string[]> = {
  fashion: ["men", "women", "kids"],
  electronics: ["audio", "mobile", "accessories"],
  medical: ["devices", "essentials"],
  grocery: ["fruits", "daily", "snacks"],
  food: ["veg", "non-veg", "fast-food"],
};

/* ================= TYPES ================= */

type Variant = {
  name: string;
  stock: number;
  sku: string;
};

type Attribute = {
  key: string;
  value: string;
};

type ImageType = {
  url: string;
  public_id: string;
  alt?: string;
  order: number;
};

/* ================= HELPERS ================= */

const slugify = (val: string) =>
  val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

const generateSKU = (title: string, name: string) =>
  `${slugify(title).slice(0, 6)}-${slugify(name)}-${Date.now()
    .toString()
    .slice(-4)}`.toUpperCase();

/* ================= PAGE ================= */

export default function CreateProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* BASIC */
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  /* CATEGORY */
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  /* PRICING */
  const [price, setPrice] = useState(0);

  /* IMAGES */
  const [images, setImages] = useState<ImageType[]>([]);

  /* VARIANTS */
  const [variants, setVariants] = useState<Variant[]>([
    { name: "", stock: 0, sku: "" },
  ]);

  /* ATTRIBUTES (dynamic) */
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  /* ================= IMAGE ================= */

  const handleImageUpload = async (files: FileList) => {
    try {
      setUploading(true);

      const uploaded: ImageType[] = [];

      for (let i = 0; i < files.length; i++) {
        const { url, publicId } = await uploadImage(files[i]);

        uploaded.push({
          url,
          public_id: publicId,
          alt: title,
          order: images.length + i,
        });
      }

      setImages((prev) => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
    }
  };

  /* ================= VARIANTS ================= */

  const addVariant = () =>
    setVariants([...variants, { name: "", stock: 0, sku: "" }]);

  const updateVariant = (
    i: number,
    key: keyof Variant,
    value: string | number
  ) => {
    const updated = [...variants];

    updated[i] = { ...updated[i], [key]: value };

    if (key === "name") {
      updated[i].sku = generateSKU(title, value as string);
    }

    setVariants(updated);
  };

  const removeVariant = (i: number) =>
    setVariants(variants.filter((_, index) => index !== i));

  /* ================= ATTRIBUTES ================= */

  const addAttribute = () =>
    setAttributes([...attributes, { key: "", value: "" }]);

  const updateAttribute = (
    i: number,
    key: keyof Attribute,
    value: string
  ) => {
    const updated = [...attributes];
    updated[i][key] = value;
    setAttributes(updated);
  };

  const removeAttribute = (i: number) =>
    setAttributes(attributes.filter((_, index) => index !== i));

  /* ================= VALIDATION ================= */

  const validate = () => {
    if (!title || !category || !price)
      return "Required fields missing";

    if (!images.length)
      return "Upload at least one image";

    if (variants.some((v) => !v.name))
      return "Variant required";

    return null;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const err = validate();
    if (err) return alert(err);

    try {
      setLoading(true);

      await apiFetch("/products/seller/create", {
        method: "POST",
        body: JSON.stringify({
          title,
          slug,
          description,
          category,
          subCategory,
          price,
          thumbnail: images[0]?.url,
          images,
          variants,
          attributes,
        }),
      });

      alert("Product Created 🚀");
      router.push("/seller/products");

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">

      <h1 className="text-3xl font-bold mb-8">
        Create Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-10 bg-white p-8 rounded-2xl shadow">

        {/* BASIC */}
        <div className="space-y-4">
          <input
            placeholder="Product Title"
            className="w-full border px-4 py-3 rounded-lg"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(slugify(e.target.value));
            }}
          />

          <input
            value={slug}
            readOnly
            className="w-full border px-4 py-3 rounded-lg bg-gray-100"
          />

          <textarea
            placeholder="Description"
            className="w-full border px-4 py-3 rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
        <div className="grid grid-cols-2 gap-6">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory("");
            }}
            className="border px-4 py-3 rounded-lg"
          >
            <option value="">Select Category</option>
            {Object.keys(CATEGORY_CONFIG).map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="border px-4 py-3 rounded-lg"
          >
            <option value="">Sub Category</option>
            {(CATEGORY_CONFIG[category] || []).map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* PRICE */}
        <input
          type="number"
          placeholder="Price"
          className="w-full border px-4 py-3 rounded-lg"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        {/* IMAGES */}
        <div>
          <input
            type="file"
            multiple
            onChange={(e) =>
              e.target.files && handleImageUpload(e.target.files)
            }
          />

          {uploading && <p>Uploading...</p>}

          <div className="grid grid-cols-4 gap-4 mt-4">
            {images.map((img, i) => (
              <img key={i} src={img.url} className="h-28 rounded object-cover" />
            ))}
          </div>
        </div>

        {/* VARIANTS */}
        <div>
          <h2 className="font-semibold mb-2">Variants</h2>

          {variants.map((v, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <input
                placeholder="Variant (e.g. Size M / 1kg)"
                className="border px-3 py-2"
                value={v.name}
                onChange={(e) =>
                  updateVariant(i, "name", e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Stock"
                className="border px-3 py-2"
                value={v.stock}
                onChange={(e) =>
                  updateVariant(i, "stock", Number(e.target.value))
                }
              />

              <input
                value={v.sku}
                readOnly
                className="border px-3 py-2 bg-gray-100"
              />

              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="bg-red-500 text-white px-3"
              >
                X
              </button>
            </div>
          ))}

          <button type="button" onClick={addVariant}>
            + Add Variant
          </button>
        </div>

        {/* ATTRIBUTES */}
        <div>
          <h2 className="font-semibold mb-2">Attributes</h2>

          {attributes.map((a, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <input
                placeholder="Key (e.g. Color)"
                value={a.key}
                onChange={(e) =>
                  updateAttribute(i, "key", e.target.value)
                }
                className="border px-3 py-2"
              />

              <input
                placeholder="Value (e.g. Red)"
                value={a.value}
                onChange={(e) =>
                  updateAttribute(i, "value", e.target.value)
                }
                className="border px-3 py-2"
              />

              <button
                type="button"
                onClick={() => removeAttribute(i)}
                className="bg-red-500 text-white px-3"
              >
                X
              </button>
            </div>
          ))}

          <button type="button" onClick={addAttribute}>
            + Add Attribute
          </button>
        </div>

        <button
          className="w-full bg-black text-white py-4 rounded-xl"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>

      </form>
    </div>
  );
}
// // app/(seller)/seller/products/create/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api/client";
// import { uploadImage } from "@/lib/api/admin/upload";

// /* ================= CONSTANT ================= */

// const CATEGORIES = [
//   "fashion",
//   "medical",
//   "electronics",
//   "grocery",
// ];

// /* ================= TYPES ================= */

// type Variant = {
//   name: string;
//   stock: number;
//   sku: string;
// };

// type ImageType = {
//   url: string;
//   public_id: string;
//   alt?: string;
//   order: number;
// };

// /* ================= HELPERS ================= */

// const slugify = (val: string) =>
//   val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

// const generateSKU = (title: string, name: string) =>
//   `${slugify(title).slice(0, 6)}-${name}-${Date.now()
//     .toString()
//     .slice(-4)}`
//     .toUpperCase();

// /* ================= PAGE ================= */

// export default function CreateProductPage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   const [title, setTitle] = useState("");
//   const [slug, setSlug] = useState("");

//   const [category, setCategory] = useState("");
//   const [price, setPrice] = useState(0);
//   const [description, setDescription] = useState("");

//   const [images, setImages] = useState<ImageType[]>([]);

//   const [variants, setVariants] = useState<Variant[]>([
//     { name: "", stock: 0, sku: "" },
//   ]);

//   /* ================= IMAGE ================= */

//   const handleImageUpload = async (files: FileList) => {
//     try {
//       setUploading(true);

//       const uploaded: ImageType[] = [];

//       for (let i = 0; i < files.length; i++) {
//         const { url, publicId } = await uploadImage(files[i]);

//         uploaded.push({
//           url,
//           public_id: publicId,
//           alt: title,
//           order: images.length + i,
//         });
//       }

//       setImages((prev) => [...prev, ...uploaded]);
//     } catch (err: any) {
//       alert("Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   /* ================= VARIANTS ================= */

//   const addVariant = () =>
//     setVariants([
//       ...variants,
//       { name: "", stock: 0, sku: "" },
//     ]);

//     const updateVariant = (
//       i: number,
//       key: keyof Variant,
//       value: string | number
//     ) => {
//       const updated: Variant[] = [...variants];
    
//       updated[i] = {
//         ...updated[i],
//         [key]: value,
//       };
    
//       if (key === "name") {
//         updated[i].sku = generateSKU(title, value as string);
//       }
    
//       setVariants(updated);
//     };

//   const removeVariant = (i: number) =>
//     setVariants(variants.filter((_, index) => index !== i));

//   /* ================= VALIDATION ================= */

//   const validate = () => {
//     if (!title || !category || !description)
//       return "Fill all required fields";

//     if (!images.length)
//       return "Upload at least one image";

//     if (variants.some((v) => !v.name))
//       return "Variant required";

//     return null;
//   };

//   /* ================= SUBMIT ================= */

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     const err = validate();
//     if (err) return alert(err);

//     try {
//       setLoading(true);

//       await apiFetch("/products/seller/create", {
//         method: "POST",
//         body: JSON.stringify({
//           title,
//           slug,
//           category,
//           price,
//           description,
//           thumbnail: images[0].url,
//           images,
//           variants,
//         }),
//       });

//       alert("Product submitted 🚀");
//       router.push("/seller/products");

//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">

//       <h1 className="text-3xl font-bold mb-8">
//         Create Product
//       </h1>

//       <form onSubmit={handleSubmit} className="space-y-10 bg-white p-8 rounded-2xl shadow">

//         {/* BASIC */}
//         <div className="space-y-4">
//           <input
//             placeholder="Product Title"
//             className="w-full border px-4 py-3 rounded-lg"
//             value={title}
//             onChange={(e) => {
//               setTitle(e.target.value);
//               setSlug(slugify(e.target.value));
//             }}
//           />

//           <input
//             value={slug}
//             readOnly
//             className="w-full border px-4 py-3 rounded-lg bg-gray-100"
//           />

//           <textarea
//             placeholder="Description"
//             className="w-full border px-4 py-3 rounded-lg"
//             value={description}
//             onChange={(e) =>
//               setDescription(e.target.value)
//             }
//           />
//         </div>

//         {/* CATEGORY */}
//         <div className="grid grid-cols-2 gap-6">
//           <select
//             className="border px-4 py-3 rounded-lg"
//             value={category}
//             onChange={(e) =>
//               setCategory(e.target.value)
//             }
//           >
//             <option value="">Select Category</option>
//             {CATEGORIES.map((c) => (
//               <option key={c} value={c}>
//                 {c.toUpperCase()}
//               </option>
//             ))}
//           </select>

//           <input
//             type="number"
//             placeholder="Price"
//             className="border px-4 py-3 rounded-lg"
//             value={price}
//             onChange={(e) =>
//               setPrice(Number(e.target.value))
//             }
//           />
//         </div>

//         {/* IMAGES */}
//         <div>
//           <input
//             type="file"
//             multiple
//             onChange={(e) =>
//               e.target.files &&
//               handleImageUpload(e.target.files)
//             }
//           />

//           {uploading && <p>Uploading...</p>}

//           <div className="grid grid-cols-4 gap-4 mt-4">
//             {images.map((img, i) => (
//               <img
//                 key={i}
//                 src={img.url}
//                 className="h-28 w-full object-cover rounded"
//               />
//             ))}
//           </div>
//         </div>

//         {/* VARIANTS */}
//         <div>
//           {variants.map((v, i) => (
//             <div key={i} className="flex gap-3 mb-3">
//               <input
//                 placeholder="Variant (e.g. Red, 1kg)"
//                 className="border px-3 py-2"
//                 value={v.name}
//                 onChange={(e) =>
//                   updateVariant(i, "name", e.target.value)
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Stock"
//                 className="border px-3 py-2"
//                 value={v.stock}
//                 onChange={(e) =>
//                   updateVariant(i, "stock", Number(e.target.value))
//                 }
//               />

//               <input
//                 readOnly
//                 value={v.sku}
//                 className="border px-3 py-2 bg-gray-100"
//               />

//               <button
//                 type="button"
//                 onClick={() => removeVariant(i)}
//                 className="bg-red-500 text-white px-3"
//               >
//                 X
//               </button>
//             </div>
//           ))}

//           <button type="button" onClick={addVariant}>
//             + Add Variant
//           </button>
//         </div>

//         <button
//           className="w-full bg-black text-white py-4 rounded-xl"
//           disabled={loading}
//         >
//           {loading ? "Creating..." : "Create Product"}
//         </button>

//       </form>
//     </div>
//   );
// }