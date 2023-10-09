const newman = require('newman');
/**
 * Esegui la collezione con Newman
 *
 * @param {Object} collection - Oggetto che rappresenta la collezione
 * @param {Object} environment - Oggetto che rappresenta l'ambiente
 */
async function runNewman(collection, environment) {
  try {
    console.log('----------------Running collection----------');
    const summary = await executeCollection(collection, environment);
    handleCollectionSummary(summary);
  } catch (error) {
    console.error('Errore durante l\'esecuzione della collection:', error);
  }
}

/**
 * Esegui la collezione e restituisci un riepilogo
 *
 * @param {Object} collection - Oggetto che rappresenta la collezione
 * @param {Object} environment - Oggetto che rappresenta l'ambiente
 * @returns {Promise<Object>} - Riepilogo dell'esecuzione della collezione
 */
function executeCollection(collection, environment) {
  return new Promise((resolve, reject) => {
    newman.run({
      collection: collection,
      environment: environment,
      insecure: true,
    }, (err, summary) => {
      if (err || summary.error) {
        reject(err || summary.error);
      } else {
        resolve(summary);
      }
    });
  });
}

/**
 * Gestisci il riepilogo dell'esecuzione della collezione
 *
 * @param {Object} summary - Riepilogo dell'esecuzione della collezione
 */
function handleCollectionSummary(summary) {
  console.info(summary.environment.name);

  const resultVariable = summary.environment.values.members.find(variable => variable.key === 'RESULT');
  if (resultVariable) {
    const result = resultVariable.value;
    console.info(result);
  } else {
    console.error('Variabile "RESULT" non trovata nell\'ambiente.');
  }

  summary.run.failures.forEach((err, index) => {
    console.error(`****** ERRORE ****** ${index}: ${JSON.stringify(err.error.message)} IN ${JSON.stringify(err.parent.name)}`);
  });

  console.log('Esecuzione della collection completata.');
}

module.exports = { runNewman };