"use client";

import ProductForm from "../components/ProductForm";

export default function CreateProductPage() {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6 transition-colors duration-300">

      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>

          <h1 className="text-2xl font-bold text-black dark:text-white">
            Create Product
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Add a new product to your store
          </p>

        </div>

        {/* FORM */}
        <ProductForm />

      </div>

    </div>
  );
}

// // app/(seller)/seller/products/create/page.tsx

// "use client";

// import ProductForm from "../components/ProductForm";
// import { ProductProvider } from "../context/ProductContext";

// export default function CreateProductPage() {
//   return (
//     <ProductProvider>
//       <div className="min-h-screen bg-gray-50 p-6">
//         <ProductForm />
//       </div>
//     </ProductProvider>
//   );
// }