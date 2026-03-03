/**
 * Enhanced global error handler.
 * Handles Mongoose errors, JWT errors, malformed JSON, and generic errors.
 */
function errorHandler(err, _req, res, _next) {
    console.error("Error:", err);

    // ── Mongoose validation error ───────────────────────────────────────
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            status: 400,
            message: "Validation error",
            errors: messages,
        });
    }

    // ── Mongoose duplicate key (e.g. email already exists) ──────────────
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            status: 400,
            message: `Duplicate value: ${field} already exists.`,
        });
    }

    // ── Mongoose bad ObjectId ───────────────────────────────────────────
    if (err.name === "CastError") {
        return res.status(400).json({
            status: 400,
            message: `Invalid ${err.path}: ${err.value}`,
        });
    }

    // ── JWT errors ──────────────────────────────────────────────────────
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            status: 401,
            message: "Invalid token.",
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            status: 401,
            message: "Token has expired.",
        });
    }

    // ── Malformed JSON body ─────────────────────────────────────────────
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            status: 400,
            message: "Malformed JSON in request body.",
        });
    }

    // ── Generic server error ────────────────────────────────────────────
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: statusCode,
        message: err.message || "Internal server error",
    });
}

module.exports = errorHandler;
