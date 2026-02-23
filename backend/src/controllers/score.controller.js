const User = require("../../models/User");

// ──────────────────────────────────────────────────────────────────────────────
// Score Controller
// GET /api/score (Protected)
// Fetches the logged-in user's profile and computes a behavioral credit score.
// ──────────────────────────────────────────────────────────────────────────────

// ── SCORING LOGIC ────────────────────────────────────────────────────────────
// The score is built from a base of 500, with additive bonuses based on
// behavioral and financial indicators:
//
//   +50  if monthlyIncome   > 15,000
//   +70  if upiTransactions > 10
//   +30  if endorsements    > 2
//   +20  if consentGiven   == true
//
// Maximum possible score: 500 + 50 + 70 + 30 + 20 = 670 → "Medium Risk"
// (The model is intentionally conservative for an MVP / hackathon demo.)
// ──────────────────────────────────────────────────────────────────────────────

function calculateScore(user) {
    let score = 500; // Base score

    if (user.monthlyIncome > 15000) score += 50;
    if (user.upiTransactions > 10) score += 70;
    if (user.endorsements > 2) score += 30;
    if (user.consentGiven === true) score += 20;

    return score;
}

// ── RISK CLASSIFICATION ──────────────────────────────────────────────────────
// Maps the numeric score to a human-readable risk level.
// ──────────────────────────────────────────────────────────────────────────────

function getRiskLevel(score) {
    if (score >= 700) return "Low Risk";
    if (score >= 600) return "Medium Risk";
    return "High Risk";
}

// ── ROUTE HANDLER ────────────────────────────────────────────────────────────

const getScore = async (req, res, next) => {
    try {
        // Fetch the full user profile (req.user.id is set by authMiddleware)
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found.",
            });
        }

        // Compute credit score and risk level
        const creditScore = calculateScore(user);
        const riskLevel = getRiskLevel(creditScore);

        return res.status(200).json({
            success: true,
            data: {
                name: user.name,
                creditScore,
                riskLevel,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getScore };
