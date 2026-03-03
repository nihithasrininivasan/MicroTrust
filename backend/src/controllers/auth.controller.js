const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// ──────────────────────────────────────────────────────────────────────────────
// Auth Controller — handles user registration and login
// ──────────────────────────────────────────────────────────────────────────────

// ── REGISTER ─────────────────────────────────────────────────────────────────
// POST /api/register
// Accepts: name, phone, password, monthlyIncome
// Returns: success message with the created user's id
// ──────────────────────────────────────────────────────────────────────────────

const register = async (req, res, next) => {
    try {
        const { name, phone, password, monthlyIncome } = req.body;

        // --- Input validation ---------------------------------------------------
        if (!name || !phone || !password || monthlyIncome === undefined) {
            return res.status(400).json({
                success: false,
                error: "All fields are required: name, phone, password, monthlyIncome",
            });
        }

        // --- Check for duplicate phone ------------------------------------------
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: "A user with this phone number already exists.",
            });
        }

        // --- Hash the password (salt rounds = 10) --------------------------------
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- Create and save the new user ----------------------------------------
        const user = await User.create({
            name,
            phone,
            password: hashedPassword,
            monthlyIncome,
        });

        // --- Respond with success (never return the password hash) ----------------
        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: { userId: user._id },
        });
    } catch (err) {
        next(err); // Forward to the global error handler
    }
};

// ── LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/login
// Accepts: phone, password
// Returns: JWT token (valid for 24 hours)
// ──────────────────────────────────────────────────────────────────────────────

const login = async (req, res, next) => {
    try {
        const { phone, password } = req.body;

        // --- Input validation ---------------------------------------------------
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                error: "Phone and password are required.",
            });
        }

        // --- Look up user (explicitly select the password field) -----------------
        const user = await User.findOne({ phone }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid phone number or password.",
            });
        }

        // --- Compare the supplied password with the stored hash -----------------
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: "Invalid phone number or password.",
            });
        }

        // --- Sign a JWT containing the user's id --------------------------------
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        // --- Return the token to the client -------------------------------------
        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };
