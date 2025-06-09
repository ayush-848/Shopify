import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import Products from '../components/Products';
import UserApiServices from '../services/UserApiServices';
import { Link } from 'react-router-dom';
import { CartProvider } from '../context/CardContext';
import { AuthContext } from '../context/AuthContext';



const ProductDisplay = () => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        const getProducts = async () => {
            try {
                setMessage('');
                setLoading(true);

                const rawProducts = await UserApiServices.getAllProducts();

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
                        return mapped;
                    })
                );

                setProducts(enrichedProducts);
            } catch (err) {
                console.error('Error fetching products:', err);
                setMessage('Failed to load products. Please try again later.');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    return (
        // <CartProvider> now wraps the content that needs the cart state
        <CartProvider>
            <div className="min-h-screen bg-gray-100">
                <Navbar username="User" onLogout={logout} />
                <div className="max-w-5xl mx-auto pt-28 px-4">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Products</h2>

                    {message && (
                        <div className="mb-4 text-green-600 font-medium text-center">{message}</div>
                    )}

                    {loading ? (
                        <div className="text-center text-gray-500">Loading products...</div>
                    ) : (
                        <Products products={products} />
                    )}

                    <div className="mt-8 text-center">
                        <Link
                            to="/cart"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                        >
                            Go to Cart
                        </Link>
                    </div>
                </div>
            </div>
        </CartProvider>
    );
};

export default ProductDisplay;