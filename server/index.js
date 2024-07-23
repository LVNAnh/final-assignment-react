const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const routes = require("./Routes/routes");

const app = express();
const port = 5000;

// Kết nối tới MongoDB
mongoose
  .connect("mongodb://localhost:27017/final-assignment", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", routes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
