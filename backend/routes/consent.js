const { Router } = require("express");
const { giveConsent, getConsentStatus } = require("../controllers/consentController");
const { consentRules, validate } = require("../utils/validators");
const auth = require("../middleware/auth");

const router = Router();

// POST /api/consent (protected)
router.post("/", auth, consentRules, validate, giveConsent);

// GET /api/consent/status (protected)
router.get("/status", auth, getConsentStatus);

module.exports = router;
