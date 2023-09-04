const inquirer = require('inquirer');
const procedure = require('./procedure');


/**
 * Questa è una procedura che visualizza il menu principale.
 *
 * @param {string} collectionsNames - lista di collections
 * @param {string} environmentsNames -lista di environment
 * @returns { } non ritorna nulla
 */

function getMainMenu(collectionsNames, environmentsNames) {
  // richiama il menu principale
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'collectionChoice',
          message: 'Scegli la collection che vuoi eseguire:',
          choices: collectionsNames
        },
        {
          type: 'list',
          name: 'environmentChoice',
          message: 'In quale ambiente vuoi eseguire la collezione?',
          choices: environmentsNames
        }
      ])
      .then((answers) => {
        console.info('Risposte inserite:', answers);
  
        const collectionName = answers['collectionChoice'];
        const environmentName = answers['environmentChoice'];
  
        console.info(collectionName);
        console.info(environmentName);

        //richiama il sottomenu
            procedure.subMenu(collectionName, environmentName);
        
    
    
    });


}; //fine getMainMenu




module.exports = {getMainMenu};