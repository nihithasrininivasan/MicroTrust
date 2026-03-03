const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

if (!process.env.MONGO_URI) {
    console.error("FATAL: MONGO_URI not set in .env");
    process.exit(1);
}

module.exports = { PORT, JWT_SECRET, JWT_EXPIRES_IN };
