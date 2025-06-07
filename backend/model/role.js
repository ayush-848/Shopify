const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleId: {
    type: Number,
    required: true,
    unique: true,
  },
  roleName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
}, { timestamps: true });

roleSchema.statics.ensureDefaultRoles = async function () {
  const defaultRoles = [
    { roleId: 1, roleName: 'user' },
    { roleId: 2, roleName: 'admin' },
  ];

  for (const role of defaultRoles) {
    await this.findOneAndUpdate(
      { roleId: role.roleId },
      { $setOnInsert: role },
      { upsert: true, new: true }
    );
  }
  await this.deleteMany({ roleId: { $nin: [1, 2] } });
};

module.exports = mongoose.model('Role', roleSchema);
