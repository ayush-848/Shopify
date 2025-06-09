import { LogOut, ShoppingCart, History, Store, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CardContext";

function Navbar({ username, onLogout }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { cart } = useCart();
  let totalQuantity = 0;
  console.log("Cart items in Navbar:", cart);
  cart.forEach((item) => {
    totalQuantity += item.quantity;
});


  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="flex items-center cursor-pointer space-x-2" onClick={() => navigate("/")}>
        <span className="text-base text-gray-500">Welcome,</span>
        <span className="font-bold text-indigo-700 text-lg">{user?.username}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 cursor-pointer text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium focus:outline-none"
        >
          <Home size={18} /> <span>Home</span>
        </button>
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 px-4 py-2 cursor-pointer text-indigo-700 hover:bg-indigo-50 rounded-lg transition font-medium focus:outline-none"
        >
          <Store size={18} /> <span>Shop</span>
        </button>

        <button 
          type="button" 
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 rounded-lg transition font-medium focus:outline-none focus:ring-4 focus:ring-yellow-300 relative"
        >
          <ShoppingCart size={18} />
          <span>Cart</span>
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-yellow-600 bg-white rounded-full">
            {totalQuantity}
          </span>
        </button>

        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 px-4 py-2 cursor-pointer text-yellow-700 hover:bg-yellow-50 rounded-lg transition font-medium focus:outline-none"
        >
          <History size={18} /> <span>History</span>
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 cursor-pointer text-red-700 hover:bg-red-50 rounded-lg transition font-medium focus:outline-none"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;