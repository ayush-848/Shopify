const Customer = require('../model/customer');
const Product = require('../model/product');
const Quantity = require('../model/quantity'); // Add this at the top with other requires

exports.getcname = async (req, res) => {
  try {
    const { cid } = req.body;
    const customer = await Customer.findOne({ cid });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ cname: customer.cname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching customer name' });
  }
};

exports.getpname = async (req, res) => {
  try {
    const { pid } = req.body;
    const product = await Product.findOne({ pid });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ pname: product.pname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching product name' });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.status(200).json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching customers' });
  }
};


exports.getAllProducts = async (req, res) => {
  try{
    const products=await Product.find({});
    res.status(200).json(products);
  }catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products' });

  }
}


exports.addCustomer = async (req, res) => {
  const { cname } = req.body;

  if (!cname) {
    return res.status(400).json({ message: 'Customer name is required' });
  }

  try {
    const lastCustomer = await Customer.findOne().sort({ cid: -1 }).limit(1);

    let newCid;
    if (lastCustomer && lastCustomer.cid !== undefined) {
      newCid = lastCustomer.cid + 1;
    } else {
      newCid = 1;
    }

    const newCustomer = new Customer({ cid: newCid, cname });
    await newCustomer.save();

    res.status(201).json({ message: `Customer '${cname}' added successfully with ID ${newCid}!`, cid: newCid });
  } catch (err) {
    console.error('Error adding customer:', err);
    res.status(500).json({ message: 'Error adding customer', error: err.message });
  }
};


exports.addProduct = async (req, res) => {
  const { pname } = req.body;
  if (!pname) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  try {
    const lastProduct = await Product.findOne().sort({ pid: -1 }).limit(1);

    let newPid;
    if (lastProduct && lastProduct.pid !== undefined) {
      newPid = lastProduct.pid + 1;
    } else {
      newPid = 1;
    }

    const newProduct = new Product({ pid: newPid, pname });
    await newProduct.save();
    
    await Quantity.create({ pid: newPid, quantity: 0 });

    res.status(201).json({ message: `Product '${pname}' added successfully with ID ${newPid}!`, pid: newPid });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  const { cid, cname } = req.body;
  try {
    const customer = await Customer.findOne({ cid });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    customer.cname = cname;
    await customer.save();
    res.json({ message: 'Customer updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating customer' });
  }
};

exports.updateProduct = async (req, res) => {
  const { pid, pname } = req.body;
  try {
    const product = await Product.findOne({ pid });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.pname = pname;
    await product.save();
    res.json({ message: 'Product updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating product' });
  }
};

exports.getCustomerCount = async (req, res) => {
  try {
    const count = await Customer.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error('Error getting customer count:', err);
    res.status(500).json({ message: 'Error getting customer count', error: err.message });
  }
};

exports.getProductCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error('Error getting product count:', err);
    res.status(500).json({ message: 'Error getting product count', error: err.message });
  }
};

exports.getQuantity = async (req, res) => {
  try {
    const { pid } = req.params;
    const quantityDoc = await Quantity.findOne({ pid: Number(pid) });
    if (!quantityDoc) {
      return res.status(404).json({ message: 'This product does not exist' });
    }
    const product = await Product.findOne({ pid: Number(pid) });
    const pname = product ? product.pname : null;
    res.json({ pid: quantityDoc.pid, quantity: quantityDoc.quantity, pname });
  } catch (err) {
    console.error('Error fetching quantity:', err);
    res.status(500).json({ message: 'Error fetching quantity', error: err.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { pid } = req.params;
    const { quantity } = req.body;
    if (typeof quantity !== 'number') {
      return res.status(400).json({ message: 'Quantity must be a number' });
    }

    let quantityDoc = await Quantity.findOne({ pid: Number(pid) });
    if (!quantityDoc) {
      // If not found, create new
      quantityDoc = new Quantity({ pid: Number(pid), quantity });
    } else {
      quantityDoc.quantity = quantity;
    }
    await quantityDoc.save();
    res.json({ message: 'Quantity updated successfully', pid: quantityDoc.pid, quantity: quantityDoc.quantity });
  } catch (err) {
    console.error('Error updating quantity:', err);
    res.status(500).json({ message: 'Error updating quantity', error: err.message });
  }
};
