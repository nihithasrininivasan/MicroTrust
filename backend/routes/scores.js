const { Router } = require("express");
const { getScore } = require("../controllers/scoreController");
const { userIdParamRule, validate } = require("../utils/validators");
const auth = require("../middleware/auth");

const router = Router();

// GET /api/score/:userId (protected)
router.get("/:userId", auth, userIdParamRule, validate, getScore);

module.exports = router;
