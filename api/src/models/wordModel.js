function normalizeMetadata(metadata) {
  return {
    difficulty: Number.isInteger(metadata?.difficulty) ? metadata.difficulty : 3,
    viewCount: Number.isInteger(metadata?.viewCount) ? metadata.viewCount : 0,
  };
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .filter((tag) => typeof tag === 'string' && tag.trim().length > 0)
    .map((tag) => tag.trim().toLowerCase());
}

function toWordDTO(document) {
  return {
    _id: document._id,
    term: document.term || '',
    category: document.category || '',
    tags: normalizeTags(document.tags),
    definition: document.definition || '',
    example: document.example || '',
    metadata: normalizeMetadata(document.metadata),
  };
}

module.exports = {
  toWordDTO,
  normalizeMetadata,
  normalizeTags,
};
