const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// ── Route imports ────────────────────────────────────────────────────────────
const authRoutes = require("./routes/auth.routes");
const consentRoutes = require("./routes/consent.routes");
const scoreRoutes = require("./routes/score.routes");

// ── Middleware imports ───────────────────────────────────────────────────────
const errorHandler = require("./middleware/errorHandler");

// ──────────────────────────────────────────────────────────────────────────────
// Express Application Setup
// ──────────────────────────────────────────────────────────────────────────────

const app = express();

// ── Global middleware ────────────────────────────────────────────────────────
app.use(helmet());                  // Security headers
app.use(cors());                    // Enable CORS for all origins
app.use(morgan("combined"));       // HTTP request logging
app.use(express.json());           // Parse JSON request bodies

// ── Health check endpoint (public) ───────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

// ── API Routes ───────────────────────────────────────────────────────────────
// Auth routes (public) — register and login
app.use("/api", authRoutes);

// Consent route (protected) — requires JWT
app.use("/api/consent", consentRoutes);

// Score route (protected) — requires JWT
app.use("/api/score", scoreRoutes);

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;
