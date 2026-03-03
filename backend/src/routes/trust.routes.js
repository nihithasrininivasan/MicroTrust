const express = require('express');
const router = express.Router();
const { validateEndorsement, validateTrustRequest } = require('../middleware/trust.middleware');
const { addEndorsement, getEndorsements, calculateTrustScore } = require('../services/trust.service');

// GET /api/trust/:userId — get all endorsements for a user
router.get('/:userId', (req, res, next) => {
  try {
    const { userId } = req.params;
    const data = getEndorsements(userId);

    res.status(200).json({
      success: true,
      ...data
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/trust/:userId/score — get trust network score
router.get('/:userId/score', (req, res, next) => {
  try {
    const { userId } = req.params;
    const data = calculateTrustScore(userId);

    res.status(200).json({
      success: true,
      ...data
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/trust/endorse — add an endorsement
router.post('/endorse', validateEndorsement, (req, res, next) => {
  try {
    const { endorserId, endorseeId } = req.body;
    const result = addEndorsement(endorserId, endorseeId);

    res.status(201).json(result);

  } catch (error) {
    next(error);
  }
});

module.exports = router;