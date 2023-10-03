const inquirer = require('inquirer');
const CodiceFiscaleUtils = require('@marketto/codice-fiscale-utils');

// Costante per il prefisso delle variabili di input
const INPUT_VARIABLE_PREFIX = "INPUT_";

class CollectionUtils {
  constructor(collection, environment) {
    this.collection = collection;
    this.environment = environment;
  }

  // Funzione per ottenere le variabili di input dall'oggetto collection
  getInputVariables() {
    const inputVariables = {};

    if (this.collection && this.collection.variable) {
      this.collection.variable.forEach((item) => {
        if (item.key && item.key.startsWith(INPUT_VARIABLE_PREFIX)) {
          inputVariables[item.key] = item.value;
        }
      });
    }

    return inputVariables;
  }

  // Funzione per impostare i valori di input aggiornando l'oggetto collection
  setInputVariables(requiredKeys) {
    this.collection.variable = Object.keys(requiredKeys).map((key) => ({
      key,
      value: requiredKeys[key],
    }));

    return this.collection;
  }
  
  // Funzione per ottenere i valori delle variabili di input dall'utente
  async checkSelectedCollection() {
    const requiredKeys = this.getInputVariables();

    const questions = Object.keys(requiredKeys).map((key) => ({
      type: 'input',
      name: key,
      message: `Inserisci il valore per ${key} (separati da virgola se più di uno):`,
    }));

    try {
      const answers = await inquirer.prompt(questions);

      // Aggiorna i valori delle variabili di input con le risposte dell'utente
      Object.keys(answers).forEach((key) => {
        requiredKeys[key] = answers[key];
      });

      const collectionUpdate = this.setInputVariables(requiredKeys);

      console.log(collectionUpdate);
      console.log(this.environment);

      // Ritorna gli oggetti collectionUpdate e environment
      return ;
    } catch (error) {
      console.error("Errore durante l'interazione con l'utente:", error);
    }
  }  

 

// Funzione per rimuovere uno o più valori delle variabili di input dall'utente
async removeValues() {
  const inputVariables = this.getInputVariables();

  for (const key in inputVariables) {
    const removeValue = await inquirer.prompt([
      {
        type: 'input',
        name: 'removedValues',
        message: `Inserisci il valore da rimuovere da '${key}' (separati da virgola se più di uno):`,
      },
    ]);

    const valuesToRemove = removeValue.removedValues.split(',').map(value => value.trim());
    const values = inputVariables[key].split(',').map(value => value.trim());

    const updatedValues = values.filter(value => !valuesToRemove.includes(value));

    inputVariables[key] = updatedValues.join(', ');
  }

  // Aggiorna i valori nell'oggetto originale collection
  this.collection.variable.forEach((item) => {
    if (item.key && item.key in inputVariables) {
      item.value = inputVariables[item.key];
    }
  });

  console.log(this.collection);
}


  // Procedura per modificare uno o più valori delle variabili di input dall'utente
  async modifyValues() {
    const inputVariables = this.getInputVariables();

    if (Object.keys(inputVariables).length === 0) {
      console.log('Nessuna variabile di input trovata nella collecion.');
      return;
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
        message: `Modificare il valore di ${dataTypeKey} (separati da virgola se più di uno): `,
        default: oldValue,
      },
    ]);

    const formattedInput = modifyInput.value.split(',').map(value => value.trim()).join(',');

    if (oldValue !== formattedInput) {
      console.log(`Valore di ${dataTypeKey} modificato da "${oldValue}" a "${formattedInput}".`);
      this.collection.variable.forEach((item) => {
        if (item.key === dataTypeKey) {
          item.value = formattedInput;
        }
      });
    } else {
      console.log(`Valore di ${dataTypeKey} invariato.`);
    }

    console.log(this.collection);
  }



}
module.exports = {CollectionUtils};