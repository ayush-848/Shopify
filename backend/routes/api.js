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

router.post('/getcname', getcname);
router.post('/getpname', getpname);
router.get('/cid', getAllCustomers);
router.get('/pid', getAllProducts);
router.get('/customercount', getCustomerCount);
router.get('/productcount', getProductCount);
router.post('/addcustomer', addCustomer);
router.post('/addproduct', addProduct);
router.put('/updatecustomer', updateCustomer);
router.put('/updateproduct', updateProduct);
router.get('/quantity/:pid', getQuantity);
router.put('/quantity/:pid', updateQuantity);
router.post('/cart/add', addToCart);
router.get('/cart/:userId', getCart);
router.post('/cart/remove', removeFromCart);
router.delete('/cart/clear/:userId', clearCart);
router.put('/cart/update', updateCartItem);
router.post('/checkout', checkout);

module.exports = router;
