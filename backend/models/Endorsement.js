const mongoose = require("mongoose");

const endorsementSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Reference name is required"],
            trim: true,
        },
        type: {
            type: String,
            enum: ["Local Shop Owner", "Employer", "Supplier", "SHG Member", "Regular Customer", "Merchant", "Peer"],
            default: "Peer",
        },
        phone: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Verified"],
            default: "Pending",
        },
        strength: {
            type: Number,
            min: 1,
            max: 5,
            default: 3,
        },
        duration: {
            type: Number, // months
            default: 0,
        },
        score: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Endorsement", endorsementSchema);
