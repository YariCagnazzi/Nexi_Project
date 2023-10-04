const inquirer = require('inquirer');
const { CollectionUtils } = require('./collectionUtils');
const newman = require('./run-newman');
const { Collection, Environment } = require('./BaseClass');

/**
 * Esegue un'operazione interattiva basata sul tipo di dato selezionato.
 *
 * @param {string} dataType - Tipo di operazione da eseguire (Inserisci, Cancella, Modifica, Fine)
 * @param {Collection} collectionData - Dati della collection
 * @param {Environment} environmentData - Dati dell'environment
 * @returns {void} Non ritorna nulla
 */

async function performOperation(dataType, collectionData, environmentData) {
  switch (dataType) {
    case 'Inserisci':
      await new CollectionUtils(collectionData, environmentData).checkSelectedCollection();
      break;
    case 'Cancella':
      await new CollectionUtils(collectionData, environmentData).removeValues();
      break;
    case 'Modifica':
      await new CollectionUtils(collectionData, environmentData).modifyValues();
      break;
    default:
      // Se il dataType non corrisponde a nessun caso, non fare nulla 
      break;
  }
}

/**
 * Conduce un'interazione interattiva con l'utente per inserire, cancellare o modificare dati dinamicamente.
 *
 * @param {string} collectionName - Nome della collection
 * @param {string} environmentName - Nome dell'environment
 * @returns {void} Non ritorna nulla
 */


async function interactiveData(collectionName, environmentName) {
  const collectionData = new Collection(collectionName).getData();
  const environmentData = new Environment(environmentName).getData();

  while (true) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'dataType',
        message: 'Seleziona cosa vuoi effettuare tra inserire, cancellare o modificare:',
        choices: ['Inserisci', 'Cancella', 'Modifica', 'Fine'],
      },
    ]);

    if (answer.dataType === 'Fine') {
      break;
    }

    await performOperation(answer.dataType, collectionData, environmentData);
  }

  newman.runNewman(collectionData, environmentData);
}

module.exports = { interactiveData };