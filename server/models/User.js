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
    minlength: 6, // Mật khẩu phải có ít nhất 6 ký tự
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Email không hợp lệ"], // Validate email theo định dạng
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Số điện thoại không hợp lệ"], // Validate số điện thoại (10 số)
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
