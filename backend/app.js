const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { generalLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/auth");
const consentRoutes = require("./routes/consent");
const scoreRoutes = require("./routes/scores");
const lenderRoutes = require("./routes/lenders");

const app = express();

// ── Global Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(generalLimiter);

// ── Health Check ─────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API Routes ───────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);       // POST /api/auth/register, POST /api/auth/login
app.use("/api/consent", consentRoutes); // POST /api/consent
app.use("/api/score", scoreRoutes);     // GET  /api/score/:userId
app.use("/api/lenders", lenderRoutes);  // POST /api/lenders/endorsement

// ── 404 Handler ──────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ status: 404, message: "Route not found" });
});

// ── Error Handler ────────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
