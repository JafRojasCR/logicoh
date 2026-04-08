const { getRandomWord } = require('../services/wordService');
const { buildWordResponse } = require('../views/wordView');
const { setCorsHeaders, handleOptions } = require('../utils/http');

async function getRandomWordController(req, res) {
  setCorsHeaders(res);

  if (handleOptions(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const word = await getRandomWord();

    if (!word) {
      return res.status(404).json({ error: 'No words found in the collection.' });
    }

    return res.status(200).json(buildWordResponse(word));
  } catch (error) {
    console.error('Error while getting random word:', error);

    if (String(error?.message || '').includes('MONGODB_URI')) {
      return res.status(500).json({
        error: 'MONGODB_URI is not configured. Create api/.env and set database variables.',
      });
    }

    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = {
  getRandomWordController,
};
