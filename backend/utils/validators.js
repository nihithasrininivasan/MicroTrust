const { body, param } = require("express-validator");
const { validationResult } = require("express-validator");

// ── Middleware to check validation results ──────────────────────────────
function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: "Validation failed",
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
}

// ── Registration rules ──────────────────────────────────────────────────
const registerRules = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required").trim().escape(),
    body("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .trim()
        .matches(/^[0-9]{10}$/)
        .withMessage("Phone must be a 10-digit number"),
];

// ── Login rules ─────────────────────────────────────────────────────────
const loginRules = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
];

// ── Consent rules ───────────────────────────────────────────────────────
const consentRules = [
    body("consentGiven")
        .isBoolean()
        .withMessage("consentGiven must be true or false"),
    body("consentType")
        .optional()
        .isIn(["credit_data_access", "financial_data_access", "lender_sharing"])
        .withMessage("Invalid consent type"),
];

// ── Endorsement rules ───────────────────────────────────────────────────
const endorsementRules = [
    body("loanAmount")
        .isNumeric()
        .withMessage("loanAmount must be a number")
        .isFloat({ min: 1000 })
        .withMessage("loanAmount must be at least 1000"),
];

// ── userId param rule ───────────────────────────────────────────────────
const userIdParamRule = [
    param("userId").isMongoId().withMessage("Invalid user ID format"),
];

module.exports = {
    validate,
    registerRules,
    loginRules,
    consentRules,
    endorsementRules,
    userIdParamRule,
};
