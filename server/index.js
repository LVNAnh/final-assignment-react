const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const routes = require("./Routes/routes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/final-assignment",
    {}
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
