/**
 * Seed script — populates the Lender collection with sample Indian bank data.
 * Run:  node seeds/lenders.seed.js
 */
require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");
const Lender = require("../models/Lender");

const lenders = [
    {
        name: "HDFC Bank",
        minCreditScore: 650,
        maxCreditScore: 900,
        interestRate: 5.2,
        minLoanAmount: 100000,
        maxLoanAmount: 5000000,
        tenure: 12,
    },
    {
        name: "ICICI Bank",
        minCreditScore: 600,
        maxCreditScore: 900,
        interestRate: 5.8,
        minLoanAmount: 50000,
        maxLoanAmount: 3000000,
        tenure: 12,
    },
    {
        name: "SBI",
        minCreditScore: 550,
        maxCreditScore: 900,
        interestRate: 6.5,
        minLoanAmount: 25000,
        maxLoanAmount: 2000000,
        tenure: 24,
    },
    {
        name: "Axis Bank",
        minCreditScore: 620,
        maxCreditScore: 900,
        interestRate: 6.0,
        minLoanAmount: 75000,
        maxLoanAmount: 4000000,
        tenure: 18,
    },
    {
        name: "Kotak Mahindra Bank",
        minCreditScore: 580,
        maxCreditScore: 900,
        interestRate: 6.8,
        minLoanAmount: 30000,
        maxLoanAmount: 2500000,
        tenure: 12,
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding");

        await Lender.deleteMany({});
        const inserted = await Lender.insertMany(lenders);
        console.log(`✅ Seeded ${inserted.length} lenders`);
    } catch (err) {
        console.error("❌ Seed error:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

seed();
