const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    console.log("Received Token:", token); // Thêm dòng này để kiểm tra token

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(403).json({ message: "Token is not valid" });
      }

      try {
        req.user = await User.findById(decoded.userId);
        if (!req.user) {
          console.error("User not found for token userId:", decoded.userId);
          return res.status(401).json({ message: "Unauthorized" });
        }
        next();
      } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || parseInt(req.user.role) !== 0) {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

const staffMiddleware = (req, res, next) => {
  if (
    !req.user ||
    (parseInt(req.user.role) !== 0 && parseInt(req.user.role) !== 1)
  ) {
    return res
      .status(403)
      .json({ error: "Access denied. Admins and staff only." });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  staffMiddleware,
};
