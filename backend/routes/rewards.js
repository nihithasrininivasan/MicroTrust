const { Router } = require("express");
const { listRewards } = require("../controllers/rewardController");
const auth = require("../middleware/auth");

const router = Router();

// GET /api/rewards (protected)
router.get("/", auth, listRewards);

module.exports = router;
