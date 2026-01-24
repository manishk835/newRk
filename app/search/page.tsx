import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/components/product/product.types";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

async function searchProducts(query: string): Promise<Product[]> {
  const res = await fetch(
    `http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  return res.json();
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const products = query
    ? await searchProducts(query)
    : [];

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold mb-4">
        Search Results
      </h1>

      {!query ? (
        <p>Please enter a search term.</p>
      ) : products.length === 0 ? (
        <p>
          No results found for{" "}
          <b>"{query}"</b>
        </p>
      ) : (
        <>
          <p className="mb-4 text-gray-600">
            Showing results for{" "}
            <b>"{query}"</b>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
