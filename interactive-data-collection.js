const inquirer = require('inquirer');
const runNewman = require('./run-newman');



/**
 * Questa è una procedura che permette all' utente di inserire dinamicamente i dati.
 *
 * @param {string} collectionsName - nome della collection
 * @param {string} environmentsName - nome dell 'environment
 * @returns { } non ritorna nulla
 */ 

async function interactiveData(collectionName, environmentName) {

  const data = [];

        while (true) {
          const answer = await inquirer.prompt([
            {
              type: 'list',
              name: 'dataType',
              message: 'Seleziona il tipo di dato da inserire:',
              choices: ['PAN', 'Codice Fiscale', 'Tipo Servizio', 'Tipo Posizione', 'Fine'],
            },
          ]);
      
          if (answer.dataType === 'Fine') {
            break;
          }
      
          if (answer.dataType === 'Tipo Servizio') {
            const serviceTypes = await inquirer.prompt([
              {
                type: 'checkbox',
                name: 'values',
                message: 'Seleziona il tipo di servizio (SMS e/o ACS):',
                choices: ['SMS', 'ACS'],
              },
            ]);
            data.push({ key: 'INPUT_serviceList', value: JSON.stringify(serviceTypes.values) });
          } else if (answer.dataType === 'Tipo Posizione') {
            const positionTypes = await inquirer.prompt([
              {
                type: 'checkbox',
                name: 'values',
                message: 'Seleziona il tipo di posizione (1 e/o 4):',
                choices: ['1', '4'],
              },
            ]);
            data.push({ key: 'INPUT_positionType', value: JSON.stringify(positionTypes.values) });
          } else {
            const inputData = await inquirer.prompt([
              {
                type: 'input',
                name: 'value',
                message: `Inserisci il ${answer.dataType} (separati da virgola se più di uno):`,
              },
            ]);
      
            const key = answer.dataType === 'Codice Fiscale' ? 'INPUT_fcList' : `INPUT_${answer.dataType.toLowerCase()}List`;
            const formattedInput = inputData.value.split(',').map(value => value.trim()).join(', ');
            data.push({ key, value: formattedInput });
          }
        }      
      
        console.log('dati inseriti '+ JSON.stringify(data, null, 2));
      
      
        // richiamo la funzione Newman
        runNewman.runNewman(collectionName, environmentName , data );

        return;

      }// fine interactiveData


      module.exports = { interactiveData };
