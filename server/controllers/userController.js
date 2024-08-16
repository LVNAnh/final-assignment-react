const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const register = async (req, res) => {
  try {
    const { firstname, lastname, age, password, email, phone, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      age,
      password: hashedPassword,
      email,
      phone,
      role,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    res.json({
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { firstname, lastname, age, password, email, phone, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstname,
        lastname,
        age,
        password: hashedPassword,
        email,
        phone,
        role,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCart = async (req, res) => {
  const { productId, quantity, userId } = req.body;

  try {
    console.log("Received data:", { productId, quantity, userId });

    const product = await Product.findById(productId);
    if (!product) {
      console.log("Product not found:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);

    const existingItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productObjectId.toString()
    );

    console.log("Existing item index:", existingItemIndex);

    if (existingItemIndex > -1) {
      user.cart[existingItemIndex].quantity += quantity;
      user.cart[existingItemIndex].price = product.price;
      user.cart[existingItemIndex].title = product.name;
      user.cart[existingItemIndex].image = product.image;
    } else {
      user.cart.push({
        product: productId,
        quantity,
        price: product.price,
        title: product.name,
        image: product.image,
      });
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCart = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ params hoặc body

  try {
    const user = await User.findById(userId).populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ cart: user.cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editCart = async (req, res) => {
  const { productId, quantity } = req.body; // Lấy productId và quantity từ body
  const { userId } = req.params; // Lấy userId từ params

  try {
    // Tìm sản phẩm
    const product = await Product.findByIdAndUpdate(
      new mongoose.Types.ObjectId(productId)
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Xử lý giỏ hàng
    const productObjectId = new mongoose.Types.ObjectId(productId); // Sử dụng new

    const existingItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productObjectId.toString()
    );

    if (existingItemIndex > -1) {
      if (quantity > 0) {
        user.cart[existingItemIndex].quantity = quantity;
        user.cart[existingItemIndex].price = product.price;
        user.cart[existingItemIndex].title = product.name;
        user.cart[existingItemIndex].image = product.image;
      } else {
        user.cart.splice(existingItemIndex, 1); // Xóa sản phẩm nếu quantity <= 0
      }
    } else {
      if (quantity > 0) {
        user.cart.push({
          product: productId,
          quantity,
          price: product.price,
          title: product.name,
          image: product.image,
        });
      }
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error editing cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.body; // Lấy productId từ body
  const { userId } = req.params; // Lấy userId từ params

  try {
    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    const productObjectId = new mongoose.Types.ObjectId(productId); // Sử dụng new

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productObjectId.toString()
    );

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateCart,
  getCart,
  editCart,
  removeFromCart,
};
