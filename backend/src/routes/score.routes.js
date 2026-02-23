const { Router } = require("express");
const { generateScore } = require("../services/mlClient.service");

const router = Router();

router.post("/", async (req, res, next) => {
    try {
        const { user_id, features } = req.body;

        if (!user_id || !features) {
            return res.status(400).json({ error: "user_id and features are required" });
        }

        const result = await generateScore(user_id, features);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
