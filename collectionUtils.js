const inquirer = require('inquirer');

// Costante per il prefisso delle variabili di input
const INPUT_VARIABLE_PREFIX = "INPUT_";

// Funzione per ottenere le variabili di input dall'oggetto collection
function getInputVariables(collection) {
  const inputVariables = {};

  if (collection && collection.variable) {
    collection.variable.forEach((item) => {
      if (item.key && item.key.startsWith(INPUT_VARIABLE_PREFIX)) {
        inputVariables[item.key] = item.value;
      }
    });
  }

  return inputVariables;
}

// Funzione per impostare i valori di input aggiornando l'oggetto collection
function setInputVariables(collection, requiredKeys) {
  collection.variable = Object.keys(requiredKeys).map((key) => ({
    key,
    value: requiredKeys[key],
  }));

  return collection;
}

// Funzione per ottenere i valori delle variabili di input dall'utente
async function checkSelectedCollection(collection, environment) {
  const requiredKeys = getInputVariables(collection);

  const questions = Object.keys(requiredKeys).map((key) => ({
    type: 'input',
    name: key,
    message: `Inserisci il valore per ${key}:`,
  }));

  try {
    const answers = await inquirer.prompt(questions);

    // Aggiorna i valori delle variabili di input con le risposte dell'utente
    Object.keys(answers).forEach((key) => {
      requiredKeys[key] = answers[key];
    });

    const collectionUpdate = setInputVariables(collection, requiredKeys);

    // Ritorna gli oggetti collectionUpdate e environment
    return { collectionUpdate, environment };
  } catch (error) {
    console.error("Errore durante l'interazione con l'utente o l'esecuzione di Newman:", error);
  }
}

// Funzione per rimuovere uno o più valori delle variabili di input dall'utente
async function removeValues(collection) {
  const inputVariables = getInputVariables(collection);

  for (const key in inputVariables) {
    const removeValue = await inquirer.prompt([
      {
        type: 'input',
        name: 'removedValue',
        message: `Inserisci il valore da rimuovere da '${key}':`,
      },
    ]);

    const values = inputVariables[key].split(',').map(value => value.trim());
    const removedValue = removeValue.removedValue.trim();

    const updatedValues = values.filter(value => value !== removedValue);

    inputVariables[key] = updatedValues.join(', ');
  }

  // Aggiorna i valori nell'oggetto originale collection
  collection.variable.forEach((item) => {
    if (item.key && item.key in inputVariables) {
      item.value = inputVariables[item.key];
    }
  });

  console.log(collection);
  return ;
}

// Procedura per modificare uno o più valori delle variabili di input dall'utente
async function modifyValues(collection) {
  const inputVariables = getInputVariables(collection);

  if (Object.keys(inputVariables).length === 0) {
    console.log('Nessuna variabile di input trovata nella collecion.');
    return ;
  }

  const modifyDataType = await inquirer.prompt([
    {
      type: 'list',
      name: 'dataType',
      message: 'Seleziona il tipo di dati da modificare:',
      choices: Object.keys(inputVariables),
    },
  ]);

  const dataTypeKey = modifyDataType.dataType;
  const oldValue = inputVariables[dataTypeKey];

  const modifyInput = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      message: `Modificare il valore di ${dataTypeKey} (separare più valori con virgole):`,
      default: oldValue,
    },
  ]);

  const formattedInput = modifyInput.value.split(',').map(value => value.trim()).join(',');

  if (oldValue !== formattedInput) {
    console.log(`Valore di ${dataTypeKey} modificato da "${oldValue}" a "${formattedInput}".`);
    collection.variable.forEach((item) => {
      if (item.key === dataTypeKey) {
        item.value = formattedInput;
      }
    });
  } else {
    console.log(`Valore di ${dataTypeKey} invariato.`);
  }
  console.log(collection);
  return ;
}



module.exports = { checkSelectedCollection, removeValues, modifyValues };
