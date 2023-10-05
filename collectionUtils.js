const inquirer = require('inquirer');

// Costante per il prefisso delle variabili di input
const INPUT_VARIABLE_PREFIX = "INPUT_";


//definisco i dati di input con i rispettivi valri di default
const DEFAULT_VALUES = {
  INPUT_fcList: "",
  INPUT_panList: "",
  INPUT_pivaList: "",
  INPUT_positionType: "[\"1\",\"4\"]",
  INPUT_serviceList: "sms\nacs",
  INPUT_organization: "NEXI",
  INPUT_profileType: "NEXI",
  INPUT_username: "CO07991",
  INPUT_password: "8X8@7FU4x8",
  INPUT_type: "Valid values:\n\nPORTALE_TITOLARI, PORTALE_SELFPOINTONLINE_DB,PORTALE_YAP,PORTALE_AZIENDE,PORTALE_IBK_NOMEBANCA,PORTALE_SISERVIZI,PORTALE_MAGENTO,PORTALE_PLATEA,PORTALE_MPOS",
  INPUT_passwordLength: "12"
  // Aggiungi altre variabili di input con i rispettivi valori di default qui
};

class CollectionUtils {
  constructor(collection, environment) {
    this.collection = collection;
    this.environment = environment;
  }


getInputVariables() {
  const inputVariables = {};
  if (this.collection && this.collection.variable) {
    this.collection.variable.forEach((item) => {
      if (item.key && item.key.startsWith(INPUT_VARIABLE_PREFIX)) {
        inputVariables[item.key] = item.value || DEFAULT_VALUES[item.key] || "";
      }
    });
  }
  return inputVariables;
}


setInputVariables(requiredKeys) {
  const collectionUpdate = this.collection.variable.filter(item => item.key && !item.key.startsWith(INPUT_VARIABLE_PREFIX));
  Object.keys(requiredKeys).forEach((key) => {
    if (key.startsWith(INPUT_VARIABLE_PREFIX)) {
      collectionUpdate.push({
        key,
        value: requiredKeys[key],
      });
    }
  });
  this.collection.variable = collectionUpdate;
  return this.collection;
}


  //funzione restituisce i valori di default che corrisponde ai dati di input
  getDefaultValues(requiredKeys) {
    const defaultValues = {};
    for (const key in requiredKeys) {
      defaultValues[key] = DEFAULT_VALUES[key] || "";
    }
    return defaultValues;
  }


  //Procedura per inserire uno o più valori delle variabili di input dall'utente
  async checkSelectedCollection() {
    try {
      const inputVariables = this.getInputVariables();
      const defaultValues = this.getDefaultValues(inputVariables);

      const questions = Object.keys(inputVariables).map((key) => ({
        type: 'input',
        name: key,
        message: `Inserisci il valore per ${key} (separati da virgola se più di uno):`,
        default: defaultValues[key],
      }));

      const answers = await inquirer.prompt(questions);

      const updatedVariables = { ...inputVariables, ...answers };
      const collectionUpdate = this.setInputVariables(updatedVariables);

      console.log(JSON.stringify(collectionUpdate, null, 2));

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

  console.log(JSON.stringify(this.collection, null, 2));
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

    console.log(JSON.stringify(this.collection, null, 2));
  }



}
module.exports = {CollectionUtils};