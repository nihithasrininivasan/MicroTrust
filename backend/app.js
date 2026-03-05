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
const endorsementRoutes = require("./routes/endorsements");
const rewardRoutes = require("./routes/rewards");

const app = express();

// ── Global Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(morgan("combined"));
app.use(express.json());
app.use(generalLimiter);

// ── Health Check ─────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API Routes ───────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);             // POST /register, POST /login, GET /profile, DELETE /account
app.use("/api/consent", consentRoutes);       // POST /, GET /status
app.use("/api/score", scoreRoutes);           // GET /:userId, GET /:userId/history
app.use("/api/lenders", lenderRoutes);        // POST /endorsement
app.use("/api/endorsements", endorsementRoutes); // GET /, POST /, DELETE /:id
app.use("/api/rewards", rewardRoutes);        // GET /

// ── 404 Handler ──────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ status: 404, message: "Route not found" });
});

// ── Error Handler ────────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
