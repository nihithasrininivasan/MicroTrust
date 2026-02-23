const { Router } = require("express");
const { giveConsent } = require("../controllers/consent.controller");
const authMiddleware = require("../middleware/authMiddleware");

// ──────────────────────────────────────────────────────────────────────────────
// Consent Routes
//
// POST /api/consent — Record user's consent for data usage (protected)
// ──────────────────────────────────────────────────────────────────────────────

const router = Router();

// Protected: user must be logged in to give consent
router.post("/", authMiddleware, giveConsent);

module.exports = router;
