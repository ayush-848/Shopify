import { createContext, useContext, useState, useEffect, useCallback } from "react";
import UserApiServices from "../services/UserApiServices";
import { AuthContext } from "./AuthContext";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const USER_ID = user?._id;

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!USER_ID) return;

    setLoading(true);
    setError(null);
    try {
      const data = await UserApiServices.getCart(USER_ID);
      const items = Array.isArray(data.items) ? data.items : [];
      setCart(items);
    } catch (err) {
      setError("Failed to fetch cart.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [USER_ID]);

  useEffect(() => {
    if (USER_ID) {
      fetchCart();
    }
  }, [USER_ID, fetchCart]);

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart, loading, error }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);
export { CartProvider, useCart };
