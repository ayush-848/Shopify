import React, { useState, useContext } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import UserApiServices from "../services/UserApiServices";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CardContext";

// Card for each product
function ProductCard({ product, showQty, qty, onAddToCart, onIncrement, onDecrement }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
      <div className="flex flex-col h-full">
        <div className="flex-1 mb-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900 leading-tight">{product.name}</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <ShoppingCart size={18} className="text-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 font-medium">ID: {product.id}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Stock:</span>
              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                product.quantity > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}>
                {product.quantity}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          {!showQty ? (
            <button
              onClick={onAddToCart}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                product.quantity === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
              }`}
              disabled={product.quantity === 0}
            >
              <ShoppingCart size={16} />
              {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 mb-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={onDecrement}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all duration-200 active:scale-95"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} className="text-red-600" />
                </button>
                <div className="flex-1 text-center">
                  <span className="text-lg font-bold text-gray-900">{qty}</span>
                  <p className="text-xs text-gray-500 font-medium">in cart</p>
                </div>
                <button
                  onClick={onIncrement}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-200 active:scale-95 bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300 text-green-600"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Products Grid
function Products({ products }) {
  const { user } = useContext(AuthContext);
  const USER_ID = user ? user._id : null;

  const [selection, setSelection] = useState({});
  const { cart, setCart } = useCart();
  // Handlers for each card
  const handleAddToCart = (id) => {
    setSelection(prev => ({
      ...prev,
      [id]: { showQty: true, qty: 1 }
    }));
  };

  const handleIncrement = (id) => {
    setSelection(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        qty: prev[id].qty + 1
      }
    }));
  };

  const handleDecrement = (id) => {
    setSelection(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        qty: prev[id].qty > 1 ? prev[id].qty - 1 : 1
      }
    }));
  };

  // FAB logic
  const selectedItems = products
    .filter(p => selection[p.id]?.showQty)
    .map(p => ({
      ...p,
      qty: selection[p.id]?.qty || 1
    }));

  const anySelected = selectedItems.length > 0;
  const totalQty = selectedItems.reduce((sum, item) => sum + item.qty, 0);

  const handleFabClick = async () => {
    if (!USER_ID) {
      alert("Please log in to add to cart.");
      return;
    }
    try {
      // Add each selected item to the cart in the backend
      await Promise.all(
        selectedItems.map(item =>
          UserApiServices.addToCart({
            userId: USER_ID,
            productId: item.id,
            name: item.name,
            quantity: item.qty,
          })
        )
      );
      alert("Cart updated!");
    } catch (err) {
      alert("Failed to update cart.");
      console.error(err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showQty={selection[product.id]?.showQty}
              qty={selection[product.id]?.qty || 1}
              onAddToCart={() => handleAddToCart(product.id)}
              onIncrement={() => handleIncrement(product.id)}
              onDecrement={() => handleDecrement(product.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={24} className="text-blue-600" />
            </div>
            <p className="text-gray-600 text-lg font-medium">No products available</p>
            <p className="text-gray-500 text-sm mt-1">Check back later for new items</p>
          </div>
        )}
      </div>
      {anySelected && (
        <button
          onClick={handleFabClick}
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 32,
            zIndex: 1000,
            background: "#2563eb",
            color: "#fff",
            borderRadius: "50%",
            width: 64,
            height: 64,
            fontSize: 28,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-label="Check your cart"
        >
          <ShoppingCart size={28} style={{ marginRight: 8 }} />
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            {totalQty}
          </span>
        </button>
      )}
    </>
  );
}

export default Products;