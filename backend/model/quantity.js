const mongoose = require('mongoose');

const quantitySchema = new mongoose.Schema({
  pid: {
    type: Number,
    required: true,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model('Quantity', quantitySchema);