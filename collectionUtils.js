const inquirer = require('inquirer');


class CollectionUtils {

  static inputDefaultVariable = {}; // Proprietà statica per memorizzare i valori di default
   /**
   * Constructor for CollectionUtils class.
   * @param {Object} collection - The collection object.
   * @param {string} environment - The environment associated with the collection.
   */
  constructor(collection, environment) {
    this.collection = collection;
    this.environment = environment;
  }

 /**
   * Retrieves input variables from the collection.
   * @returns {Object} - A dictionary containing input variables.
  */
getInputVariables() {
  const inputVariables = {};
  if (this.collection && this.collection.variable) {
    this.collection.variable.forEach((item) => {
      if (item.key && item.key.startsWith("INPUT_")) {
        inputVariables[item.key] = item.value || "";
      }
    });
  }

  // Salva i valori di default  
  CollectionUtils.inputDefaultVariable = { ...CollectionUtils.inputDefaultVariable, ...inputVariables };
  return inputVariables;
}

// Metodo statico per recuperare i valori di default salvati
static getDefaultInputVariables() {
  return CollectionUtils.inputDefaultVariable;
}

/**
   * Sets input variables in the collection based on the required keys.
   * @param {Object} requiredKeys - A dictionary containing required input variables.
   * @returns {Object} - The updated collection object.
  */
setInputVariables(requiredKeys) {
  const collectionUpdate = this.collection.variable.filter(item => item.key && !item.key.startsWith("INPUT_"));
  Object.keys(requiredKeys).forEach((key) => {
    if (key.startsWith("INPUT_")) {
      collectionUpdate.push({
        key,
        value: requiredKeys[key],
      });
    }
  });
  this.collection.variable = collectionUpdate;
  return this.collection;
}

    /**
   * Checks the selected collection, prompts the user to input values for variables, and updates the collection accordingly.
   */
  async checkSelectedCollection() {
    try {
      await this.showInputList(); // Mostra la lista di input inseriti
      const inputVariables = this.getInputVariables();
  
      const questions = Object.keys(inputVariables).map((key) => ({
        type: 'input',
        name: key,
        message: `Inserisci il valore per ${key} (separati da virgola se più di uno):`,
        default: inputVariables[key],
        transformer: (input) => input.split('\n').map(line => line.trim()).join(', ')
      }));
  
      const answers = await inquirer.prompt(questions);
  
      // Aggiorna le variabili di input con le risposte dell'utente
      const updatedVariables = { ...inputVariables, ...answers };
  
      // Aggiorna l'oggetto `collection` con le nuove variabili di input
      const collectionUpdate = this.setInputVariables(updatedVariables);
  
      // Fai qualcosa con `collectionUpdate` se necessario
      // console.log(JSON.stringify(collectionUpdate, null, 2));
  
    } catch (error) {
      console.error("Errore durante l'interazione con l'utente:", error);
    }
  }

  
 /**
   * Displays a list of input variables that have been entered by the user.
   */
async showInputList() {
  const inputVariables = this.getInputVariables();
  console.log('Lista di input inseriti:');
  Object.keys(inputVariables).forEach((key, index) => {
    console.log(`${index + 1}. ${key}: ${inputVariables[key]}`);
  });
}

/**
   * Prompts the user to select an input variable for deletion.
   * @returns {string} - The selected input variable to delete.
   */
async selectInputToDelete() {
  const inputVariables = this.getInputVariables();
  const inputKeys = Object.keys(inputVariables);
  const userInput = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedInput',
      message: 'Seleziona il tipo di dati da cancellare:',
      choices: inputKeys,
    },
  ]);
  return userInput.selectedInput;
}

 /**
   * Prompts the user for confirmation before deleting an input variable.
   * @returns {boolean} - True if the user confirms deletion, false otherwise.
   */
async confirmDeletion() {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Sei sicuro di voler cancellare questo input?',
      default: false,
    },
  ]);
  return answer.confirmation;
}

  /**
   * Prompts the user for confirmation before deleting all input variables.
   * @returns {boolean} - True if the user confirms deletion, false otherwise.
   */
async confirmDeletionAllInputs() {
  const userInput = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Vuoi davvero cancellare il contenuto di tutti gli input ?',
      default: false,
    },
  ]);

  return userInput.confirmation;
}

 /**
   * Prompts the user for confirmation before exiting the program.
   * @returns {boolean} - True if the user confirms exit, false otherwise.
   */
async confirmExit() {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Sei sicuro di voler terminare?',
      default: false,
    },
  ]);
  return answer.confirmation;
}

 /**
   * Removes the values of a selected input variable after user confirmation.
   */
async removeValues() {
  await this.showInputList(); // Mostra la lista di input inseriti
    const selectedInput = await this.selectInputToDelete(); // L'utente seleziona l'input da cancellare
    const confirmed = await this.confirmDeletion(); // Richiede conferma all'utente

    if (confirmed) {
      // Cancella il contenuto dell'input selezionato
      this.collection.variable.forEach((item) => {
        if (item.key === selectedInput) {
          item.value = "";
        }
      });

     //console.log(JSON.stringify(this.collection, null, 2));

      console.log(`Contenuto di '${selectedInput}' è stato cancellato.`);
    } else {
      console.log('Cancellazione annullata.');
    }
  }


   /**
   * Modifies the values of a selected input variable after user confirmation.
   */
  async modifyValues() {
    await this.showInputList(); // Mostra la lista di input inseriti
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

  // console.log(JSON.stringify(this.collection, null, 2));
  }

    /**
   * Resets all input values in the collection after user confirmation.
   */
  async resetValues() {
    const confirmed = await this.confirmDeletionAllInputs(); // Richiede conferma all'utente per cancellare tutti gli input
  
    if (confirmed) {
      this.collection.variable.forEach((item) => {
        // Verifica se la chiave inizia con "INPUT_"
        if (item.key.startsWith("INPUT_")) {
          item.value = "";
        }
      });
  
      //console.log(JSON.stringify(this.collection, null, 2));
  
      console.log("Contenuto degli input è stato cancellato.");
      CollectionUtils.inputDefaultVariable = CollectionUtils.getDefaultInputVariables();
      //console.log(JSON.stringify(CollectionUtils.inputDefaultVariable));

    } else {
      console.log('Cancellazione degli input annullata.');
    }
  }
  
  /**
   * Exits the program after user confirmation.
   * @returns {void} - The function terminates the program or continues with the program's flow based on user input.
   */
  async exit() {
    const confirmed = await this.confirmExit();
    if (confirmed) {
      console.log('Stai per uscire dal Programma...');
      process.exit(0); // Codice di uscita 0 indica una terminazione corretta
    } else {
      console.log('Seleziona un\'altra operazione.');
      // Continua con la logica di flusso del programma per selezionare un'altra collection o eseguire altre operazioni
    }
  }

}
module.exports = {CollectionUtils};