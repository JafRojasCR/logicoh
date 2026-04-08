require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const { getRandomWordController } = require('./src/controllers/wordController');

const app = express();
const port = Number(process.env.API_PORT || 3001);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  return res.status(200).json({ status: 'ok', service: 'logicoh-api' });
});

app.options('/api/get-word', getRandomWordController);
app.get('/api/get-word', getRandomWordController);
app.all('/api/get-word', getRandomWordController);

app.all('/api/*', (req, res) => {
  return res.status(404).json({ error: `Route not found: ${req.path}` });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`LogicOh API running on http://localhost:${port}`);
  });
}

module.exports = app;
