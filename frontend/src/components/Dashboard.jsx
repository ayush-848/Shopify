import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UserApiServices from '../services/UserApiServices';
import AlertMessage from '../utils/AlertMessage';

import { Users, Box, UserCog } from "lucide-react";
import '../index.css';

function Dashboard({ refreshTrigger }) {
  const [customerCount, setCustomerCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { user } = useAuth();

  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      clearMessages();
      try {
        const customerRes = await UserApiServices.getCustomerCount();
        setCustomerCount(customerRes?.count ?? 0);

        const productRes = await UserApiServices.getProductCount();
        setProductCount(productRes?.count ?? 0);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
          err?.message ||
          'Failed to fetch dashboard data.'
        );
      }
    };

    fetchDashboardData();
    // eslint-disable-next-line
  }, [user,refreshTrigger]);

  const roleLabel = user?.roleId === 1 ? 'User' : 'Admin';

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-lg bg-white shadow rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Dashboard Overview</h2>
        <AlertMessage message={error} type="error" />
        <AlertMessage message={message} type="success" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
          <div className="bg-blue-50 p-4 rounded flex flex-col items-center border border-blue-100">
            <Users className="text-blue-700 mb-1" size={28} />
            <h3 className="text-sm font-semibold text-blue-700 mb-0.5">Total Customers</h3>
            <p className="text-2xl font-bold text-blue-800">{customerCount}</p>
          </div>
          <div className="bg-green-50 p-4 rounded flex flex-col items-center border border-green-100">
            <Box className="text-green-700 mb-1" size={28} />
            <h3 className="text-sm font-semibold text-green-700 mb-0.5">Total Products</h3>
            <p className="text-2xl font-bold text-green-800">{productCount}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded flex flex-col items-center border border-purple-100">
            <UserCog className="text-purple-700 mb-1" size={28} />
            <h3 className="text-sm font-semibold text-purple-700 mb-0.5">Your Role</h3>
            <p className="text-2xl font-bold text-purple-800 capitalize">{roleLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;