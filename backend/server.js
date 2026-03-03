require("dotenv").config();
const dns = require("dns");
const mongoose = require("mongoose");
const app = require("./src/app");

// ──────────────────────────────────────────────────────────────────────────────
// DNS Workaround: Use Google's public DNS (8.8.8.8) for SRV record resolution.
// Some networks (college/corporate) block SRV DNS lookups that MongoDB Atlas
// requires for the mongodb+srv:// protocol.
// ──────────────────────────────────────────────────────────────────────────────
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ──────────────────────────────────────────────────────────────────────────────
// Server Entry Point
// Connects to MongoDB first, then starts the Express server.
// If the MONGO_URI from .env is unreachable (e.g. firewall blocks port 27017),
// falls back to an in-memory MongoDB instance for local development.
// ──────────────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

// Validate critical environment variables before proceeding
if (!process.env.JWT_SECRET) {
  console.error("[server] JWT_SECRET is not defined in .env — exiting.");
  process.exit(1);
}

// ── Helper: start Express after DB is connected ──────────────────────────────
function startServer() {
  app.listen(PORT, () => {
    console.log(`[server] MicroTrust API listening on port ${PORT}`);
    console.log(`[server] Endpoints:`);
    console.log(`         POST http://localhost:${PORT}/api/register`);
    console.log(`         POST http://localhost:${PORT}/api/login`);
    console.log(`         POST http://localhost:${PORT}/api/consent  (JWT)`);
    console.log(`         GET  http://localhost:${PORT}/api/score    (JWT)`);
  });
}

// ── Connect to MongoDB ──────────────────────────────────────────────────────
async function main() {
  const MONGO_URI = process.env.MONGO_URI;

  // Try connecting to Atlas / external MongoDB first
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
      console.log("[server] Connected to MongoDB Atlas successfully.");
      return startServer();
    } catch (err) {
      console.warn("[server] Could not connect to external MongoDB:", err.message);
      console.warn("[server] Falling back to in-memory MongoDB...");
    }
  }

  // Fallback: spin up an in-memory MongoDB (no network required)
  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create({
      binary: { version: "4.4.29" },
    });
    const memUri = mongod.getUri();
    await mongoose.connect(memUri);
    console.log("[server] Connected to in-memory MongoDB successfully.");
    console.log("[server] NOTE: Data will be lost when the server stops.");
    startServer();
  } catch (err) {
    console.error("[server] Failed to start in-memory MongoDB:", err.message);
    process.exit(1);
  }
}

main();
