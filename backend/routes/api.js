const express = require('express');
const router = express.Router();
const {
  getcname,
  getpname,
  getAllCustomers,
  getAllProducts,
  getCustomerCount,
  getProductCount,
  addCustomer,
  addProduct,
  updateCustomer,
  updateProduct,
  getQuantity,
  updateQuantity,
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartItem,
  checkout

} = require('../controllers/apiController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/getcname', getcname);
router.post('/getpname', getpname);
router.get('/cid', getAllCustomers);
router.get('/pid', getAllProducts);
router.get('/customercount',authMiddleware, getCustomerCount);
router.get('/productcount',authMiddleware, getProductCount);
router.post('/addcustomer',authMiddleware, addCustomer);
router.post('/addproduct',authMiddleware, addProduct);
router.put('/updatecustomer',authMiddleware, updateCustomer);
router.put('/updateproduct',authMiddleware, updateProduct);
router.get('/quantity/:pid',authMiddleware, getQuantity);
router.put('/quantity/:pid',authMiddleware, updateQuantity);
router.post('/cart/add',authMiddleware, addToCart);
router.get('/cart/:userId',authMiddleware, getCart);
router.post('/cart/remove',authMiddleware, removeFromCart);
router.delete('/cart/clear/:userId',authMiddleware, clearCart);
router.put('/cart/update',authMiddleware, updateCartItem);
router.post('/checkout',authMiddleware, checkout);

module.exports = router;
