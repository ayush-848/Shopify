const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  cid: Number,
  cname: String
});

module.exports = mongoose.model('Customer', customerSchema);
