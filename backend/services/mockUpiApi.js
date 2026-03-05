/**
 * Mock UPI API Service
 * =====================
 * Simulates UPI transaction data for a user. In production, this would
 * connect to an Account Aggregator or UPI provider API. For now, it
 * generates deterministic per-user behavioral features based on user
 * attributes + some randomization seeded by userId.
 *
 * Returns normalized (0.0–1.0) behavioral features that feed directly
 * into the ML scoring pipeline.
 */

/**
 * Simple seeded pseudo-random from a string (userId).
 * Returns a function that gives the next random number each time.
 */
function seededRandom(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32-bit integer
    }
    return function () {
        hash = Math.sin(hash + 1) * 10000;
        return hash - Math.floor(hash);
    };
}

/**
 * Clamp a value between 0 and 1.
 */
function clamp01(val) {
    return Math.max(0, Math.min(1, val));
}

/**
 * Fetch mock UPI transaction data and compute behavioral features.
 *
 * @param {Object} user - User document from MongoDB
 * @param {string} userId - User's ObjectId string (used as seed)
 * @param {Object} options
 * @param {number} options.endorsementCount - Number of endorsements
 * @param {boolean} options.hasConsent - Whether user gave consent
 * @returns {Object} Behavioral features + mock transaction summary
 */
function getMockUPIData(user, userId, { endorsementCount = 0, hasConsent = false } = {}) {
    const rand = seededRandom(userId);

    // ── Simulate monthly transaction patterns ─────────────────────────────
    const monthlyTxnCount = Math.floor(rand() * 60) + 5;  // 5–65 transactions
    const avgTxnAmount = Math.floor(rand() * 3000) + 200;  // ₹200–₹3200
    const billsCount = Math.floor(rand() * 8) + 1;         // 1–8 bill payments
    const rechargeCount = Math.floor(rand() * 6) + 1;      // 1–6 recharges
    const p2pCount = monthlyTxnCount - billsCount - rechargeCount;
    const missedBills = Math.floor(rand() * 3);             // 0–2 missed
    const consecutiveDays = Math.floor(rand() * 25) + 3;   // 3–28 active days

    // ── Compute normalized behavioral features (0.0–1.0) ──────────────────

    // UPI Consistency: ratio of active days in month + transaction regularity
    const upi_consistency = clamp01(
        (consecutiveDays / 30) * 0.6 +
        (Math.min(monthlyTxnCount, 50) / 50) * 0.4
    );

    // Bill Payment Regularity: bills paid vs bills expected, penalize misses
    const expectedBills = billsCount + missedBills;
    const bill_payment_regularity = clamp01(
        expectedBills > 0
            ? (billsCount / expectedBills) * 0.7 + (consecutiveDays > 15 ? 0.3 : 0.1)
            : 0.3
    );

    // Recharge Frequency: mobile recharges relative to expected monthly
    const recharge_frequency = clamp01(
        (rechargeCount / 4) * 0.5 +
        (monthlyTxnCount > 20 ? 0.3 : 0.1) +
        (rand() * 0.2)
    );

    // Income Stability: based on user's monthly income + transaction consistency
    const incomeNorm = user.monthlyIncome
        ? clamp01(user.monthlyIncome / 50000)
        : clamp01(avgTxnAmount * monthlyTxnCount / 100000);
    const income_stability = clamp01(
        incomeNorm * 0.6 +
        (consecutiveDays / 30) * 0.3 +
        (hasConsent ? 0.1 : 0.0)
    );

    // Community Trust Score: based on endorsements
    const community_trust_score = clamp01(
        (Math.min(endorsementCount, 5) / 5) * 0.7 +
        (user.endorsements ? Math.min(user.endorsements, 5) / 5 * 0.2 : 0) +
        (rand() * 0.1)
    );

    return {
        // Features for ML pipeline (all 0.0–1.0)
        features: {
            upi_consistency: Math.round(upi_consistency * 10000) / 10000,
            bill_payment_regularity: Math.round(bill_payment_regularity * 10000) / 10000,
            recharge_frequency: Math.round(recharge_frequency * 10000) / 10000,
            income_stability: Math.round(income_stability * 10000) / 10000,
            community_trust_score: Math.round(community_trust_score * 10000) / 10000,
        },

        // Raw transaction summary for display
        transactionSummary: {
            monthlyTxnCount,
            avgTxnAmount,
            billsCount,
            rechargeCount,
            p2pCount,
            missedBills,
            consecutiveDays,
        },
    };
}

module.exports = { getMockUPIData };
