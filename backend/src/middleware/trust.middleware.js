const validateTrustRequest = (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'userId is required'
    });
  }

  next();
};

const validateEndorsement = (req, res, next) => {
  const { endorserId, endorseeId } = req.body;

  if (!endorserId || !endorseeId) {
    return res.status(400).json({
      success: false,
      error: 'endorserId and endorseeId are required'
    });
  }

  if (endorserId === endorseeId) {
    return res.status(400).json({
      success: false,
      error: 'Users cannot endorse themselves'
    });
  }

  next();
};

module.exports = { validateTrustRequest, validateEndorsement };