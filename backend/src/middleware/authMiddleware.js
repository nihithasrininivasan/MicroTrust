const jwt = require("jsonwebtoken");

// ──────────────────────────────────────────────────────────────────────────────
// JWT Authentication Middleware
// Protects private routes by verifying the Bearer token from the
// Authorization header. On success, attaches the decoded user id to `req.user`.
// ──────────────────────────────────────────────────────────────────────────────

const authMiddleware = (req, res, next) => {
    try {
        // 1. Extract the Authorization header
        const authHeader = req.header("Authorization");

        // 2. Check if header exists and follows "Bearer <token>" format
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "Access denied. No token provided.",
            });
        }

        // 3. Extract the raw token (everything after "Bearer ")
        const token = authHeader.split(" ")[1];

        // 4. Verify the token using the secret from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Attach user id to the request object for downstream route handlers
        req.user = { id: decoded.id };

        // 6. Pass control to the next middleware / route handler
        next();
    } catch (err) {
        // Token is invalid, expired, or malformed
        return res.status(401).json({
            success: false,
            error: "Invalid or expired token.",
        });
    }
};

module.exports = authMiddleware;
