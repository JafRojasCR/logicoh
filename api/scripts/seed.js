/**
 * Script de semilla para poblar la base de datos de LogicOh!
 * con conceptos de razonamiento lógico y vocabulario universitario.
 *
 * Uso: MONGODB_URI=<tu-uri> node scripts/seed.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { MongoClient } = require('mongodb');

const CONCEPTOS = [
  {
    term: 'Silogismo',
    category: 'sustantivo',
    definition:
      'Argumento lógico que deriva una conclusión a partir de dos premisas relacionadas entre sí.',
    example:
      'Todo ser humano es mortal; Sócrates es un ser humano; por lo tanto, Sócrates es mortal.',
  },
  {
    term: 'Falacia',
    category: 'sustantivo',
    definition:
      'Argumento que parece válido pero contiene un error de razonamiento que invalida su conclusión.',
    example:
      'El candidato argumentó ad hominem en lugar de refutar las cifras presentadas por su oponente.',
  },
  {
    term: 'Deducción',
    category: 'sustantivo',
    definition:
      'Proceso de razonamiento que parte de principios generales para llegar a conclusiones particulares con certeza lógica.',
    example:
      'Mediante deducción, el científico concluyó que el experimento confirmaría su hipótesis.',
  },
  {
    term: 'Inducción',
    category: 'sustantivo',
    definition:
      'Método de razonamiento que extrae principios generales a partir de la observación de casos particulares.',
    example:
      'Por inducción, el investigador generalizó que todos los metales conducen electricidad tras estudiar varios ejemplos.',
  },
  {
    term: 'Analogía',
    category: 'sustantivo',
    definition:
      'Relación de semejanza entre cosas distintas que permite transferir conclusiones de un campo a otro.',
    example:
      'El filósofo usó la analogía del barco y su capitán para explicar la relación entre el Estado y su gobernante.',
  },
  {
    term: 'Premisa',
    category: 'sustantivo',
    definition:
      'Proposición o afirmación que sirve de punto de partida para construir un argumento lógico.',
    example:
      'La premisa mayor del silogismo establecía que todos los mamíferos son vertebrados.',
  },
  {
    term: 'Hipótesis',
    category: 'sustantivo',
    definition:
      'Suposición fundamentada que se formula como punto de partida para una investigación o razonamiento.',
    example:
      'La hipótesis central de la tesis sostenía que el bilingüismo mejora las capacidades cognitivas.',
  },
  {
    term: 'Axioma',
    category: 'sustantivo',
    definition:
      'Proposición que se acepta como verdadera sin necesidad de demostración por considerarse evidente.',
    example:
      'En geometría euclidiana, el axioma de que dos puntos definen una recta es irrefutable.',
  },
  {
    term: 'Paradoja',
    category: 'sustantivo',
    definition:
      'Afirmación que parece contradictoria o absurda pero que encierra una verdad o dificultad lógica real.',
    example:
      'La paradoja del mentiroso plantea que si alguien dice "estoy mintiendo", no puede determinarse si es verdad o mentira.',
  },
  {
    term: 'Inferencia',
    category: 'sustantivo',
    definition:
      'Proceso mental por el cual se obtiene una conclusión a partir de evidencias o proposiciones previas.',
    example:
      'A partir de las huellas en la nieve, el detective realizó la inferencia de que dos personas habían cruzado el bosque.',
  },
  {
    term: 'Abstracción',
    category: 'sustantivo',
    definition:
      'Operación mental que aísla características esenciales de un objeto o fenómeno, prescindiendo de lo particular.',
    example:
      'La abstracción matemática permite trabajar con conceptos como el infinito sin referentes físicos concretos.',
  },
  {
    term: 'Anodino',
    category: 'adjetivo',
    definition:
      'Que carece de interés, relevancia o cualidad notable; intrascendente o insípido.',
    example:
      'El ensayo presentado resultó anodino y no aportó ningún argumento novedoso al debate.',
  },
  {
    term: 'Refutación',
    category: 'sustantivo',
    definition:
      'Demostración de que una proposición, argumento o teoría es falsa o incorrecta mediante pruebas o razonamiento.',
    example:
      'Su refutación del argumento contrario fue tan contundente que dejó sin respuesta a todos los oponentes.',
  },
  {
    term: 'Dicotomía',
    category: 'sustantivo',
    definition:
      'División de un concepto o grupo en dos partes opuestas y generalmente excluyentes entre sí.',
    example:
      'El debate planteaba la dicotomía entre libertad individual y bienestar colectivo.',
  },
  {
    term: 'Tautología',
    category: 'sustantivo',
    definition:
      'Afirmación que es verdadera en todos los casos posibles por su propia estructura lógica, sin aportar información nueva.',
    example:
      'Decir que "o llueve o no llueve" es una tautología, pues no puede ser de otra manera.',
  },
  {
    term: 'Corolario',
    category: 'sustantivo',
    definition:
      'Consecuencia lógica que se desprende directamente de un teorema o proposición ya demostrada.',
    example:
      'Como corolario del principio de igualdad, la ley no puede discriminar a ningún ciudadano.',
  },
  {
    term: 'Empirismo',
    category: 'sustantivo',
    definition:
      'Corriente filosófica que sostiene que el conocimiento se origina principalmente en la experiencia sensorial.',
    example:
      'El empirismo de Locke rechazaba las ideas innatas y afirmaba que la mente comienza como una tabla en blanco.',
  },
  {
    term: 'Equívoco',
    category: 'adjetivo',
    definition:
      'Que puede interpretarse de más de una manera y genera confusión o malentendido.',
    example:
      'El comunicado oficial resultó equívoco y provocó interpretaciones contradictorias en la prensa.',
  },
  {
    term: 'Postulado',
    category: 'sustantivo',
    definition:
      'Principio que se admite sin demostración como base para construir una teoría o sistema de razonamiento.',
    example:
      'Los cinco postulados de Euclides fundamentan toda la geometría clásica.',
  },
  {
    term: 'Contrafactual',
    category: 'adjetivo',
    definition:
      'Que hace referencia a una situación o evento contrario a los hechos reales, generalmente en forma condicional.',
    example:
      'El análisis contrafactual exploró qué habría ocurrido si la vacuna hubiera llegado un mes antes.',
  },
];

async function poblarDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: la variable MONGODB_URI no está definida.');
    process.exit(1);
  }

  const cliente = new MongoClient(uri);

  try {
    await cliente.connect();
    console.log('Conexión a MongoDB Atlas establecida.');

    const db = cliente.db('logicoh');
    const coleccion = db.collection('conceptos');

    // Limpiar colección existente antes de insertar
    await coleccion.deleteMany({});
    console.log('Colección limpiada.');

    const resultado = await coleccion.insertMany(CONCEPTOS);
    console.log(`${resultado.insertedCount} conceptos insertados correctamente.`);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  } finally {
    await cliente.close();
  }
}

poblarDB();
