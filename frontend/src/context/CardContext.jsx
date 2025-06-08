import { createContext, useContext, useState, useEffect } from "react";
import UserApiServices from "../services/UserApiServices";
import { AuthContext } from "./AuthContext";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const USER_ID = user ? user._id : null;

  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function fetchCart() {
      if (!USER_ID) return;
      try {
        const data = await UserApiServices.getCart(USER_ID);
        setCart(Array.isArray(data.items) ? data.items : []);
        console.log("Cart state updated:", Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    }
    fetchCart();
  }, [USER_ID]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);
export { CartProvider, useCart };