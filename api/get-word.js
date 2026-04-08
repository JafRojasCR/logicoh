const { MongoClient } = require('mongodb');

// Paleta de colores oscuros para el fondo
const PALETA_OSCURA = [
  '#1E1E1E',
  '#1A3A5F',
  '#2D3436',
  '#2C3E50',
  '#30336B',
  '#130F40',
];

let clienteDB = null;

async function conectarDB() {
  if (clienteDB) return clienteDB;
  const cliente = new MongoClient(process.env.MONGODB_URI);
  await cliente.connect();
  clienteDB = cliente;
  return clienteDB;
}

function obtenerColorAleatorio() {
  return PALETA_OSCURA[Math.floor(Math.random() * PALETA_OSCURA.length)];
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const cliente = await conectarDB();
    const db = cliente.db('logicoh');
    const coleccion = db.collection('conceptos');

    // Obtener un concepto aleatorio usando $sample de MongoDB
    const [concepto] = await coleccion
      .aggregate([{ $sample: { size: 1 } }])
      .toArray();

    if (!concepto) {
      return res.status(404).json({ error: 'No se encontraron conceptos en la base de datos.' });
    }

    const respuesta = {
      term: concepto.term,
      category: concepto.category,
      definition: concepto.definition,
      example: concepto.example,
      style: {
        backgroundColor: obtenerColorAleatorio(),
        textColor: '#FFFFFF',
      },
    };

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error('Error al obtener concepto:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
