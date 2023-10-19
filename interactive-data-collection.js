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
    case 'Modifica':
      await utils.modifyValues();
      break;  
    case 'Elimina':
      await utils.removeValues();
      break;
    case 'Reset input':
      await utils.resetValues();
      break;
    case 'Aggiungi':
      await utils.checkSelectedCollection();
      break;    
    case 'Esegui':
      await newman.runNewman(collectionData, environmentData);
      const { afterExecutionChoice } = await inquirer.prompt([
        {
          type: 'list',
          name: 'afterExecutionChoice',
          message: 'Cosa vuoi fare dopo l\'esecuzione della collection?',
          choices: ['Esegui un\'altra collection', 'Riesegui la collection', 'Termina'],
        },
      ]);
      switch (afterExecutionChoice) {
        case 'Esegui un\'altra collection':
          // Aggiungi la logica per eseguire un'altra collection
          // Ad esempio, richiedi il nome della nuova collection e dell'environment
          // e chiama la funzione interactiveData con i nuovi dati.
          break;
        case 'Riesegui la collection':
          await newman.runNewman(collectionData, environmentData);
          break;
        case 'Termina':
          await utils.exit();
          break;
        default:
          // Se la scelta non corrisponde a nessun caso, non fare nulla 
          break;
      }
      break;
    case 'Termina':
      await utils.exit();
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
        message: 'Seleziona cosa vuoi effettuare tra Mostra, Modifica, Elimina, Reset input, Aggiungi, Esegui e Termina:',
        choices: ['Mostra', 'Modifica', 'Elimina', 'Reset input', 'Aggiungi', 'Esegui', 'Termina'],
      },
    ]);

    await performOperation(dataType, collectionData, environmentData);
  }
}

module.exports = { interactiveData };