const { Router } = require("express");
const { register, login, getProfile, deleteAccount } = require("../controllers/authController");
const { registerRules, loginRules, validate } = require("../utils/validators");
const { authLimiter } = require("../middleware/rateLimiter");
const auth = require("../middleware/auth");

const router = Router();

// POST /api/auth/register
router.post("/register", authLimiter, registerRules, validate, register);

// POST /api/auth/login
router.post("/login", authLimiter, loginRules, validate, login);

// GET /api/auth/profile (protected)
router.get("/profile", auth, getProfile);

// DELETE /api/auth/account (protected)
router.delete("/account", auth, deleteAccount);

module.exports = router;
