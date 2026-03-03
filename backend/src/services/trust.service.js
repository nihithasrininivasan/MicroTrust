// In-memory store for hackathon demo (replace with PostgreSQL later)
const endorsements = {};
const userScores = {};

const addEndorsement = (endorserId, endorseeId) => {
  // Check for circular endorsement
  if (endorsements[endorseeId]?.includes(endorserId)) {
    throw { statusCode: 400, message: 'Circular endorsement detected and blocked' };
  }

  if (!endorsements[endorseeId]) {
    endorsements[endorseeId] = [];
  }

  // Max 5 endorsers per user
  if (endorsements[endorseeId].length >= 5) {
    throw { statusCode: 400, message: 'Maximum of 5 endorsers reached' };
  }

  // Check if already endorsed
  if (endorsements[endorseeId].includes(endorserId)) {
    throw { statusCode: 400, message: 'You have already endorsed this user' };
  }

  endorsements[endorseeId].push(endorserId);

  return {
    success: true,
    message: 'Endorsement added successfully',
    endorseeId,
    totalEndorsers: endorsements[endorseeId].length
  };
};

const getEndorsements = (userId) => {
  return {
    userId,
    endorsers: endorsements[userId] || [],
    totalEndorsers: (endorsements[userId] || []).length
  };
};

const calculateTrustScore = (userId) => {
  const userEndorsers = endorsements[userId] || [];
  const endorsementCount = userEndorsers.length;

  // Each endorser contributes up to 3% (max 15% total from trust network)
  const trustScore = Math.min(endorsementCount * 3, 15);

  return {
    userId,
    endorsementCount,
    trustNetworkScore: trustScore,
    maxPossible: 15
  };
};

module.exports = { addEndorsement, getEndorsements, calculateTrustScore };