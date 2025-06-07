import React from "react";
import { ShoppingCart } from "lucide-react";

// Card for each product
function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col items-center text-center transition hover:shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-1">Product ID: <span className="font-medium text-gray-600">{product.id}</span></p>
      <p className="text-base text-gray-700 mb-4">Available: {product.quantity!==0?(<span className="font-semibold text-green-500">{product.quantity}</span>):(<span className="text-red-500 font-semibold">{product.quantity}</span>)}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        <ShoppingCart size={18} /> Add to Cart
      </button>
    </div>
  );
}

// Main Products Grid
function Products({ products, onAddToCart }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products && products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500 text-lg font-medium">
          No products available at the moment.
        </div>
      )}
    </div>
  );
}

export default Products;
