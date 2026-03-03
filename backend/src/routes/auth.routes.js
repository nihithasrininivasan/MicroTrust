const { Router } = require("express");
const { register, login } = require("../controllers/auth.controller");

// ──────────────────────────────────────────────────────────────────────────────
// Auth Routes
//
// POST /api/register — Create a new user account
// POST /api/login    — Authenticate and receive a JWT
//
// Both routes are public (no authMiddleware required).
// ──────────────────────────────────────────────────────────────────────────────

const router = Router();

// Register a new user
router.post("/register", register);

// Login with phone + password → receive JWT
router.post("/login", login);

module.exports = router;
