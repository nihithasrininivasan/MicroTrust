const mongoose = require("mongoose");

const consentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        consentGiven: {
            type: Boolean,
            required: true,
        },
        consentType: {
            type: String,
            enum: ["credit_data_access", "financial_data_access", "lender_sharing"],
            default: "credit_data_access",
        },
        grantedAt: { type: Date, default: Date.now },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Consent", consentSchema);
