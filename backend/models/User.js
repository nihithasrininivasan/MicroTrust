const mongoose = require("mongoose");

// ──────────────────────────────────────────────────────────────────────────────
// User Schema — stores registration data, behavioral signals, and consent flag.
// The `phone` field is the unique login identifier (no email needed for
// micro-lending populations). Password is stored as a bcrypt hash.
// ──────────────────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // Phone number — serves as unique login identifier
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },

    // Hashed password (bcrypt)
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Never returned in queries by default (security)
    },

    // Self-reported monthly income — used in credit score calculation
    monthlyIncome: {
      type: Number,
      required: [true, "Monthly income is required"],
    },

    // Number of UPI transactions — behavioral signal for creditworthiness
    upiTransactions: {
      type: Number,
      default: 5,
    },

    // Community endorsements — social trust indicator
    endorsements: {
      type: Number,
      default: 0,
    },

    // Whether the user has given consent for data usage in scoring
    consentGiven: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
