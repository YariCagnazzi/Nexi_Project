const inquirer = require('inquirer');

// Funzione per ottenere le variabili di input dall'oggetto collection  
function getInputVariables(collection) {
  const inputVariables = {};

  if (collection && collection.variable) {
    collection.variable.forEach((item) => {
      if (item.key && item.key.startsWith("INPUT_")) {
        inputVariables[item.key] = item.value;
      }
    });
  }

  return inputVariables;
}

//funzione per setttare i valori di input aggiornando l'oggetto collection
function setInputVariables(collection, requiredKeys) {
  collection.variable = Object.keys(requiredKeys).map((key) => ({
    key,
    value: requiredKeys[key],
  }));
}


// Funzione per ottenere i valori delle variabili di input dall'utente
async function checkSelectedCollection(collection) {
  const requiredKeys = getInputVariables(collection);

  const questions = Object.keys(requiredKeys).map((key) => ({
    type: 'input',
    name: key,
    message: `Inserisci il valore per ${key}:`,
  }));

  const answers = await inquirer.prompt(questions);

  // Aggiorna i valori delle variabili di input con le risposte dell'utente
  Object.keys(answers).forEach((key) => {
    requiredKeys[key] = answers[key];
  });

  setInputVariables(collection, requiredKeys);
// console.info(collection);
  return ;
}


module.exports = { checkSelectedCollection };