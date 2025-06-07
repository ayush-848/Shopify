import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UserApiServices from '../services/UserApiServices';
import AlertMessage from '../utils/AlertMessage';
import RadioButtonGroup from '../components/RadioButtonGroup';
import Tabs from '../components/Tabs';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import { Search, PlusCircle, RefreshCcw, User, Package, Boxes, Hash, ArrowUpDown } from "lucide-react";
import '../index.css';

function Home() {
  const [activeTab, setActiveTab] = useState('find');
  const [cid, setCid] = useState('');
  const [pid, setPid] = useState('');
  const [cname, setCname] = useState('');
  const [pname, setPname] = useState('');
  const [newCname, setNewCname] = useState('');
  const [newPname, setNewPname] = useState('');
  const [updateCid, setUpdateCid] = useState('');
  const [updatePid, setUpdatePid] = useState('');
  const [updateCname, setUpdateCname] = useState('');
  const [updatePname, setUpdatePname] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchType, setSearchType] = useState('customer');
  const [updateType, setUpdateType] = useState('customer');
  const [addType, setAddType] = useState('customer');
  const [isFetchedForUpdate, setIsFetchedForUpdate] = useState(false);
  const [quantityPid, setQuantityPid] = useState('');
  const [quantityValue, setQuantityValue] = useState('');
  const [fetchedQuantity, setFetchedQuantity] = useState(null);
  const [fetchedProductName, setFetchedProductName] = useState('');
  const [dashboardRefreshTrigger, setDashboardRefreshTrigger] = useState(0);

  const { logout, user } = useAuth();

  const ACCESS_DENIED_MESSAGE = "Unauthorized: This operation requires Administrator privileges.";

  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  useEffect(() => {
    clearMessages();
    setCid('');
    setPid('');
    setCname('');
    setPname('');
    setNewCname('');
    setNewPname('');
    setUpdateCid('');
    setUpdatePid('');
    setUpdateCname('');
    setUpdatePname('');
    setIsFetchedForUpdate(false);
  }, [activeTab]);

  useEffect(() => {
    clearMessages();
    setCid('');
    setPid('');
    setCname('');
    setPname('');
  }, [searchType]);

  useEffect(() => {
    clearMessages();
    setNewCname('');
    setNewPname('');
  }, [addType]);

  useEffect(() => {
    clearMessages();
    setUpdateCid('');
    setUpdatePid('');
    setUpdateCname('');
    setUpdatePname('');
    setIsFetchedForUpdate(false);
  }, [updateType]);

  // Clear quantity tab state when switching tabs
  useEffect(() => {
    setQuantityPid('');
    setQuantityValue('');
    setFetchedQuantity(null);
    setFetchedProductName('');
    setError('');
    setMessage('');
  }, [activeTab]);

  const handleFind = async () => {
    clearMessages();
    setCname('');
    setPname('');

    try {
      if (searchType === 'customer') {
        if (!cid) {
          setError('Please enter a valid Customer ID');
          return;
        }
        const fetchedCname = await UserApiServices.getCustomerName(cid);
        setCname(fetchedCname);
      } else {
        if (!pid) {
          setError('Please enter a valid Product ID');
          return;
        }
        const fetchedPname = await UserApiServices.getProductName(pid);
        setPname(fetchedPname);
      }
    } catch (err) {
      setError(err.response?.data?.error || ` ${searchType === 'customer' ? 'Customer' : 'Product'} does not exist.`);
    }
  };

  const handleAdd = async () => {
    clearMessages();
    if (user?.roleId === 1) {
      setError(ACCESS_DENIED_MESSAGE);
      return;
    }

    try {
      if (addType === 'customer') {
        if (!newCname) {
          setError('Please enter Customer Name');
          return;
        }
        const msg = await UserApiServices.addCustomer(newCname);
        setMessage(msg);
        setNewCname('');
      } else {
        if (!newPname) {
          setError('Please enter Product Name');
          return;
        }
        const msg = await UserApiServices.addProduct(newPname);
        setMessage(msg);
        setNewPname('');
      }
      setDashboardRefreshTrigger(prev => prev + 1);
      setTimeout(clearMessages, 3000);
    } catch (err) {
      setError(err.response?.data?.error || `Error adding ${addType === 'customer' ? 'customer' : 'product'}.`);
    }
  };

  const fetchForUpdate = async () => {
    clearMessages();
    if (user?.roleId === 1) {
      setError(ACCESS_DENIED_MESSAGE);
      setIsFetchedForUpdate(false);
      return;
    }

    setIsFetchedForUpdate(false);
    if (updateType === 'customer') {
      setUpdateCname('');
    } else {
      setUpdatePname('');
    }

    try {
      if (updateType === 'customer') {
        if (!updateCid) {
          setError('Please enter a Customer ID to fetch.');
          return;
        }
        const fetchedCname = await UserApiServices.getCustomerName(updateCid);
        setUpdateCname(fetchedCname);
      } else {
        if (!updatePid) {
          setError('Please enter a Product ID to fetch.');
          return;
        }
        const fetchedPname = await UserApiServices.getProductName(updatePid);
        setUpdatePname(fetchedPname);
      }
      setIsFetchedForUpdate(true);
    } catch (err) {
      setError(err.response?.data?.error || `${updateType === 'customer' ? 'Customer' : 'Product'} does not exist.`);
      if (updateType === 'customer') {
        setUpdateCname('');
      } else {
        setUpdatePname('');
      }
      setIsFetchedForUpdate(false);
    }
  };

  const handleUpdate = async () => {
    clearMessages();
    if (user?.roleId === 1) {
      setError(ACCESS_DENIED_MESSAGE);
      return;
    }

    try {
      if (updateType === 'customer') {
        if (!updateCid || !updateCname.trim()) {
          setError('Customer name is required for update. Name cannot be empty.');
          return;
        }
        const msg = await UserApiServices.updateCustomer(updateCid, updateCname.trim());
        setMessage(msg);
        setUpdateCid('');
        setUpdateCname('');
      } else {
        if (!updatePid || !updatePname.trim()) {
          setError('Product name is required for update. Name cannot be empty.');
          return;
        }
        const msg = await UserApiServices.updateProduct(updatePid, updatePname.trim());
        setMessage(msg);
        setUpdatePid('');
        setUpdatePname('');
      }
      setIsFetchedForUpdate(false);
      setDashboardRefreshTrigger(prev => prev + 1);
      setTimeout(clearMessages, 3000);
    } catch (err) {
      setError(err.response?.data?.error || `Error updating ${updateType === 'customer' ? 'customer' : 'product'}.`);
    }
  };

  // Add tab for quantity
  const tabOptions = [
    {
      id: 'find',
      label: (
        <span className="flex items-center justify-center gap-2 text-blue-700 font-semibold group-hover:text-blue-800 transition">
          <Search size={20} className="text-blue-600" />
          <span>Find</span>
        </span>
      ),
    },
    {
      id: 'add',
      label: (
        <span className="flex items-center justify-center gap-2 text-green-700 font-semibold group-hover:text-green-800 transition">
          <PlusCircle size={20} className="text-green-600" />
          <span>Add</span>
        </span>
      ),
    },
    {
      id: 'update',
      label: (
        <span className="flex items-center justify-center gap-2 text-yellow-700 font-semibold group-hover:text-yellow-800 transition">
          <RefreshCcw size={20} className="text-yellow-600" />
          <span>Update</span>
        </span>
      ),
    },
    {
      id: 'quantity',
      label: (
        <span className="flex items-center justify-center gap-2 text-purple-700 font-semibold group-hover:text-purple-800 transition">
          <Boxes size={20} className="text-purple-600" />
          <span>Quantity</span>
        </span>
      ),
    },
  ];

  const entityTypeOptions = [
    { label: <span className="flex items-center gap-1"><User size={16} />Customer</span>, value: 'customer' },
    { label: <span className="flex items-center gap-1"><Package size={16} />Product</span>, value: 'product' },
  ];

  const handleFetchQuantity = async () => {
    setError('');
    setMessage('');
    if (user?.roleId === 1) {
      setError(ACCESS_DENIED_MESSAGE);
      return;
    }
    else{
      setFetchedQuantity(null);
    setFetchedProductName(''); // <-- Reset product name
    if (!quantityPid) {
      setError('Please enter a Product ID');
      return;
    }
    try {
      const res = await UserApiServices.getQuantity(quantityPid);
      setFetchedQuantity(res.quantity);
      setQuantityValue(res.quantity);
      setFetchedProductName(res.pname || ''); // <-- Set product name
      setMessage('Quantity fetched successfully');
    } catch (err) {
      setFetchedQuantity(null);
      setFetchedProductName('');
      setError(err.response?.data?.message || 'Error fetching quantity');
    }
    }
  };

  const handleUpdateQuantity = async () => {
    setError('');
    setMessage('');
    if (!quantityPid) {
      setError('Please enter a Product ID');
      return;
    }
    if (quantityValue === '' || isNaN(Number(quantityValue))) {
      setError('Please enter a valid quantity');
      return;
    }
    try {
      await UserApiServices.updateQuantity(quantityPid, Number(quantityValue));
      setMessage('Quantity updated successfully');
      setFetchedQuantity(Number(quantityValue));
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating quantity');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar username={user?.username} onLogout={logout} />
      <main className="flex flex-col items-center w-full flex-1 px-2 py-8 pt-24">
        <section className="w-full max-w-4xl mb-8">
          <Dashboard refreshTrigger={dashboardRefreshTrigger} />
        </section>
        <section className="w-full max-w-xl bg-white shadow-lg rounded-2xl border border-gray-200">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabOptions} />
          <div className="p-6">
            <AlertMessage message={error} type="error" />
            <AlertMessage message={message} type="success" />

            {activeTab === 'find' && (
              <div className="space-y-5">
                <RadioButtonGroup
                  selectedOption={searchType}
                  setOption={setSearchType}
                  options={entityTypeOptions}
                />
                <input
                  type="number"
                  placeholder={searchType === 'customer' ? "Enter Customer ID" : "Enter Product ID"}
                  value={searchType === 'customer' ? cid : pid}
                  onChange={(e) => searchType === 'customer' ? setCid(e.target.value) : setPid(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                <button
                  onClick={handleFind}
                  className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none font-semibold transition cursor-pointer"
                >
                  <Search size={18} /> Search
                </button>
                {(searchType === 'customer' && cname) && (
                  <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="font-medium text-blue-900 flex items-center gap-1"><User size={16} />Customer Name:</p>
                    <p className="text-lg text-blue-700">{cname}</p>
                  </div>
                )}
                {(searchType === 'product' && pname) && (
                  <div className="mt-2 p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="font-medium text-green-900 flex items-center gap-1"><Package size={16} />Product Name:</p>
                    <p className="text-lg text-green-700">{pname}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'add' && (
              <div className="space-y-5">
                {user?.roleId === 1 ? (
                  <AlertMessage message={ACCESS_DENIED_MESSAGE} type="error" />
                ) : (
                  <>
                    <RadioButtonGroup
                      selectedOption={addType}
                      setOption={setAddType}
                      options={entityTypeOptions}
                    />
                    {addType === 'customer' ? (
                      <input
                        type="text"
                        placeholder="Enter Customer Name"
                        value={newCname}
                        onChange={(e) => setNewCname(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter Product Name"
                        value={newPname}
                        onChange={(e) => setNewPname(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      />
                    )}
                    <button
                      onClick={handleAdd}
                      className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none font-semibold transition cursor-pointer"
                    >
                      <PlusCircle size={18} /> Add {addType === 'customer' ? 'Customer' : 'Product'}
                    </button>
                  </>
                )}
              </div>
            )}

            {activeTab === 'update' && (
              <div className="space-y-5">
                {user?.roleId === 1 ? (
                  <AlertMessage message={ACCESS_DENIED_MESSAGE} type="error" />
                ) : (
                  <>
                    <RadioButtonGroup
                      selectedOption={updateType}
                      setOption={setUpdateType}
                      options={entityTypeOptions}
                    />
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder={updateType === 'customer' ? "Enter Customer ID" : "Enter Product ID"}
                        value={updateType === 'customer' ? updateCid : updatePid}
                        onChange={(e) => {
                          const value = e.target.value;
                          clearMessages();
                          setIsFetchedForUpdate(false);
                          if (updateType === 'customer') {
                            setUpdateCid(value);
                            setUpdateCname('');
                          } else {
                            setUpdatePid(value);
                            setUpdatePname('');
                          }
                        }}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      />
                      <button
                        onClick={fetchForUpdate}
                        className="px-5 flex items-center gap-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none font-semibold transition cursor-pointer"
                      >
                        <Search size={16} /> Fetch
                      </button>
                    </div>
                    {isFetchedForUpdate ? (
                      <>
                        <textarea
                          value={updateType === 'customer' ? updateCname : updatePname}
                          onChange={(e) => updateType === 'customer' ? setUpdateCname(e.target.value) : setUpdatePname(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                          rows="2"
                          placeholder={`Enter new ${updateType === 'customer' ? 'Customer' : 'Product'} Name`}
                        />
                        <button
                          onClick={handleUpdate}
                          className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none font-semibold transition cursor-pointer"
                        >
                          <RefreshCcw size={18} /> Update {updateType === 'customer' ? 'Customer' : 'Product'}
                        </button>
                      </>
                    ) : null}
                  </>
                )}
              </div>
            )}

            {activeTab === 'quantity' && (
              <div className="space-y-5">
                {user?.roleId === 1 ? (
                  <AlertMessage message={ACCESS_DENIED_MESSAGE} type="error" />
                ) : (
                <div className="flex items-center gap-2">
                  <Hash size={18} className="text-purple-500" />
                  <input
                    type="number"
                    placeholder="Enter Product ID"
                    value={quantityPid}
                    onChange={e => {
                      setQuantityPid(e.target.value);
                      setFetchedQuantity(null);
                      setFetchedProductName('');
                      setQuantityValue('');
                      setError('');
                      setMessage('');
                    }}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                  />
                  <button
                    onClick={handleFetchQuantity}
                    className="px-4 py-2 flex items-center gap-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none font-semibold transition cursor-pointer"
                  >
                    <Search size={16} /> Fetch
                  </button>
                </div>)}
                {fetchedQuantity !== null && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Boxes size={18} className="text-purple-500" />
                      <span className="font-medium text-purple-700">Current Quantity:</span>
                      <span className="text-lg text-purple-900">{fetchedQuantity}</span>
                    </div>
                    {fetchedProductName && (
                      <div className="flex items-center gap-2">
                        <Package size={18} className="text-green-500" />
                        <span className="font-medium text-green-700">Product Name:</span>
                        <span className="text-lg text-green-900">{fetchedProductName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <ArrowUpDown size={18} className="text-purple-500" />
                      <input
                        type="number"
                        placeholder="Update Quantity"
                        value={quantityValue}
                        onChange={e => setQuantityValue(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                      />
                      <button
                        onClick={handleUpdateQuantity}
                        className="px-4 py-2 flex items-center gap-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none font-semibold transition cursor-pointer"
                      >
                        <RefreshCcw size={16} /> Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;