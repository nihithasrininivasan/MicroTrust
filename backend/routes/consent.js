const { Router } = require("express");
const { giveConsent } = require("../controllers/consentController");
const { consentRules, validate } = require("../utils/validators");
const auth = require("../middleware/auth");

const router = Router();

// POST /api/consent (protected)
router.post("/", auth, consentRules, validate, giveConsent);

module.exports = router;
