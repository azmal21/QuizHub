// models/Admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: String,
  password: String, // hashed if needed
});

module.exports = mongoose.model("Admin", adminSchema);
