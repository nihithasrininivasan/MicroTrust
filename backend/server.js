require("dotenv").config();
const { PORT } = require("./config/environment");
const connectDB = require("./config/database");
const app = require("./app");

async function start() {
  // Connect to MongoDB first, then listen
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 [MicroTrust] Server running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
