import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/components/product/product.types";

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

async function getCategoryProducts(category: string): Promise<Product[]> {
  const res = await fetch(
    `http://localhost:5000/api/products/category/${category}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  return res.json();
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  const products = await getCategoryProducts(category);

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {category} Collection
      </h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
