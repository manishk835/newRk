import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/components/product/product.types";

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:5000/api/products", {
    cache: "no-store",
  });

  return res.json();
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <h1 className="text-3xl font-bold mb-6">
        New Arrivals
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
