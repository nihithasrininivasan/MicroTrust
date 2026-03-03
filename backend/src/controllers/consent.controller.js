const User = require("../../models/User");

// ──────────────────────────────────────────────────────────────────────────────
// Consent Controller
// POST /api/consent (Protected)
// Captures the user's consent for data usage in credit scoring.
// Sets `consentGiven` to true and persists the update.
// ──────────────────────────────────────────────────────────────────────────────

const giveConsent = async (req, res, next) => {
    try {
        // req.user.id is set by the authMiddleware after JWT verification
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found.",
            });
        }

        // If consent was already given, inform the client (idempotent behavior)
        if (user.consentGiven) {
            return res.status(200).json({
                success: true,
                message: "Consent was already recorded.",
            });
        }

        // Record consent and save
        user.consentGiven = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Consent recorded successfully. Your data will now be used for credit scoring.",
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { giveConsent };
