const { Router } = require("express");
const { getScore, getScoreHistory } = require("../controllers/scoreController");
const { userIdParamRule, validate } = require("../utils/validators");
const auth = require("../middleware/auth");

const router = Router();

// GET /api/score/:userId (protected)
router.get("/:userId", auth, userIdParamRule, validate, getScore);

// GET /api/score/:userId/history (protected)
router.get("/:userId/history", auth, userIdParamRule, validate, getScoreHistory);

module.exports = router;
