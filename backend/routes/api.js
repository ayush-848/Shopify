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

module.exports = router;
