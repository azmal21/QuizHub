// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  joinedAt: {
    type: Date,
    default: Date.now, // automatically sets the current date & time
  },
});

module.exports = mongoose.model("User", userSchema);
