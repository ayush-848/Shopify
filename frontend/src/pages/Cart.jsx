import React, { useState, useContext, useEffect } from "react";
import { useCart } from "../context/CardContext";
import Navbar from "../components/Navbar";
import UserApiServices from "../services/UserApiServices";
import { AuthContext } from "../context/AuthContext";
import { Trash2 } from "lucide-react";

function Cart() {
  const { user, logout, loading: userLoading } = useContext(AuthContext);
  const { cart, setCart, fetchCart } = useCart(); // Added fetchCart
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
        userId: user._id,
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
    setUpdating(true);
    try {
      await UserApiServices.checkout(user._id);
      setCart([]);
      alert("Checkout successful!");
    } catch (err) {
      alert("Checkout failed.");
    }
    setUpdating(false);
  };

  return (
    <div>
      <Navbar onLogout={logout} />
      <div className="mb-20">
        <div style={{ padding: 32 }}>
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {cartArray?.length === 0 ? (
            <div className="text-gray-500">Your cart is empty.</div>
          ) : (
            <>
              <ul>
                {cartArray?.map((item) => (
                  <li
                    key={item.productId}
                    className="mb-4 flex items-center gap-4"
                  >
                    <span className="font-semibold">Product:</span> {item.name}
                    <span className="font-semibold ml-4">Quantity:</span>
                    <button
                      onClick={() => handleChange(item.productId, -1)}
                      disabled={quantities[item.productId] <= 1 || updating}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span className="mx-2">{quantities[item.productId]}</span>
                    <button
                      onClick={() => handleChange(item.productId, 1)}
                      disabled={updating}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleConfirm(item.productId)}
                      disabled={updating}
                      className="ml-4 px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleDelete(item.productId)}
                      disabled={updating}
                      className="ml-4 p-1 text-red-600 hover:text-red-800"
                      aria-label={`Delete ${item.name} from cart`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleCheckout}
                disabled={updating}
                className="mt-8 px-6 py-3 bg-green-600 text-white rounded font-bold"
              >
                Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;