const { getRandomPaletteColor } = require('../constants/stylePalette');

function buildWordResponse(word) {
  return {
    _id: String(word._id),
    term: word.term,
    category: word.category,
    tags: word.tags,
    definition: word.definition,
    example: word.example,
    metadata: word.metadata,
    style: {
      backgroundColor: getRandomPaletteColor(),
      textColor: '#FFFFFF',
    },
  };
}

module.exports = {
  buildWordResponse,
};
