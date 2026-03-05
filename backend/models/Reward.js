const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        provider: {
            type: String,
            required: true,
            trim: true,
        },
        value: {
            type: String,
            required: true, // e.g. "₹50 OFF", "5% Boost"
        },
        icon: {
            type: String,
            enum: ["electricity", "shopping", "gift", "ticket", "star"],
            default: "gift",
        },
        scoreNeeded: {
            type: Number,
            required: true,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardSchema);
