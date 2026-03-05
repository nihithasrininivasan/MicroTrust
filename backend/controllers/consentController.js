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

/**
 * GET /api/consent/status
 * Return the user's current consent status.
 */
async function getConsentStatus(req, res, next) {
    try {
        const consents = await Consent.find({ userId: req.user.id })
            .sort({ grantedAt: -1 });

        const activeConsent = consents.find(
            (c) => c.consentGiven && new Date(c.expiresAt) > new Date()
        );

        res.status(200).json({
            status: 200,
            hasActiveConsent: !!activeConsent,
            consents: consents.map((c) => ({
                id: c._id,
                consentGiven: c.consentGiven,
                consentType: c.consentType,
                grantedAt: c.grantedAt,
                expiresAt: c.expiresAt,
            })),
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { giveConsent, getConsentStatus };
