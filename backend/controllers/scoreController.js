const Score = require("../models/Score");
const User = require("../models/User");
const Consent = require("../models/Consent");

/**
 * GET /api/score/:userId
 * Calculate or retrieve the user's behavioral credit score.
 */
async function getScore(req, res, next) {
    try {
        const { userId } = req.params;

        // Authorization: users can only access their own score
        if (req.user.id !== userId) {
            return res.status(403).json({
                status: 403,
                message: "Access denied. You can only view your own score.",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }

        // Check if consent was given
        const consent = await Consent.findOne({ userId, consentGiven: true });

        // ── Behavioral Credit Scoring Algorithm ──────────────────────────
        let score = 500; // base score

        if (user.monthlyIncome > 15000) score += 50;
        if (user.upiTransactions > 10) score += 70;
        if (user.endorsements > 2) score += 30;
        if (consent) score += 20;

        // Score range
        let scoreRange;
        if (score >= 750) scoreRange = "Excellent";
        else if (score >= 700) scoreRange = "Good";
        else if (score >= 600) scoreRange = "Fair";
        else scoreRange = "Poor";

        // Risk level
        let riskLevel;
        if (score >= 700) riskLevel = "Low Risk";
        else if (score >= 600) riskLevel = "Medium Risk";
        else riskLevel = "High Risk";

        // Save score to DB
        const savedScore = await Score.create({
            userId,
            creditScore: score,
            scoreRange,
            riskLevel,
        });

        res.status(200).json({
            status: 200,
            score: savedScore.creditScore,
            scoreRange: savedScore.scoreRange,
            riskLevel: savedScore.riskLevel,
            calculatedAt: savedScore.calculatedAt,
            validTill: savedScore.validTill,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { getScore };
