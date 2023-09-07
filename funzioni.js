const inquirer = require('inquirer');
const procedure = require('./procedure');


/**
 * Questa è una procedura che visualizza il menu principale.
 *
 * @param {string[]} collectionsNames - Lista di collections
 * @param {string[]} environmentsNames - Lista di environment
 * @returns {void}
 */
async function getMainMenu(collectionsNames, environmentsNames) {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'collectionChoice',
        message: 'Scegli la collection che vuoi eseguire:',
        choices: collectionsNames,
      },
      {
        type: 'list',
        name: 'environmentChoice',
        message: 'In quale ambiente vuoi eseguire la collezione?',
        choices: environmentsNames,
      },
    ]);

    console.info('Risposte inserite:', answers);

    const collectionName = answers.collectionChoice;
    const environmentName = answers.environmentChoice;

    console.info(collectionName);
    console.info(environmentName);

    // Richiama il sottomenu
    procedure.subMenu(collectionName, environmentName);
  } catch (error) {
    console.error('Errore durante l\'esecuzione del menu principale:', error);
  }
}

module.exports = { getMainMenu };