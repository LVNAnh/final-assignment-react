const express = require("express");
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");
const {
  authMiddleware,
  adminMiddleware,
  staffMiddleware,
} = require("../middlewares/auth");

const router = express.Router();

// User routes
router.post("/users/register", userController.register);
router.post("/users/login", userController.login);
router.get(
  "/users",
  //   authMiddleware,
  //   adminMiddleware,
  userController.getAllUsers
);
router.get(
  "/users/:id",
  // authMiddleware,
  userController.getUserById
);
router.put(
  "/users/:id",
  // authMiddleware,
  userController.updateUser
);
router.delete(
  "/users/:id",
  //   authMiddleware,
  //   adminMiddleware,
  userController.deleteUser
);
router.post("/users/updateCart", userController.updateCart);
router.get("/users/:userId/cart", userController.getCart);
// Route chỉnh sửa giỏ hàng (edit cart)
router.put("/users/:userId/cart", userController.editCart);

// Route xóa sản phẩm khỏi giỏ hàng
router.delete("/users/:userId/cart", userController.removeFromCart);

// Product routes
router.post(
  "/products",
  //   authMiddleware,
  //   staffMiddleware,
  productController.addProduct
);
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.put(
  "/products/:id",
  //   authMiddleware,
  //   staffMiddleware,
  productController.updateProduct
);
router.delete(
  "/products/:id",
  //   authMiddleware,
  //   adminMiddleware,
  productController.deleteProduct
);

// Category routes
router.post(
  "/categories",
  //   authMiddleware,
  //   adminMiddleware,
  categoryController.addCategory
);
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.put(
  "/categories/:id",
  //   authMiddleware,
  //   adminMiddleware,
  categoryController.updateCategory
);
router.delete(
  "/categories/:id",
  //   authMiddleware,
  //   adminMiddleware,
  categoryController.deleteCategory
);

module.exports = router;
