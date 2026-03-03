const Consent = require("../models/Consent");

/**
 * POST /api/consent
 * Record user's consent for data access.
 */
async function giveConsent(req, res, next) {
    try {
        const { consentGiven, consentType } = req.body;

        const consent = await Consent.create({
            userId: req.user.id,
            consentGiven,
            consentType: consentType || "credit_data_access",
        });

        res.status(200).json({
            status: 200,
            message: "Consent recorded successfully",
            consentId: consent._id,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { giveConsent };
