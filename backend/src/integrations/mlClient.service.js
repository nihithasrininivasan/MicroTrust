const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const pingMLService = async () => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`);
    return { status: 'online', data: response.data };
  } catch (error) {
    return { status: 'offline', message: 'ML service unreachable' };
  }
};

const predictScore = async (features) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, features);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('ML prediction failed:', error.message);
    return {
      success: false,
      error: 'ML service unavailable'
    };
  }
};

const getFeatureImportance = async () => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/feature-importance`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Could not fetch feature importance'
    };
  }
};

module.exports = { pingMLService, predictScore, getFeatureImportance };