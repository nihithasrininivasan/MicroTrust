const { Router } = require("express");
const { getEndorsement } = require("../controllers/lenderController");
const { endorsementRules, validate } = require("../utils/validators");
const auth = require("../middleware/auth");

const router = Router();

// POST /api/lenders/endorsement (protected)
router.post("/endorsement", auth, endorsementRules, validate, getEndorsement);

module.exports = router;
