const Reward = require("../models/Reward");

/**
 * GET /api/rewards
 * List all active rewards.
 */
async function listRewards(req, res, next) {
    try {
        const rewards = await Reward.find({ isActive: true })
            .sort({ scoreNeeded: 1 });

        res.status(200).json({
            status: 200,
            rewards: rewards.map((r) => ({
                id: r._id,
                title: r.title,
                provider: r.provider,
                value: r.value,
                icon: r.icon,
                scoreNeeded: r.scoreNeeded,
            })),
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { listRewards };
