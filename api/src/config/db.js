const { MongoClient } = require('mongodb');

const DATABASE_NAME = process.env.MONGODB_DB_NAME || 'logicoh';
const COLLECTION_NAME = process.env.MONGODB_COLLECTION || 'conceptos';

let cachedClient = null;

async function getClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined.');
  }

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return cachedClient;
}

async function getWordsCollection() {
  const client = await getClient();
  const db = client.db(DATABASE_NAME);
  return db.collection(COLLECTION_NAME);
}

module.exports = {
  DATABASE_NAME,
  COLLECTION_NAME,
  getWordsCollection,
};
