const { Router } = require("express");
const { register, login } = require("../controllers/authController");
const { registerRules, loginRules, validate } = require("../utils/validators");
const { authLimiter } = require("../middleware/rateLimiter");

const router = Router();

// POST /api/auth/register
router.post("/register", authLimiter, registerRules, validate, register);

// POST /api/auth/login
router.post("/login", authLimiter, loginRules, validate, login);

module.exports = router;
