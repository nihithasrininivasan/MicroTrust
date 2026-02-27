const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const getScoreFromML = async (userData) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
      user_id: userData.userId,
      transaction_consistency: userData.transactionConsistency || 0.75,
      avg_monthly_spend: userData.avgMonthlySpend || 8000,
      bill_payment_regularity: userData.billPaymentRegularity || 0.80,
      recharge_stability: userData.rechargeStability || 0.70,
      income_proxy: userData.incomeProxy || 15000,
      spending_diversity: userData.spendingDiversity || 0.65,
      trust_network_score: userData.trustNetworkScore || 0,
      digital_footprint_age: userData.digitalFootprintAge || 180
    });

    return response.data;

  } catch (error) {
    // Fallback mock score if ML service is down (for demo)
    console.warn('ML service unavailable, using mock score');
    return generateMockScore(userData);
  }
};

const generateMockScore = (userData) => {
  const base = 500;
  const trustBonus = (userData.trustNetworkScore || 0) * 6;
  const consistencyBonus = (userData.transactionConsistency || 0.75) * 100;
  const billBonus = (userData.billPaymentRegularity || 0.80) * 80;

  const rawScore = base + trustBonus + consistencyBonus + billBonus;
  const finalScore = Math.min(Math.max(Math.round(rawScore), 300), 900);

  return {
    score: finalScore,
    probability: (finalScore - 300) / 600,
    breakdown: {
      transactionConsistency: Math.round(consistencyBonus),
      billPaymentRegularity: Math.round(billBonus),
      trustNetwork: Math.round(trustBonus),
      baseScore: base
    },
    risk: finalScore >= 750 ? 'Excellent' :
          finalScore >= 650 ? 'Good' :
          finalScore >= 500 ? 'Moderate' : 'High Risk'
  };
};

module.exports = { getScoreFromML };