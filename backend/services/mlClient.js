/**
 * ML Service Client
 * Calls the FastAPI ML service at /generate-score to get ensemble predictions.
 */

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * Call the ML ensemble pipeline to generate a MicroTrust score.
 *
 * @param {Object} features - 5 behavioral features (0.0–1.0 each)
 * @param {number} features.upi_consistency
 * @param {number} features.bill_payment_regularity
 * @param {number} features.recharge_frequency
 * @param {number} features.income_stability
 * @param {number} features.community_trust_score
 * @returns {Promise<{microtrust_score: number, risk_bucket: string, model_confidence: number, top_risk_factors: string[]}>}
 */
async function generateMLScore(features) {
    try {
        const response = await fetch(`${ML_SERVICE_URL}/generate-score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(features),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error(`ML service error (${response.status}): ${text}`);
            return null; // Fallback to rule-based scoring
        }

        return response.json();
    } catch (err) {
        console.error("ML service unreachable:", err.message);
        return null; // Fallback to rule-based scoring
    }
}

module.exports = { generateMLScore };
