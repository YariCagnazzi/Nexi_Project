const inquirer = require('inquirer');
const { Collection } = require('./Collection');
const { Environment } = require('./Environment');
const conOp = require('./collectionOperations');


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
        message: 'Seleziona cosa vuoi effettuare tra Mostra, Modifica, Elimina, Reset input, Aggiungi, Esegui e Termina:',
        choices: ['Mostra', 'Modifica', 'Elimina', 'Reset input', 'Aggiungi', 'Esegui', 'Termina'],
      },
    ]);

    await conOp.performOperation(dataType, collectionData, environmentData);
  }
}

module.exports = { interactiveData };