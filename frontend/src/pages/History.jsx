import React, { useState, useEffect } from 'react';
import { Package, Calendar, CheckCircle, Hash, ShoppingBag, Clock } from 'lucide-react';
import UserApiServices from '../services/UserApiServices';
import Navbar from '../components/Navbar';

const History = () => {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await UserApiServices.getOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar /> {/* Navbar visible during loading */}
        <div className="flex justify-center items-center h-[calc(100vh-64px)]"> {/* Adjust height for Navbar */}
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-xl font-medium text-gray-700">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    let errorMessage = 'Failed to load orders';
    let errorTitle = 'Error Loading Orders';
    if (error.response && error.response.status === 404) {
      errorMessage = 'It seems you haven\'t placed any orders yet.';
      errorTitle = 'No Orders Found';
    } else if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar /> {/* Navbar visible during error */}
        <div className="flex justify-center items-center h-[calc(100vh-64px)]"> {/* Adjust height for Navbar */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">{errorTitle}</h3>
            <p className="text-gray-600">{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-lg text-gray-600">Track your purchase history and order details</p>
        </div>

        {orders && orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order, index) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">Order #{index + 1}</h3>
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <Hash className="h-3 w-3" />
                          <span className="font-mono text-sm">{order._id}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <ShoppingBag className="h-3 w-3" />
                        <span className="font-semibold">{order.totalItems} items</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mt-2">
                    <Calendar className="h-3 w-3" />
                    <span className="font-semibold text-blue-700">{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Package className="h-4 w-4 mr-2 text-gray-600" />
                    Items Purchased
                  </h4>
                  
                  {order.items && order.items.length > 0 ? (
                    <div className="grid gap-2">
                      {order.items.map((item, itemIndex) => (
                        <div key={item._id || itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center shadow-sm border border-gray-200">
                              <Package className="h-3 w-3 text-gray-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 text-sm">{item.pname}</h5>
                              <p className="text-gray-600 text-xs font-mono">ID: {item.pid}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md font-bold text-xs">
                              Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Package className="h-7 w-7 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No items found for this order</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Found</h3> {/* Changed h1 to h3 */}
            <p className="text-gray-600 text-lg mb-8">It seems you haven't placed any orders yet. Let's fix that!</p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;