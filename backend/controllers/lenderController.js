const Lender = require("../models/Lender");
const Score = require("../models/Score");

/**
 * POST /api/lenders/endorsement
 * Find matching lenders based on user's credit score and requested loan amount.
 */
async function getEndorsement(req, res, next) {
    try {
        const { loanAmount } = req.body;
        const userId = req.user.id;

        // Get the user's latest score
        const latestScore = await Score.findOne({ userId }).sort({ calculatedAt: -1 });

        if (!latestScore) {
            return res.status(400).json({
                status: 400,
                message: "No credit score found. Please generate a score first via GET /api/score/:userId",
            });
        }

        const creditScore = latestScore.creditScore;

        // Find lenders matching score range and loan amount range
        const matchingLenders = await Lender.find({
            minCreditScore: { $lte: creditScore },
            maxCreditScore: { $gte: creditScore },
            minLoanAmount: { $lte: loanAmount },
            maxLoanAmount: { $gte: loanAmount },
        })
            .sort({ interestRate: 1 }) // lowest interest rate first
            .select("name interestRate minLoanAmount maxLoanAmount tenure minCreditScore maxCreditScore");

        res.status(200).json({
            status: 200,
            creditScore,
            requestedLoanAmount: loanAmount,
            matchingLenders: matchingLenders.map((l) => ({
                lenderId: l._id,
                name: l.name,
                interestRate: l.interestRate,
                loanAmount,
                tenure: l.tenure,
            })),
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { getEndorsement };
