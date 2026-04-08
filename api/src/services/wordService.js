const { ObjectId } = require('mongodb');
const { getWordsCollection } = require('../config/db');
const { toWordDTO } = require('../models/wordModel');

async function getRandomWord() {
  const collection = await getWordsCollection();

  const [sampledWord] = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();

  if (!sampledWord) {
    return null;
  }

  let sampledId = sampledWord._id;
  if (!(sampledId instanceof ObjectId)) {
    try {
      sampledId = new ObjectId(sampledWord._id);
    } catch (error) {
      sampledId = sampledWord._id;
    }
  }

  const updated = await collection.findOneAndUpdate(
    { _id: sampledId },
    { $inc: { 'metadata.viewCount': 1 } },
    { returnDocument: 'after' }
  );

  const updatedDocument = updated?.value || updated || sampledWord;

  return toWordDTO(updatedDocument);
}

module.exports = {
  getRandomWord,
};
