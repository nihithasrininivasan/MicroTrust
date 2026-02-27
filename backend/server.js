const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  ✅ MicroTrust Backend Running
  🚀 Server: http://localhost:${PORT}
  🏥 Health: http://localhost:${PORT}/health
  📊 Score API: http://localhost:${PORT}/api/score/:userId
  🤝 Trust API: http://localhost:${PORT}/api/trust/:userId
  `);
});