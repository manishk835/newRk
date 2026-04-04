"use client";

import ProductForm from "../components/ProductForm";
import { ProductProvider } from "../context/ProductContext";

export default function CreateProductPage() {
  return (
    <ProductProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        <ProductForm />
      </div>
    </ProductProvider>
  );
}

// "use client";

// import { useState } from "react";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";

// import { Trash2, Plus, ChevronDown } from "lucide-react";

// const schema = z.object({
//   name: z.string(),
//   description: z.string(),
//   category: z.string(),
//   subCategory: z.string(),
// });

// type FormData = z.infer<typeof schema>;

// export default function Page() {
//   const form = useForm<FormData>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       name: "T-shirt-Sample",
//       description: "",
//       category: "",
//       subCategory: "",
//     },
//   });

//   const [variants] = useState([
//     { size: "S", color: "Black" },
//     { size: "M", color: "Black" },
//     { size: "L", color: "Black" },
//   ]);

//   return (
//     <div className="min-h-screen bg-[#f6f7fb] p-6">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-semibold tracking-tight">Create Product</h1>
//         <div className="flex items-center gap-3">
//           <span className="font-medium">Manish</span>
//           <div className="w-9 h-9 rounded-full bg-gray-300" />
//         </div>
//       </div>

//       <div className="grid grid-cols-12 gap-6">

//         {/* LEFT */}
//         <div className="col-span-6 space-y-6">

//           <Card className="shadow-sm border">
//             <CardHeader>
//               <CardTitle>Basic Info</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label>Product Title</Label>
//                 <Input className="mt-1" {...form.register("name")} />
//               </div>

//               <div>
//                 <Label>Description</Label>
//                 <textarea
//                   className="w-full border rounded-md p-3 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
//                   placeholder="Write Somomt here..."
//                 />
//                 <p className="text-xs text-right text-muted-foreground mt-1">0/80</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="shadow-sm border">
//             <CardHeader>
//               <CardTitle>Categories</CardTitle>
//             </CardHeader>
//             <CardContent className="grid grid-cols-2 gap-4">
//               <Select onValueChange={(v) => form.setValue("category", v)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="clothing">Clothing</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Select onValueChange={(v) => form.setValue("subCategory", v)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Sub-category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="tshirt">T-shirt</SelectItem>
//                 </SelectContent>
//               </Select>
//             </CardContent>
//           </Card>

//           <Card className="shadow-sm border">
//             <CardHeader>
//               <CardTitle>Images</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex gap-4 mb-4">
//                 <div className="w-24 h-24 border-2 border-yellow-400 rounded-xl flex items-center justify-center text-xs">
//                   IMG
//                 </div>

//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <div
//                     key={i}
//                     className="w-24 h-24 border border-dashed rounded-xl flex flex-col items-center justify-center text-gray-400"
//                   >
//                     <Plus className="w-4 h-4" />
//                     <span className="text-xs mt-1">0/{i + 1}</span>
//                   </div>
//                 ))}
//               </div>

//               <Button className="bg-black text-white">+ Upload Images</Button>

//               <p className="text-xs text-muted-foreground mt-3">
//                 You can upload up to 6 images. The first image will be the thumbnail.
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="shadow-sm border">
//             <CardHeader>
//               <CardTitle>Variants</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="border rounded-md p-3 text-sm text-muted-foreground">
//                 Attribute Comma, Shrop, ca/o 174
//               </div>

//               <div className="flex gap-6 text-sm text-muted-foreground">
//                 <span>+ De-0 neis.</span>
//                 <span>0 → 100</span>
//                 <span>Store</span>
//               </div>
//             </CardContent>
//           </Card>

//         </div>

//         {/* MIDDLE */}
//         <div className="col-span-3 space-y-6">

//           <Card className="shadow-sm border">
//             <CardHeader>
//               <CardTitle>Images</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="border rounded-md p-3 flex justify-between">
//                 <span>S</span>
//                 <span>Black</span>
//               </div>
//               <div className="border rounded-md p-3">Black</div>
//             </CardContent>
//           </Card>

//           <Card className="shadow-sm border">
//             <CardHeader>
//               <CardTitle>Attributes & Variants</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex gap-2">
//                 <div className="border rounded-md p-2 w-full flex justify-between">
//                   Size <ChevronDown size={14} />
//                 </div>
//                 <div className="border rounded-md p-2 w-full">S , M</div>
//               </div>

//               <div className="flex gap-2">
//                 <div className="border rounded-md p-2 w-full">Color</div>
//                 <div className="border rounded-md p-2 w-full">+</div>
//               </div>

//               <div className="flex gap-2">
//                 <Button size="sm">+ Add Attribute</Button>
//                 <Button size="sm" variant="outline">Generate Variants</Button>
//               </div>

//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>SKU</TableHead>
//                     <TableHead>Variant</TableHead>
//                     <TableHead>Price</TableHead>
//                     <TableHead>Stock</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {variants.map((v, i) => (
//                     <TableRow key={i}>
//                       <TableCell>{v.size}{v.size}</TableCell>
//                       <TableCell>{v.size}-Black</TableCell>
//                       <TableCell>₹0</TableCell>
//                       <TableCell>0</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>

//               <p className="text-xs text-muted-foreground">
//                 No variants generated. Define attributes to create combinations.
//               </p>
//             </CardContent>
//           </Card>

//         </div>

//         {/* RIGHT */}
//         <div className="col-span-3">
//           <Card className="shadow-sm border">
//             <CardHeader>
//               <CardTitle>Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">

//               <div>
//                 <Label>Status</Label>
//                 <Select>
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder="Active" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="active">Active</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="text-sm">
//                 <p className="text-muted-foreground">Seller</p>
//                 <p className="font-medium">Manish</p>
//               </div>

//               <div className="text-sm">
//                 <p className="text-muted-foreground">Category</p>
//                 <p>Not set</p>
//               </div>

//               <div className="text-sm">
//                 <p className="text-muted-foreground">Last Updated</p>
//                 <p>Today</p>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span>Status</span>
//                 <Badge className="bg-green-500">Active</Badge>
//               </div>

//               <div className="flex gap-2 pt-2">
//                 <Button variant="outline" className="w-full">Save Draft</Button>
//                 <Button className="w-full bg-yellow-400 text-black">Publish Product</Button>
//               </div>

//             </CardContent>
//           </Card>
//         </div>

//       </div>
//     </div>
//   );
// }


// app/(seller)/seller/products/create/page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api/client";
// import { uploadImage } from "@/lib/api/admin/upload";

// /* ================= CATEGORY ================= */

// const CATEGORY_CONFIG: Record<string, string[]> = {
//   fashion: ["men", "women", "kids"],
//   electronics: ["audio", "mobile", "accessories"],
//   medical: ["devices", "essentials"],
//   grocery: ["fruits", "daily", "snacks"],
//   food: ["veg", "non-veg", "fast-food"],
// };

// /* ================= TYPES ================= */

// type Variant = {
//   name: string;
//   stock: number;
//   price?: number;
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
//   `${slugify(title).slice(0, 5)}-${slugify(name)}-${Date.now()
//     .toString()
//     .slice(-4)}`.toUpperCase();

// /* ================= PAGE ================= */

// export default function CreateProductPage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   /* BASIC */
//   const [title, setTitle] = useState("");
//   const [slug, setSlug] = useState("");
//   const [description, setDescription] = useState("");

//   /* CATEGORY */
//   const [category, setCategory] = useState("");
//   const [subCategory, setSubCategory] = useState("");

//   /* SCHEMA */
//   const [schema, setSchema] = useState<any>(null);

//   /* PRICE */
//   const [price, setPrice] = useState(0);

//   /* IMAGES */
//   const [images, setImages] = useState<ImageType[]>([]);

//   /* VARIANTS */
//   const [variants, setVariants] = useState<Variant[]>([
//     { name: "", stock: 0, price: 0, sku: "" },
//   ]);

//   /* ATTRIBUTES (OBJECT BASED) */
//   const [attributes, setAttributes] = useState<Record<string, any>>({});

//   /* ================= FETCH SCHEMA ================= */

//   useEffect(() => {
//     if (!category) return;

//     apiFetch(`/categories/schema/${category}`)
//       .then(setSchema)
//       .catch(() => setSchema(null));
//   }, [category]);

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
//     } finally {
//       setUploading(false);
//     }
//   };

//   const removeImage = (index: number) => {
//     setImages(images.filter((_, i) => i !== index));
//   };

//   /* ================= VARIANTS ================= */

//   const addVariant = () =>
//     setVariants([
//       ...variants,
//       { name: "", stock: 0, price: 0, sku: "" },
//     ]);

//   const updateVariant = (
//     i: number,
//     key: keyof Variant,
//     value: any
//   ) => {
//     const updated = [...variants];

//     updated[i] = { ...updated[i], [key]: value };

//     if (key === "name") {
//       updated[i].sku = generateSKU(title, value);
//     }

//     setVariants(updated);
//   };

//   const removeVariant = (i: number) =>
//     setVariants(variants.filter((_, index) => index !== i));

//   /* ================= VALIDATION ================= */

//   const validate = () => {
//     if (!title || !category) return "Title & category required";
//     if (!images.length) return "Upload images";
//     if (variants.some((v) => !v.name)) return "Variant missing";

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
//           description,
//           category,
//           subCategory,
//           price,
//           thumbnail: images[0]?.url,
//           images,
//           variants,
//           attributes,
//         }),
//       });

//       alert("Product Created 🚀");
//       router.push("/seller/products");
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="max-w-6xl mx-auto px-6 pt-24 pb-20">

//       <h1 className="text-3xl font-bold mb-6">
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
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         {/* CATEGORY */}
//         <div className="grid grid-cols-2 gap-6">
//           <select
//             value={category}
//             onChange={(e) => {
//               setCategory(e.target.value);
//               setSubCategory("");
//               setAttributes({});
//             }}
//             className="border px-4 py-3 rounded-lg"
//           >
//             <option value="">Select Category</option>
//             {Object.keys(CATEGORY_CONFIG).map((c) => (
//               <option key={c} value={c}>
//                 {c.toUpperCase()}
//               </option>
//             ))}
//           </select>

//           <select
//             value={subCategory}
//             onChange={(e) => setSubCategory(e.target.value)}
//             className="border px-4 py-3 rounded-lg"
//           >
//             <option value="">Sub Category</option>
//             {(CATEGORY_CONFIG[category] || []).map((sub) => (
//               <option key={sub} value={sub}>
//                 {sub}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* PRICE */}
//         <input
//           type="number"
//           placeholder="Base Price"
//           className="w-full border px-4 py-3 rounded-lg"
//           value={price}
//           onChange={(e) => setPrice(Number(e.target.value))}
//         />

//         {/* IMAGES */}
//         <div>
//           <input
//             type="file"
//             multiple
//             onChange={(e) =>
//               e.target.files && handleImageUpload(e.target.files)
//             }
//           />

//           {uploading && <p>Uploading...</p>}

//           <div className="grid grid-cols-4 gap-4 mt-4">
//             {images.map((img, i) => (
//               <div key={i} className="relative">
//                 <img src={img.url} className="h-28 w-full object-cover rounded" />
//                 <button
//                   type="button"
//                   onClick={() => removeImage(i)}
//                   className="absolute top-1 right-1 bg-black text-white px-2 text-xs"
//                 >
//                   X
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* VARIANTS */}
//         <div>
//           <h2 className="font-semibold mb-2">Variants</h2>

//           {variants.map((v, i) => (
//             <div key={i} className="grid grid-cols-4 gap-3 mb-3">
//               <input
//                 placeholder="Size / Weight / Type"
//                 value={v.name}
//                 onChange={(e) =>
//                   updateVariant(i, "name", e.target.value)
//                 }
//                 className="border px-3 py-2"
//               />

//               <input
//                 type="number"
//                 placeholder="Stock"
//                 value={v.stock}
//                 onChange={(e) =>
//                   updateVariant(i, "stock", Number(e.target.value))
//                 }
//                 className="border px-3 py-2"
//               />

//               <input
//                 type="number"
//                 placeholder="Price"
//                 value={v.price}
//                 onChange={(e) =>
//                   updateVariant(i, "price", Number(e.target.value))
//                 }
//                 className="border px-3 py-2"
//               />

//               <input
//                 value={v.sku}
//                 readOnly
//                 className="border px-3 py-2 bg-gray-100"
//               />

//               <button
//                 type="button"
//                 onClick={() => removeVariant(i)}
//                 className="col-span-4 bg-red-500 text-white py-1"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}

//           <button type="button" onClick={addVariant}>
//             + Add Variant
//           </button>
//         </div>

//         {/* DYNAMIC ATTRIBUTES */}
//         {schema && (
//           <div>
//             <h2 className="font-semibold mb-2">Product Details</h2>

//             {schema.fields.map((field: any, i: number) => {

//               if (field.type === "text") {
//                 return (
//                   <input
//                     key={i}
//                     placeholder={field.key}
//                     className="border px-3 py-2 w-full mb-3"
//                     onChange={(e) =>
//                       setAttributes((prev) => ({
//                         ...prev,
//                         [field.key]: e.target.value,
//                       }))
//                     }
//                   />
//                 );
//               }

//               if (field.type === "select") {
//                 return (
//                   <select
//                     key={i}
//                     className="border px-3 py-2 w-full mb-3"
//                     onChange={(e) =>
//                       setAttributes((prev) => ({
//                         ...prev,
//                         [field.key]: e.target.value,
//                       }))
//                     }
//                   >
//                     <option>{field.key}</option>
//                     {field.options?.map((opt: string) => (
//                       <option key={opt}>{opt}</option>
//                     ))}
//                   </select>
//                 );
//               }

//               if (field.type === "boolean") {
//                 return (
//                   <label key={i} className="block mb-3">
//                     <input
//                       type="checkbox"
//                       onChange={(e) =>
//                         setAttributes((prev) => ({
//                           ...prev,
//                           [field.key]: e.target.checked,
//                         }))
//                       }
//                     />
//                     {" "}{field.key}
//                   </label>
//                 );
//               }

//               return null;
//             })}
//           </div>
//         )}

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

// // // app/(seller)/seller/products/create/page.tsx

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api/client";
// import { uploadImage } from "@/lib/api/admin/upload";

// /* ================= CONFIG ================= */

// const CATEGORY_CONFIG: Record<string, string[]> = {
//   fashion: ["men", "women", "kids"],
//   electronics: ["audio", "mobile", "accessories"],
//   medical: ["devices", "essentials"],
//   grocery: ["fruits", "daily", "snacks"],
//   food: ["veg", "non-veg", "fast-food"],
// };

// /* ================= TYPES ================= */

// type Variant = {
//   name: string;
//   stock: number;
//   sku: string;
// };

// type Attribute = {
//   key: string;
//   value: string;
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
//   `${slugify(title).slice(0, 6)}-${slugify(name)}-${Date.now()
//     .toString()
//     .slice(-4)}`.toUpperCase();

// /* ================= PAGE ================= */

// export default function CreateProductPage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   /* BASIC */
//   const [title, setTitle] = useState("");
//   const [slug, setSlug] = useState("");
//   const [description, setDescription] = useState("");

//   /* CATEGORY */
//   const [category, setCategory] = useState("");
//   const [subCategory, setSubCategory] = useState("");

//   /* PRICING */
//   const [price, setPrice] = useState(0);

//   /* IMAGES */
//   const [images, setImages] = useState<ImageType[]>([]);

//   /* VARIANTS */
//   const [variants, setVariants] = useState<Variant[]>([
//     { name: "", stock: 0, sku: "" },
//   ]);

//   /* ATTRIBUTES (dynamic) */
//   const [attributes, setAttributes] = useState<Attribute[]>([]);

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
//     } finally {
//       setUploading(false);
//     }
//   };

//   /* ================= VARIANTS ================= */

//   const addVariant = () =>
//     setVariants([...variants, { name: "", stock: 0, sku: "" }]);

//   const updateVariant = (
//     i: number,
//     key: keyof Variant,
//     value: string | number
//   ) => {
//     const updated = [...variants];

//     updated[i] = { ...updated[i], [key]: value };

//     if (key === "name") {
//       updated[i].sku = generateSKU(title, value as string);
//     }

//     setVariants(updated);
//   };

//   const removeVariant = (i: number) =>
//     setVariants(variants.filter((_, index) => index !== i));

//   /* ================= ATTRIBUTES ================= */

//   const addAttribute = () =>
//     setAttributes([...attributes, { key: "", value: "" }]);

//   const updateAttribute = (
//     i: number,
//     key: keyof Attribute,
//     value: string
//   ) => {
//     const updated = [...attributes];
//     updated[i][key] = value;
//     setAttributes(updated);
//   };

//   const removeAttribute = (i: number) =>
//     setAttributes(attributes.filter((_, index) => index !== i));

//   /* ================= VALIDATION ================= */

//   const validate = () => {
//     if (!title || !category || !price)
//       return "Required fields missing";

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
//           description,
//           category,
//           subCategory,
//           price,
//           thumbnail: images[0]?.url,
//           images,
//           variants,
//           attributes,
//         }),
//       });

//       alert("Product Created 🚀");
//       router.push("/seller/products");

//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">

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
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         {/* CATEGORY */}
//         <div className="grid grid-cols-2 gap-6">
//           <select
//             value={category}
//             onChange={(e) => {
//               setCategory(e.target.value);
//               setSubCategory("");
//             }}
//             className="border px-4 py-3 rounded-lg"
//           >
//             <option value="">Select Category</option>
//             {Object.keys(CATEGORY_CONFIG).map((c) => (
//               <option key={c} value={c}>
//                 {c.toUpperCase()}
//               </option>
//             ))}
//           </select>

//           <select
//             value={subCategory}
//             onChange={(e) => setSubCategory(e.target.value)}
//             className="border px-4 py-3 rounded-lg"
//           >
//             <option value="">Sub Category</option>
//             {(CATEGORY_CONFIG[category] || []).map((sub) => (
//               <option key={sub} value={sub}>
//                 {sub}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* PRICE */}
//         <input
//           type="number"
//           placeholder="Price"
//           className="w-full border px-4 py-3 rounded-lg"
//           value={price}
//           onChange={(e) => setPrice(Number(e.target.value))}
//         />

//         {/* IMAGES */}
//         <div>
//           <input
//             type="file"
//             multiple
//             onChange={(e) =>
//               e.target.files && handleImageUpload(e.target.files)
//             }
//           />

//           {uploading && <p>Uploading...</p>}

//           <div className="grid grid-cols-4 gap-4 mt-4">
//             {images.map((img, i) => (
//               <img key={i} src={img.url} className="h-28 rounded object-cover" />
//             ))}
//           </div>
//         </div>

//         {/* VARIANTS */}
//         <div>
//           <h2 className="font-semibold mb-2">Variants</h2>

//           {variants.map((v, i) => (
//             <div key={i} className="flex gap-3 mb-3">
//               <input
//                 placeholder="Variant (e.g. Size M / 1kg)"
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
//                 value={v.sku}
//                 readOnly
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

//         {/* ATTRIBUTES */}
//         <div>
//           <h2 className="font-semibold mb-2">Attributes</h2>

//           {attributes.map((a, i) => (
//             <div key={i} className="flex gap-3 mb-3">
//               <input
//                 placeholder="Key (e.g. Color)"
//                 value={a.key}
//                 onChange={(e) =>
//                   updateAttribute(i, "key", e.target.value)
//                 }
//                 className="border px-3 py-2"
//               />

//               <input
//                 placeholder="Value (e.g. Red)"
//                 value={a.value}
//                 onChange={(e) =>
//                   updateAttribute(i, "value", e.target.value)
//                 }
//                 className="border px-3 py-2"
//               />

//               <button
//                 type="button"
//                 onClick={() => removeAttribute(i)}
//                 className="bg-red-500 text-white px-3"
//               >
//                 X
//               </button>
//             </div>
//           ))}

//           <button type="button" onClick={addAttribute}>
//             + Add Attribute
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