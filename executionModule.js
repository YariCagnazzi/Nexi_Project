const inquirer = require('inquirer');
const newman = require('./run-newman');
const { JSONCollectionReader } = require('./JSONCollectionReader');
const funzioni = require('./funzioni');


/**
 * Funzione asincrona per eseguire una collezione e gestire le opzioni dopo l'esecuzione.
 *
 * @param {object} collectionData - Dati della collezione.
 * @param {object} environmentData - Dati dell'ambiente.
 * @returns {void} - Non ritorna nulla.
 */


async function executeCollection(collectionData, environmentData) {
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
      const collectionsNames = new JSONCollectionReader('collections').readFolder();
      const environmentsNames = new JSONCollectionReader('environments').readFolder();
      await funzioni.getMainMenu(collectionsNames, environmentsNames);
      break;
    case 'Riesegui la collection':
      await executeCollection(collectionData, environmentData);
      break;
    case 'Termina':
      break;
    default:
      // Se la scelta non corrisponde a nessun caso, non fare nulla
      break;
  }
}

module.exports = { executeCollection };