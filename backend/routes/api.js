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
const authenticated = require('../middleware/authenticated');

router.post('/getcname', getcname);
router.post('/getpname', getpname);
router.get('/cid', getAllCustomers);
router.get('/pid', getAllProducts);

router.get('/customercount',authenticated, getCustomerCount);
router.get('/productcount',authenticated, getProductCount);
router.post('/addcustomer', authenticated, addCustomer);
router.post('/addproduct', authenticated, addProduct);
router.put('/updatecustomer', authenticated, updateCustomer);
router.put('/updateproduct', authenticated, updateProduct);
router.get('/quantity/:pid', authenticated, getQuantity);
router.put('/quantity/:pid', authenticated, updateQuantity);
router.post('/cart/add', authenticated, addToCart);
router.get('/cart/:userId', authenticated, getCart);
router.post('/cart/remove', authenticated, removeFromCart);
router.delete('/cart/clear/:userId', authenticated, clearCart);
router.post('/cart/update', authenticated, updateCartItem);
router.post('/cart/checkout', authenticated, checkout);

module.exports = router;