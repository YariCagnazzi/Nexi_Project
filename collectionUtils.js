const inquirer = require('inquirer');

//costante per il prefisso delle variabili di input
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


module.exports = { checkSelectedCollection };