const mongoose = require("mongoose");

const lenderSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        minCreditScore: { type: Number, required: true },
        maxCreditScore: { type: Number, required: true },
        interestRate: { type: Number, required: true },
        minLoanAmount: { type: Number, required: true },
        maxLoanAmount: { type: Number, required: true },
        tenure: { type: Number, required: true }, // months
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lender", lenderSchema);
