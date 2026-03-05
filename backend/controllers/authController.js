const User = require("../models/User");
const Score = require("../models/Score");
const Consent = require("../models/Consent");
const Endorsement = require("../models/Endorsement");
const { signToken } = require("../utils/jwt");

/**
 * POST /api/auth/register
 * Create a new user account and return a JWT.
 */
async function register(req, res, next) {
    try {
        const { email, password, name, phone, monthlyIncome, upiTransactions, endorsements } = req.body;

        // Check if email already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 400,
                message: "Email already exists",
            });
        }

        // Create user (password is hashed by pre-save hook)
        const user = await User.create({
            email,
            password,
            name,
            phone,
            monthlyIncome: monthlyIncome || 0,
            upiTransactions: upiTransactions || 0,
            endorsements: endorsements || 0,
        });

        // Generate JWT
        const token = signToken(user._id);

        res.status(201).json({
            status: 200,
            message: "Registration successful",
            userId: user._id,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                monthlyIncome: user.monthlyIncome,
                upiTransactions: user.upiTransactions,
            },
        });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/auth/login
 * Authenticate a user and return a JWT + user profile.
 */
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // Find user and explicitly select the password field
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                status: 401,
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                status: 401,
                message: "Invalid email or password",
            });
        }

        // Generate JWT
        const token = signToken(user._id);

        res.status(200).json({
            status: 200,
            message: "Login successful",
            userId: user._id,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                monthlyIncome: user.monthlyIncome,
                upiTransactions: user.upiTransactions,
            },
        });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/auth/profile
 * Return the authenticated user's profile.
 */
async function getProfile(req, res, next) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        // Get latest score
        const latestScore = await Score.findOne({ userId: user._id }).sort({ calculatedAt: -1 });

        // Get consent status
        const consent = await Consent.findOne({ userId: user._id, consentGiven: true });

        // Get endorsement count
        const endorsementCount = await Endorsement.countDocuments({ userId: user._id });

        res.status(200).json({
            status: 200,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                monthlyIncome: user.monthlyIncome,
                upiTransactions: user.upiTransactions,
                endorsementCount,
                hasConsent: !!consent,
                latestScore: latestScore ? latestScore.creditScore : null,
                scoreRange: latestScore ? latestScore.scoreRange : null,
                riskLevel: latestScore ? latestScore.riskLevel : null,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        next(err);
    }
}

/**
 * DELETE /api/auth/account
 * Delete the authenticated user and all associated data.
 */
async function deleteAccount(req, res, next) {
    try {
        const userId = req.user.id;

        // Delete all associated data
        await Promise.all([
            User.deleteOne({ _id: userId }),
            Score.deleteMany({ userId }),
            Consent.deleteMany({ userId }),
            Endorsement.deleteMany({ userId }),
        ]);

        res.status(200).json({
            status: 200,
            message: "Account and all associated data deleted successfully",
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { register, login, getProfile, deleteAccount };
