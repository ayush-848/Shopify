import React, { useState, useContext, useEffect } from "react";
import { useCart } from "../context/CardContext";
import Navbar from "../components/Navbar";
import UserApiServices from "../services/UserApiServices";
import { AuthContext } from "../context/AuthContext";
import { Trash2, AlertCircle } from "lucide-react";

function Cart() {
  const { user, logout, loading: userLoading } = useContext(AuthContext);
  const { cart, setCart, fetchCart } = useCart();
  const cartArray = Array.isArray(cart) ? cart : [];

  // Local state for editing quantities
  const [quantities, setQuantities] = useState({});
  const [updating, setUpdating] = useState(false);

  // Fetch cart data when component mounts
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  // Initialize quantities when cart changes
  useEffect(() => {
    if (!user || !cartArray.length) return;
    setQuantities(
      cartArray.reduce((acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
      }, {})
    );
  }, [cartArray, user]);

  // Check if any quantities have pending changes
  const hasPendingChanges = () => {
    return cartArray.some(item => 
      quantities[item.productId] !== item.quantity
    );
  };

  // Get items with pending changes
  const getPendingItems = () => {
    return cartArray.filter(item => 
      quantities[item.productId] !== item.quantity
    );
  };

  // Show loading while user data is loading
  if (userLoading) {
    return (
      <div className="p-8 text-center text-lg font-semibold">
        Loading user info...
      </div>
    );
  }

  // Show login prompt if no user
  if (!user) {
    return (
      <div className="p-8 text-center text-lg font-semibold">
        Please log in to view your cart.
      </div>
    );
  }

  const handleChange = (productId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  const handleConfirm = async (productId) => {
    setUpdating(true);
    try {
      const newQty = quantities[productId];
      await UserApiServices.updateCartItem({
        productId,
        quantity: newQty,
      });
      setCart((prev) =>
        prev.map((i) =>
          i.productId === productId ? { ...i, quantity: newQty } : i
        )
      );
      alert("Cart updated!");
    } catch (err) {
      alert("Failed to update cart.");
    }
    setUpdating(false);
  };

  const handleDelete = async (productId) => {
    setUpdating(true);
    try {
      await UserApiServices.removeFromCart({
        userId: user._id,
        pid: productId,
      });
      setCart((prev) => prev.filter((i) => i.productId !== productId));
      alert("Item removed from cart.");
    } catch (err) {
      alert("Failed to remove item from cart.");
    }
    setUpdating(false);
  };

  const handleCheckout = async () => {
    if (cartArray.length === 0) return;
    
    // Check for pending changes before checkout
    if (hasPendingChanges()) {
      alert("Please confirm all quantity changes before checkout!");
      return;
    }

    setUpdating(true);
    try {
      const response = await UserApiServices.checkout();
      setCart([]);
      alert("Checkout successful!");
    } catch (err) {
      const errorMessage = err.status === 400 ? 
        err.response?.data?.displayMessage : 
        err.response?.data?.message || "Checkout failed. Please try again.";
      alert(errorMessage);
    }
    setUpdating(false);
  };

  return (
    <div>
      <Navbar onLogout={logout} />
      <div className="mb-20">
        <div style={{ padding: 32 }}>
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          
          {/* Warning banner for pending changes */}
          {hasPendingChanges() && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-yellow-600" size={20} />
              <div>
                <p className="text-yellow-800 font-semibold">Pending Changes</p>
                <p className="text-yellow-700 text-sm">
                  You have unconfirmed quantity changes. Click "Confirm" to save changes before checkout.
                </p>
              </div>
            </div>
          )}

          {cartArray?.length === 0 ? (
            <div className="text-gray-500">Your cart is empty.</div>
          ) : (
            <>
              <ul>
                {cartArray?.map((item) => {
                  const hasChanges = quantities[item.productId] !== item.quantity;
                  return (
                    <li
                      key={item.productId}
                      className={`mb-4 p-4 rounded-lg border-2 transition-all ${
                        hasChanges 
                          ? 'border-yellow-300 bg-yellow-50' 
                          : 'border-gray-200 bg-white'
                      } flex items-center gap-4`}
                    >
                      <span className="font-semibold">Product:</span> {item.name}
                      <span className="font-semibold ml-4">Quantity:</span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleChange(item.productId, -1)}
                          disabled={quantities[item.productId] <= 1 || updating}
                          className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 hover:text-slate-900 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                          -
                        </button>
                        
                        <div className="flex flex-col items-center min-w-[60px]">
                          <span className={`mx-2 font-semibold text-lg ${hasChanges ? 'text-blue-600' : 'text-slate-800'}`}>
                            {quantities[item.productId]}
                          </span>
                          {hasChanges && (
                            <span className="text-xs text-slate-500">
                              (was {item.quantity})
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleChange(item.productId, 1)}
                          disabled={updating}
                          className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 hover:text-slate-900 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleConfirm(item.productId)}
                        disabled={updating || !hasChanges}
                        className={`ml-4 px-3 py-1 rounded font-medium ${
                          hasChanges
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {hasChanges ? 'Confirm' : 'Confirmed'}
                      </button>

                      <button
                        onClick={() => handleDelete(item.productId)}
                        disabled={updating}
                        className="ml-4 p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                        aria-label={`Delete ${item.name} from cart`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </li>
                  );
                })}
              </ul>
              
              <button
                onClick={handleCheckout}
                disabled={updating || hasPendingChanges()}
                className={`mt-8 px-6 py-3 rounded font-bold transition-all ${
                  hasPendingChanges()
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
                title={hasPendingChanges() ? 'Please confirm all changes before checkout' : ''}
              >
                {hasPendingChanges() ? 'Confirm Changes First' : 'Checkout'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;