const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        creditScore: {
            type: Number,
            required: true,
            min: 0,
            max: 900,
        },
        scoreRange: {
            type: String,
            enum: ["Poor", "Fair", "Good", "Excellent"],
            required: true,
        },
        riskLevel: {
            type: String,
            enum: ["High Risk", "Medium Risk", "Low Risk"],
            required: true,
        },
        calculatedAt: { type: Date, default: Date.now },
        validTill: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);
