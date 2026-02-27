const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const trustRoutes = require('./routes/trust.routes');
const scoreRoutes = require('./routes/score.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MicroTrust Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/trust', trustRoutes);
app.use('/api/score', scoreRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;