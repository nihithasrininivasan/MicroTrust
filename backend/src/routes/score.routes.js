const express = require('express');
const router = express.Router();
const { getScoreFromML } = require('../services/mlClient.service');
const { calculateTrustScore } = require('../services/trust.service');

// GET /api/score/:userId
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Get trust network score
    const trustData = calculateTrustScore(userId);

    // Build user data object for ML
    const userData = {
      userId,
      transactionConsistency: 0.75,
      avgMonthlySpend: 8000,
      billPaymentRegularity: 0.80,
      rechargeStability: 0.70,
      incomeProxy: 15000,
      spendingDiversity: 0.65,
      trustNetworkScore: trustData.trustNetworkScore,
      digitalFootprintAge: 180
    };

    // Get score from ML service
    const scoreData = await getScoreFromML(userData);

    res.status(200).json({
      success: true,
      userId,
      score: scoreData.score,
      risk: scoreData.risk,
      breakdown: scoreData.breakdown,
      trustNetwork: trustData
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/score/compute
router.post('/compute', async (req, res, next) => {
  try {
    const userData = req.body;

    if (!userData.userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const trustData = calculateTrustScore(userData.userId);
    userData.trustNetworkScore = trustData.trustNetworkScore;

    const scoreData = await getScoreFromML(userData);

    res.status(200).json({
      success: true,
      userId: userData.userId,
      score: scoreData.score,
      risk: scoreData.risk,
      breakdown: scoreData.breakdown,
      trustNetwork: trustData
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;