const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    min: 0,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Email không hợp lệ"],
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Số điện thoại không hợp lệ"],
  },
  role: {
    type: Number,
    enum: [0, 1, 2], // 0: quản lý, 1: nhân viên, 2: user bình thường
    default: 2,
  },
  cart: [
    {
      product: { type: mongoose.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
      title: String,
      image: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
