// ──────────────────────────────────────────────────────────────────────────────
// Global Error Handler
// Catches all errors forwarded via next(err) and returns a structured response.
// Handles Mongoose validation errors, duplicate key errors, and JSON parse
// errors with appropriate HTTP status codes.
// ──────────────────────────────────────────────────────────────────────────────

function errorHandler(err, _req, res, _next) {
    console.error("[error]", err.stack || err.message);

    // Mongoose validation error (e.g. missing required fields)
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            error: "Validation failed.",
            details: messages,
        });
    }

    // MongoDB duplicate key error (e.g. duplicate phone number)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            success: false,
            error: `Duplicate value for field: ${field}`,
        });
    }

    // Malformed JSON in request body
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            error: "Malformed JSON in request body.",
        });
    }

    // Default: Internal Server Error
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Internal server error.",
    });
}

module.exports = errorHandler;
