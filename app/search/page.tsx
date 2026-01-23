import { Suspense } from "react";

type SearchPageProps = {
  searchParams: {
    q?: string;
  };
};

function SearchResults({ query }: { query: string }) {
  // 🔮 Future mein yahin API call aayegi
  // const results = await fetch(`/api/search?q=${query}`)

  return (
    <div className="mt-6">
      <p className="text-gray-600 mb-4">
        Showing results for <span className="font-semibold">"{query}"</span>
      </p>

      {/* Dummy Results */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="h-40 bg-gray-100 rounded mb-3"></div>
            <h3 className="font-medium text-gray-800">
              Sample Product {item}
            </h3>
            <p className="text-sm text-gray-600">₹999</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() || "";

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
        <Suspense fallback={<p className="mt-6">Loading results...</p>}>
          <SearchResults query={query} />
        </Suspense>
      )}
    </div>
  );
}
