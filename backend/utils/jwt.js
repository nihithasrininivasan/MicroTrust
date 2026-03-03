const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/environment");

/**
 * Generate a signed JWT for a given user ID.
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @returns {string} Signed JWT string.
 */
function signToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT.
 * @param {string} token - The JWT string.
 * @returns {object} Decoded payload ({ id, iat, exp }).
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken };
