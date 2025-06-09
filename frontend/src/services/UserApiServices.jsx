import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = `${API_URL}/api`;

const UserApiServices = {
  // Customer API calls
  getCustomerName: async (cid) => {
    const response = await axios.post(
      `${API_BASE_URL}/getcname`,
      { cid }
    );
    return response.data.cname;
  },

  addCustomer: async (cname) => {
    const response = await axios.post(
      `${API_BASE_URL}/addcustomer`,
      { cname },
      { withCredentials: true }
    );
    return response.data.message;
  },

  updateCustomer: async (cid, cname) => {
    const response = await axios.put(
      `${API_BASE_URL}/updatecustomer`,
      { cid, cname },
      { withCredentials: true }
    );
    return response.data.message;
  },

  // Product API calls
  getProductName: async (pid) => {
    const response = await axios.post(
      `${API_BASE_URL}/getpname`,
      { pid }
    );
    return response.data.pname;
  },

  addProduct: async (pname) => {
    const response = await axios.post(
      `${API_BASE_URL}/addproduct`,
      { pname },
      { withCredentials: true }
    );
    await UserApiServices.getProductCount(); // corrected the reference
    return response.data.message;
  },

  updateProduct: async (pid, pname) => {
    const response = await axios.put(
      `${API_BASE_URL}/updateproduct`,
      { pid, pname },
      { withCredentials: true }
    );
    return response.data.message;
  },

  // Dashboard API calls
  getCustomerCount: async () => {
    const response = await axios.get(`${API_BASE_URL}/customercount`, {
      withCredentials: true,
    });
    return response.data;
  },

  getProductCount: async () => {
    const response = await axios.get(`${API_BASE_URL}/productcount`, {
      withCredentials: true,
    });
    return response.data;
  },

  getAllCustomers: async () => {
    const response = await axios.get(`${API_BASE_URL}/cid`, {
      withCredentials: true,
    });
    return response.data;
  },

  getAllProducts: async () => {
    const response = await axios.get(`${API_BASE_URL}/pid`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Quantity API calls
  getQuantity: async (pid) => {
    const response = await axios.get(`${API_BASE_URL}/quantity/${pid}`, {
      withCredentials: true,
    });
    return response.data;
  },

  updateQuantity: async (pid, quantity) => {
    const response = await axios.put(
      `${API_BASE_URL}/quantity/${pid}`,
      { quantity },
      { withCredentials: true }
    );
    return response.data;
  },

  // Cart API calls
  getCart: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/cart/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  addToCart: async ({ userId, productId, name, quantity }) => {
    const response = await axios.post(
      `${API_BASE_URL}/cart/add`,
      {
        userId,
        productId,
        name,
        quantity,
      },
      { withCredentials: true }
    );
    return response.data;
  },

  removeFromCart: async ({ userId, pid }) => {
    const response = await axios.post(
      `${API_BASE_URL}/cart/remove`,
      { userId, pid },
      { withCredentials: true }
    );
    return response.data;
  },

   updateCartItem: async ({ productId, quantity }) => {
  const response = await axios.post(
    `${API_BASE_URL}/cart/update`,
    { productId, quantity },
    { withCredentials: true }
  );
  return response.data;
},

  checkout: async () => {
    const response = await axios.post(
      `${API_BASE_URL}/cart/checkout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  },

  getOrders: async () => {
    const response = await axios.get(`${API_BASE_URL}/orders`, {
      withCredentials: true,
    });
    return response.data;
  },
};

export default UserApiServices;
