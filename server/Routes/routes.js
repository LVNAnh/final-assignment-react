const express = require("express");
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

// User routes
router.post("/users/register", userController.register);
router.post("/users/login", userController.login);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

// Product routes
router.post("/products", productController.addProduct);
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

// Category routes
router.post("/categories", categoryController.addCategory);
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

module.exports = router;
