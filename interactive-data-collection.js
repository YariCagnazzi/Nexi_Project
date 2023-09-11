const inquirer = require('inquirer');
const runNewman = require('./run-newman');


/**
 * Questa è una procedura che permette all' utente di inserire dinamicamente i dati.
 *
 * @param {string} collectionsName - nome della collection
 * @param {string} environmentsName - nome dell 'environment
 * @returns { void } non ritorna nulla
 */ 

async function interactiveData(collectionName, environmentName) {
  const data = [];
  const dataHistory = []; // Create an array to store data history

  while (true) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'dataType',
        message: 'Seleziona cosa vuoi effettuare tra inserire, cancellare o modificare:',
        choices: ['Inserisci', 'Cancella', 'Modifica', 'Visualizza Storico', 'Fine'],
      },
    ]);

    if (answer.dataType === 'Fine') {
      break;
    } else if (answer.dataType === 'Visualizza Storico') {
      console.log('Storico dei dati inseriti:\n', JSON.stringify(dataHistory, null, 2));
      continue; // Skip the rest of the loop and go back to the beginning
    }

    if (answer.dataType === 'Inserisci') {
      //inizio inserimento
      const insertDataType = await inquirer.prompt([
        {
          type: 'list',
          name: 'dataType',
          message: 'Seleziona il tipo di dato da inserire:',
          choices: ['PAN', 'Codice Fiscale', 'Tipo Servizio', 'Tipo Posizione'],
        },
      ]);

      if (insertDataType.dataType === 'Tipo Servizio') {
        const serviceTypes = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'values',
            message: 'Seleziona il tipo di servizio (SMS e/o ACS):',
            choices: ['sms', 'acs'],
          },
        ]);

        const formattedServiceTypes = serviceTypes.values.join('\n');

        data.push({ key: 'INPUT_serviceList', value: formattedServiceTypes });
      } else if (insertDataType.dataType === 'Tipo Posizione') {
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
            message: `Inserisci il ${insertDataType.dataType} (separati da virgola se più di uno):`,
          },
        ]);

        const key = insertDataType.dataType === 'Codice Fiscale' ? 'INPUT_fcList' : `INPUT_${insertDataType.dataType.toLowerCase()}List`;
        const formattedInput = inputData.value.split(',').map(value => value.trim()).join(', ');

        data.push({ key, value: formattedInput });

        dataHistory.push({ operation: 'Inserisci', data: { key, value: formattedInput } });
      }
      // fine inserimento
    } else if (answer.dataType === 'Cancella') {

      //inizio cancellazione
      const deleteDataType = await inquirer.prompt([
        {
          type: 'list',
          name: 'dataType',
          message: 'Seleziona il tipo di dato da cui cancellare un valore:',
          choices: data.map(item => item.key),
        },
      ]);

      const dataIndex = data.findIndex(item => item.key === deleteDataType.dataType);

      if (dataIndex !== -1) {
        const selectedData = data[dataIndex];

        const removeValue = await inquirer.prompt([
          {
            type: 'input',
            name: 'removedValue',
            message: `Inserisci il valore da rimuovere da '${selectedData.key}':`,
          },
        ]);

        const values = selectedData.value.split(',').map(value => value.trim());
        const removedValue = removeValue.removedValue.trim();

        const updatedValues = values.filter(value => value !== removedValue);

        selectedData.value = updatedValues.join(', ');

        console.log(`Valore rimosso da '${selectedData.key}': ${removedValue}`);
      } else {
        console.log('Nessun dato corrispondente trovato.');
      }
      //fine cancellazione
    } else if (answer.dataType === 'Modifica') {

      //inizio modifica
      const modifyDataType = await inquirer.prompt([
        {
          type: 'list',
          name: 'dataType',
          message: 'Seleziona il tipo di dato da modificare:',
          choices: data.map(item => item.key),
        },
      ]);

      const modifyIndex = data.findIndex(item => item.key === modifyDataType.dataType);
      if (modifyIndex !== -1) {
        const modifyData = data[modifyIndex];
        const modifyInput = await inquirer.prompt([
          {
            type: 'input',
            name: 'value',
            message: `Modifica il valore di ${modifyData.key} (separati da virgola se più di uno):`,
            default: modifyData.value,
          },
        ]);

        const formattedInput = modifyInput.value.split(',').map(value => value.trim()).join(', ');
        data[modifyIndex].value = formattedInput;

        dataHistory.push({ operation: 'Modifica', data: { key: modifyData.key, value: formattedInput } });
        console.log(`Dato modificato: ${modifyData.key} - ${formattedInput}`);
      } else {
        console.log('Nessun dato corrispondente trovato.');
      }
      //fine modifica
    }
  }

  console.log('Dati inseriti:', JSON.stringify(data, null, 2));

  // Call the Newman function
  runNewman.runNewman(collectionName, environmentName, data);

  return;
}

  module.exports = { interactiveData };
