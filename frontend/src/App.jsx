import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Userpath from "./pages/LoginSignup";
import Home from "./pages/Home";
import ProductDisplay from "./pages/ProductDisplay";
import PrivateRoute from "./components/PrivateRoute";
import Cart from "./pages/Cart";
import History from "./pages/History";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <PrivateRoute>
                <ProductDisplay />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }/>

          <Route path="/user" element={<Userpath />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
