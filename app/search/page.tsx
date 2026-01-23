import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/components/product/product.types";

type SearchParams = {
  q?: string | string[];
};

type SearchPageProps = {
  searchParams: Promise<SearchParams>;
};

const DUMMY_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Men Cotton Kurta",
    slug: "men-cotton-kurta",
    price: 899,
    originalPrice: 1299,
    image: "https://via.placeholder.com/400",
    category: "men",
    inStock: true,
  },
  {
    id: "2",
    title: "Women Floral Kurti",
    slug: "women-floral-kurti",
    price: 1099,
    image: "https://via.placeholder.com/400",
    category: "women",
    inStock: true,
  },
];

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  // ✅ UNWRAP PROMISE (THIS IS THE FIX)
  const { q } = await searchParams;

  const query =
    typeof q === "string"
      ? q.trim()
      : Array.isArray(q)
      ? q[0]?.trim()
      : "";

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold text-gray-800">
        Search Results
      </h1>

      {!query ? (
        <p className="mt-4 text-gray-600">
          Please enter a search term to see results.
        </p>
      ) : (
        <>
          <p className="mt-4 text-gray-600">
            Showing results for{" "}
            <span className="font-semibold">"{query}"</span>
          </p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {DUMMY_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
