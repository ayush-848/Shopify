const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  pid: Number,
  pname: String
});

module.exports = mongoose.model('Product', productSchema);
