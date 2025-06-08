// models/Cart.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  // References the 'pid' (Number) from your Product schema
  productId: { // Using 'productId' for clarity, but it will map to Product.pid
    type: Number,
    ref: 'Product', // This sets up the reference to the 'Product' model
    required: true,
  },
  // Denormalized product name (from Product.pname) for easier display in the cart on the frontend
  name: {
    type: String,
    required: true,
  },
  quantity: { // Quantity of this specific item in the cart
    type: Number,
    required: true,
    min: 1, // A cart item must have a quantity of at least 1
    default: 1,
  },
  // OPTIONAL: Store the price at the time it was added to the cart.
  // This is highly recommended for accurate historical order data if you implement orders later.
  // priceAtAdded: {
  //   type: Number,
  //   required: true
  // }
});

const cartSchema = new Schema({
  // References the '_id' (ObjectId) from your User schema
  userId: {
    type: Schema.Types.ObjectId, // Correctly references the default _id type of a Mongoose User model
    ref: 'User', // This sets up the reference to the 'User' model
    required: true,
    unique: true, // Each user should have only one active cart document
    index: true   // Important for fast lookups by user
  },
  items: [cartItemSchema], // An array to hold all the products currently in this user's cart
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically

module.exports = mongoose.model('Cart', cartSchema);