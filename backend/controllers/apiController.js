const Customer = require('../model/customer');
const Product = require('../model/product');
const Quantity = require('../model/quantity');
const Cart = require('../model/cart');
const Order=require('../model/order')

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
  console.log("Adding customer:", req.body);
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

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};


exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, name, quantity = 1 } = req.body;
    console.log("Adding to cart:", { userId, productId, name, quantity });

    // Check if product exists
    const product = await Product.findOne({ pid: productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Try to increment quantity if product already in user's cart
    let cart = await Cart.findOneAndUpdate(
      { userId, 'items.productId': productId },
      { $inc: { 'items.$.quantity': quantity } },
      { new: true }
    );

    // If product not in cart, add it to items array
    if (!cart) {
      cart = await Cart.findOneAndUpdate(
        { userId },
        { $push: { items: { productId, name, quantity } } },
        { new: true, upsert: true }
      );
    }

    res.status(200).json({ message: 'Item added to cart', cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};




exports.removeFromCart = async (req, res) => {
  try {
    const { userId, pid } = req.body;

    console.log("RemoveFromCart called with:", { userId, pid });

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log(`Cart not found for userId: ${userId}`);
      return res.status(404).json({ message: 'Cart not found' });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => {
      const keep = item.productId !== pid;
      if (!keep) console.log(`Removing item:`, item);
      return keep;
    });

    if (cart.items.length === initialLength) {
      console.log(`No item with productId ${pid} found in cart for userId ${userId}`);
      return res.status(404).json({ message: `Item with productId ${pid} not found in cart` });
    }

    if (cart.items.length === 0) {
      // Delete entire cart document if no items remain
      await Cart.deleteOne({ userId });
      console.log(`Cart deleted for userId: ${userId} because it became empty.`);
      return res.status(200).json({ message: 'Item removed and cart deleted because it is empty', cart: null });
    } else {
      // Save updated cart with items removed
      await cart.save();
      console.log(`Item with productId ${pid} removed. Updated cart:`, cart);
      return res.status(200).json({ message: 'Item removed from cart', cart });
    }
  } catch (err) {
    console.error('Error in removeFromCart:', err);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};



exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};


exports.checkout = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required for checkout." });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty. Please add items before checking out." });
    }

    // Extract all pids from cart
    const productPids = cart.items.map(item => item.productId);

    // Fetch all products by pid (Number)
    const productsInCart = await Product.find({ pid: { $in: productPids } });

    // Fetch quantities for these products from Quantity collection
    const quantitiesInCart = await Quantity.find({ pid: { $in: productPids } });

    // Validate each cart item stock in Quantity collection
    for (const item of cart.items) {
      const product = productsInCart.find(p => p.pid === item.productId);
      const quantityDoc = quantitiesInCart.find(q => q.pid === item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product with pid ${item.productId} not found.` });
      }

      if (!quantityDoc || quantityDoc.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.pname}. Available: ${quantityDoc ? quantityDoc.quantity : 0}, Requested: ${item.quantity}`,
          displayMessage: `Insufficient stock for product: ${product.pname}.`
        });
      }
    }

    // Map order items
    const orderItems = cart.items.map(item => {
      const productDoc = productsInCart.find(p => p.pid === item.productId);
      return {
        pid: productDoc.pid,
        pname: productDoc.pname,
        quantity: item.quantity
      };
    });

    const totalItemsCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);

    const order = new Order({
      userId,
      items: orderItems,
      totalItems: totalItemsCount,
      createdAt: new Date()
    });

    await order.save();

    // Decrease stock in Quantity collection
    for (const item of cart.items) {
      await Quantity.updateOne(
        { pid: item.productId },
        { $inc: { quantity: -item.quantity } }
      );
    }

    // Clear the cart
    await Cart.deleteOne({ userId });

    res.status(200).json({ message: "Checkout successful! Your order has been placed.", order });

  } catch (err) {
    console.error("Checkout error:", err);
    if (res.headersSent) return;
    res.status(500).json({ message: "Checkout failed due to a server error. Please try again later." });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required to fetch orders." });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    return res.status(200).json(orders);

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};


exports.updateCartItem = async (req, res) => {
  try {
    console.log("Updating cart item:", req.body);
    const {  productId, quantity } = req.body;
    const userId = req.user._id;
    if (quantity < 1) {
      await Cart.updateOne(
        { userId },
        { $pull: { items: { productId } } }
      );
    } else {
      await Cart.updateOne(
        { userId, "items.productId": productId },
        { $set: { "items.$.quantity": quantity } }
      );
    }
    res.status(200).json({ message: "Cart updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart" });
  }
};
