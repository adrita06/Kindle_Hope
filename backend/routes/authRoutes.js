const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// Example protected routes
router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Welcome user", user: req.user });
});

router.get("/admin", verifyToken, requireRole("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

module.exports = router;
