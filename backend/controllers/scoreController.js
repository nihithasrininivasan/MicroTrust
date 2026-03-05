const Score = require("../models/Score");
const User = require("../models/User");
const Consent = require("../models/Consent");
const Endorsement = require("../models/Endorsement");
const { generateMLScore } = require("../services/mlClient");
const { getMockUPIData } = require("../services/mockUpiApi");

/**
 * GET /api/score/:userId
 * Generate a MicroTrust score using the ML ensemble pipeline.
 * Falls back to rule-based scoring if ML service is unavailable.
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
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        // Check consent + endorsements
        const consent = await Consent.findOne({ userId, consentGiven: true });
        const endorsementCount = await Endorsement.countDocuments({ userId });

        // ── Get behavioral features from Mock UPI API ────────────────────
        const upiData = getMockUPIData(user, userId, {
            endorsementCount,
            hasConsent: !!consent,
        });

        const features = upiData.features;

        // ── Try ML Service first, fall back to rule-based ────────────────
        let score, scoreRange, riskLevel, modelConfidence, topRiskFactors, scoringMethod;

        const mlResult = await generateMLScore(features);

        if (mlResult && mlResult.microtrust_score !== undefined) {
            // ✅ ML Service responded — use ensemble score
            score = mlResult.microtrust_score;
            modelConfidence = mlResult.model_confidence;
            topRiskFactors = mlResult.top_risk_factors;
            scoringMethod = "ml_ensemble";

            // Map ML risk bucket to our format
            if (mlResult.risk_bucket === "Low") {
                scoreRange = "Excellent";
                riskLevel = "Low Risk";
            } else if (mlResult.risk_bucket === "Medium") {
                scoreRange = score >= 650 ? "Good" : "Fair";
                riskLevel = "Medium Risk";
            } else {
                scoreRange = "Poor";
                riskLevel = "High Risk";
            }
        } else {
            // ⚠️ ML Service down — fall back to rule-based scoring
            scoringMethod = "rule_based_fallback";
            modelConfidence = null;
            topRiskFactors = [];

            score = 500; // base

            if (features.income_stability > 0.6) score += 50;
            else if (features.income_stability > 0.3) score += 25;

            if (features.upi_consistency > 0.7) score += 70;
            else if (features.upi_consistency > 0.4) score += 35;

            if (features.bill_payment_regularity > 0.7) score += 40;
            else if (features.bill_payment_regularity > 0.4) score += 20;

            if (features.community_trust_score > 0.5) score += 30;
            else if (features.community_trust_score > 0.2) score += 15;

            if (consent) score += 20;

            if (score >= 750) scoreRange = "Excellent";
            else if (score >= 700) scoreRange = "Good";
            else if (score >= 600) scoreRange = "Fair";
            else scoreRange = "Poor";

            if (score >= 700) riskLevel = "Low Risk";
            else if (score >= 600) riskLevel = "Medium Risk";
            else riskLevel = "High Risk";
        }

        // ── Convert features to % breakdown for frontend display ─────────
        const breakdown = {
            consistency: Math.round(features.upi_consistency * 100),
            billPayments: Math.round(features.bill_payment_regularity * 100),
            stability: Math.round(features.income_stability * 100),
            trustNetwork: Math.round(features.community_trust_score * 100),
            digitalFootprint: Math.round(features.recharge_frequency * 100),
        };

        // ── Save score to DB ─────────────────────────────────────────────
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
            breakdown,
            scoringMethod,
            modelConfidence,
            topRiskFactors,
            transactionSummary: upiData.transactionSummary,
        });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/score/:userId/history
 * Return the user's score history for charts.
 */
async function getScoreHistory(req, res, next) {
    try {
        const { userId } = req.params;

        if (req.user.id !== userId) {
            return res.status(403).json({
                status: 403,
                message: "Access denied. You can only view your own score history.",
            });
        }

        const scores = await Score.find({ userId })
            .sort({ calculatedAt: -1 })
            .limit(30)
            .select("creditScore scoreRange riskLevel calculatedAt");

        res.status(200).json({
            status: 200,
            history: scores.map((s) => ({
                score: s.creditScore,
                scoreRange: s.scoreRange,
                riskLevel: s.riskLevel,
                date: s.calculatedAt,
            })),
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { getScore, getScoreHistory };
