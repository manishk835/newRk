export default function CategoryFilters() {
    return (
      <div className="space-y-10 sticky top-28">
  
        {/* CATEGORIES */}
        <div>
          <h3 className="font-semibold mb-4">CATEGORIES</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <label className="flex gap-2">
              <input type="checkbox" /> Cotton Shirts
            </label>
            <label className="flex gap-2">
              <input type="checkbox" /> Denim Shirts
            </label>
            <label className="flex gap-2">
              <input type="checkbox" /> Relaxed Shirts
            </label>
          </div>
        </div>
  
        {/* SIZE */}
        <div>
          <h3 className="font-semibold mb-4">SIZE</h3>
          <div className="flex flex-wrap gap-2">
            {["XS","S","M","L","XL","XXL"].map(size => (
              <button
                key={size}
                className="border px-3 py-1 text-sm rounded hover:bg-black hover:text-white"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
  
        {/* PRICE */}
        <div>
          <h3 className="font-semibold mb-4">PRICE</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <label className="flex gap-2">
              <input type="radio" name="price" /> ₹699 – ₹1099
            </label>
            <label className="flex gap-2">
              <input type="radio" name="price" /> ₹1100 – ₹1499
            </label>
            <label className="flex gap-2">
              <input type="radio" name="price" /> ₹1500 – ₹1999
            </label>
          </div>
        </div>
  
      </div>
    );
  }
  