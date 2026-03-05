const { Router } = require("express");
const { listEndorsements, createEndorsement, deleteEndorsement } = require("../controllers/endorsementController");
const auth = require("../middleware/auth");

const router = Router();

// GET /api/endorsements (protected)
router.get("/", auth, listEndorsements);

// POST /api/endorsements (protected)
router.post("/", auth, createEndorsement);

// DELETE /api/endorsements/:id (protected)
router.delete("/:id", auth, deleteEndorsement);

module.exports = router;
