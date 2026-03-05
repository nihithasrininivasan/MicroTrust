/**
 * Seed script — populates the Reward collection with sample data.
 * Run:  node seeds/rewards.seed.js
 */
require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");
const Reward = require("../models/Reward");

const rewards = [
    {
        title: "Electricity Cashback",
        provider: "BESCOM",
        value: "₹50 OFF",
        icon: "electricity",
        scoreNeeded: 500,
        isActive: true,
    },
    {
        title: "Merchant Perk",
        provider: "Amazon Pay",
        value: "5% Boost",
        icon: "shopping",
        scoreNeeded: 600,
        isActive: true,
    },
    {
        title: "Credit Multiplier",
        provider: "MicroTrust",
        value: "2x Bonus",
        icon: "gift",
        scoreNeeded: 700,
        isActive: true,
    },
    {
        title: "Premium Loan Rate",
        provider: "HDFC Bank",
        value: "0.5% Lower",
        icon: "star",
        scoreNeeded: 750,
        isActive: true,
    },
    {
        title: "Free UPI Insurance",
        provider: "SBI",
        value: "₹1L Cover",
        icon: "ticket",
        scoreNeeded: 650,
        isActive: true,
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding rewards");

        await Reward.deleteMany({});
        const inserted = await Reward.insertMany(rewards);
        console.log(`✅ Seeded ${inserted.length} rewards`);
    } catch (err) {
        console.error("❌ Seed error:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

seed();
