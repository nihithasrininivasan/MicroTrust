const rateLimit = require("express-rate-limit");

// ── General limiter (all routes) ────────────────────────────────────────
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: "Too many requests, please try again after 15 minutes.",
    },
});

// ── Auth limiter (register + login) ─────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // 20 attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: "Too many auth attempts, please try again after 15 minutes.",
    },
});

module.exports = { generalLimiter, authLimiter };
