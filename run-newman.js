const newman = require('newman');
const fs = require('fs');

/**
 * Funzione per aggiornare i valori delle variabili nella collezione.
 *
 * @param {string} collectionFilePath - percorso del file della collezione
 * @param {Array} newValues - nuovi valori da aggiornare
 */
function updateCollectionValues(collectionFilePath, newValues) {
  // Leggi la collezione dal file o da una fonte
  const collection = JSON.parse(fs.readFileSync(collectionFilePath, 'utf8'));

  // Aggiorna i valori desiderati con i nuovi valori forniti
  for (const newValue of newValues) {
    const itemToUpdate = collection.variable.find(item => item.key === newValue.key);
    if (itemToUpdate) {
      if (itemToUpdate.value === ' ') {
        itemToUpdate.value = newValue.value;
      } else {
        itemToUpdate.value += `, ${newValue.value}`;
      }
    }
  }

  // Converti la collezione aggiornata in formato JSON
  const updatedCollectionJSON = JSON.stringify(collection, null, 2);

  // Scrivi il file JSON aggiornato
  fs.writeFileSync(collectionFilePath, updatedCollectionJSON, 'utf-8');
}

/**
 * Funzione per eseguire una collezione con Newman.
 *
 * @param {string} collectionName - nome della collezione
 * @param {string} environmentName - nome dell'ambiente
 * @param {Array} data - dati di input per l'aggiornamento della collezione
 */
function runNewman(collectionName, environmentName, data) {
  const baseCollection = './collections/';
  const baseEnv = './environments/';

  // Costruisci il percorso completo della collezione
  const collectionFilePath = `${baseCollection}${collectionName}`;
  console.info(collectionFilePath);

  // Costruisci il percorso completo dell'ambiente
  const environmentFilePath = `${baseEnv}${environmentName}`;
  console.log(environmentFilePath);

  // Aggiorna la collezione con i dati di input
  updateCollectionValues(collectionFilePath, data);

  console.log('----------------Running collection----------');

  newman.run({
    // Imposta la collezione
    collection: collectionFilePath,
    // Imposta le variabili d'ambiente
    environment: environmentFilePath,
    // Disabilita la verifica SSL
    insecure: true,
  }).on('start', function (err, args) {
    console.log('Running a collection...');
  }).on('done', function (err, summary) {
    if (err || summary.error) {
      console.error('Collection run encountered an error.');
    } else {
      console.info(summary.environment.name);
      // Recupero variabile RESULT in INTEGRATION e STAGING
      console.info('SUCCESS: ' + summary.environment.values.members[27].value);

      // Recupero degli eventuali errori e/o asserzioni
      summary.run.failures.forEach((err, index) => {
        console.error(`****** ERROR ****** ${index}: ${JSON.stringify(err.error.message)} IN ${JSON.stringify(err.parent.name)}`);
      });

      console.log('Collection run completed.');
    }
  });
}

module.exports = { runNewman };