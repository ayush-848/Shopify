const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  pid: { type: Number, required: true }, // matches Product.pid
  pname: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalItems: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'completed' }, // pending, completed, canceled
});

module.exports = mongoose.model('Order', orderSchema);
