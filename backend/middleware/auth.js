const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");

/**
 * JWT authentication middleware.
 * Extracts Bearer token from Authorization header, verifies it,
 * and attaches the user object to req.user.
 */
async function auth(req, res, next) {
    try {
        // 1. Extract token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: 401,
                message: "Access denied. No token provided.",
            });
        }

        const token = authHeader.split(" ")[1];

        // 2. Verify token
        const decoded = verifyToken(token);

        // 3. Check user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                status: 401,
                message: "User belonging to this token no longer exists.",
            });
        }

        // 4. Attach user to request
        req.user = { id: user._id.toString(), email: user.email, name: user.name };
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                status: 401,
                message: "Token has expired. Please log in again.",
            });
        }
        return res.status(401).json({
            status: 401,
            message: "Invalid token.",
        });
    }
}

module.exports = auth;
