"use client";

import ProductForm from "../components/ProductForm";

export default function CreateProductPage() {
  return (
    
    <div className="min-h-screen bg-gray-50 p-6">
      <ProductForm />
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