const User = require("../models/User");
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
        });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/auth/login
 * Authenticate a user and return a JWT.
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
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { register, login };
