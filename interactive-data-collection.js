const inquirer = require('inquirer');
const { CollectionUtils } = require('./collectionUtils');
const newman = require('./run-newman');
const { Collection } = require('./Collection');
const { Environment } = require('./Environment');

/**
 * Esegue un'operazione interattiva basata sul tipo di dato selezionato.
 *
 * @param {string} dataType - Tipo di operazione da eseguire (Inserisci, Cancella, Modifica, Fine)
 * @param {Collection} collectionData - Dati della collection
 * @param {Environment} environmentData - Dati dell'environment
 * @returns {void} Non ritorna nulla
 */
async function performOperation(dataType, collectionData, environmentData) {
  const utils = new CollectionUtils(collectionData, environmentData);
  switch (dataType) {
    case 'Mostra':
      await utils.showInputList();
      break;
    case 'Inserisci':
      await utils.checkSelectedCollection();
      break;
    case 'Cancella':
      await utils.removeValues();
      break;
    case 'Modifica':
      await utils.modifyValues();
      break;
    case 'Reset input':
      await utils.resetValues();
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
    const { dataType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'dataType',
        message: 'Seleziona cosa vuoi effettuare tra inserire, cancellare o modificare:',
        choices: ['Mostra','Inserisci', 'Cancella', 'Modifica', 'Reset input', 'Fine'],
      },
    ]);

    if (dataType === 'Fine') {
      break;
    }

    await performOperation(dataType, collectionData, environmentData);
  }

  newman.runNewman(collectionData, environmentData);
}

module.exports = { interactiveData };