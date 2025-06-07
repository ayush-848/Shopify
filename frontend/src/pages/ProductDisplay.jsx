import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Products from '../components/Products';
import UserApiServices from '../services/UserApiServices';

const ProductDisplay = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setMessage('');
        setLoading(true);

        const rawProducts = await UserApiServices.getAllProducts();

        // Fetch quantities in parallel
        const enrichedProducts = await Promise.all(
          rawProducts.map(async (p) => {
            let quantity = 0;
            try {
              const q = await UserApiServices.getQuantity(p.pid);
              quantity = q?.quantity || 0;
            } catch (err) {
              console.warn(`No quantity found for pid ${p.pid}`);
            }

            const mapped = {
              id: p.pid,
              name: p.pname,
              quantity,
              ...p,
            };

            console.log('Mapped Product:', mapped);
            return mapped;
          })
        );

        setProducts(enrichedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleAddToCart = (product) => {
    setMessage(`Added ${product.name} to cart!`);
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar username="User" onLogout={() => {}} />
      <div className="max-w-5xl mx-auto pt-28 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Products</h2>

        {message && (
          <div className="mb-4 text-green-600 font-medium text-center">{message}</div>
        )}

        {loading ? (
          <div className="text-center text-gray-500">Loading products...</div>
        ) : (
          <Products products={products} onAddToCart={handleAddToCart} />
        )}
      </div>
    </div>
  );
};

export default ProductDisplay;
