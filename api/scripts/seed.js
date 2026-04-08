/**
 * Script de semilla para poblar LogicOh con objetos enriquecidos de vocabulario/logica.
 * Uso: npm run seed
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { MongoClient } = require('mongodb');
const { DATABASE_NAME, COLLECTION_NAME } = require('../src/config/db');
const { normalizeMetadata, normalizeTags } = require('../src/models/wordModel');
const { SEED_WORDS } = require('../src/data/seedWords');

function buildSeedDocument(word) {
  return {
    term: word.term,
    category: word.category,
    tags: normalizeTags(word.tags),
    definition: word.definition,
    example: word.example,
    metadata: normalizeMetadata(word.metadata),
  };
}

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI is not defined.');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(`Connected to MongoDB. Database: ${DATABASE_NAME}`);

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const preparedWords = SEED_WORDS.map(buildSeedDocument);

    await collection.deleteMany({});
    console.log(`Collection ${COLLECTION_NAME} cleared.`);

    const result = await collection.insertMany(preparedWords);
    console.log(`${result.insertedCount} words inserted.`);
  } catch (error) {
    console.error('Database seed failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDatabase();
