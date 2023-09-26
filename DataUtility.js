const inquirer = require('inquirer');


const data = []; // Store the data
const dataHistory = []; // Store data history
const bonificaCostum = {}; // Store bonificaCostum data


const MESSAGES = {
  selectDataType: 'Seleziona il tipo di dato da inserire:',
  selectServiceTypes: 'Seleziona il tipo di servizio (SMS e/o ACS):',
  selectPositionTypes: 'Seleziona il tipo di posizione (1 e/o 4):',
  enterValue: 'Inserisci il %s (separati da virgola se più di uno):',
  selectNumber: 'Inserisci un numero di telefono:',
  selectEmail: 'Inserisci un indirizzo email (o lascia vuoto per uscire):',
  enterPIVA: 'Inserisci una o più Partite IVA (separate da virgola):',
};



const DATA_TYPES = {
  PAN: 'PAN',
  CodiceFiscale: 'Codice Fiscale',
  TipoServizio: 'Tipo Servizio',
  TipoPosizione: 'Tipo Posizione',
  PIVA: 'PIVA',
  Email:'E-mail'
};


async function startDataInsertion() {
  try {
    await insertData(collectionName, environmentName);
    await insertDataBonifica(collectionName, environmentName);
    await insertBonificaCostum(collectionName, environmentName);
    await insertEmail(collectionName, environmentName);
    await insertDataCommercial(collectionName, environmentName);
    await insertDataK6(collectionName, environmentName);
    await insertContactCenter(collectionName, environmentName);
    console.log('Data:', data);
    console.log('Data History:', dataHistory);
    return 'Dati inseriti con successo!!!!';
  } catch (error) {
    console.error('Error:', error);
    return error.message;
  }
}

// insert k6, getC ontcat, check pan
async function insertData( collectionName, environmentName) {

  delete DATA_TYPES.Email;
  delete DATA_TYPES.PIVA;
  delete DATA_TYPES.TipoServizio;
 
   try {
     const { dataType } = await inquirer.prompt([
       {
         type: 'list',
         name: 'dataType',
         message: MESSAGES.selectDataType,
         choices: Object.values(DATA_TYPES),
       },
     ]);
 
     switch (dataType) {
       case DATA_TYPES.TipoPosizione:
         await handlePositionType();
         break; 
       default:
         await handleDefaultType(dataType);
         break;
     }
 
   } catch (error) {
     console.error('Error:', error);
   }
 }


 async function insertContactCenter(collectionName, environmentName){
  
  delete DATA_TYPES.PAN;
  delete DATA_TYPES.TipoServizio;
  delete DATA_TYPES.PIVA;
  delete DATA_TYPES.Email;

  try {
    const { dataType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'dataType',
        message: MESSAGES.selectDataType,
        choices: Object.values(DATA_TYPES),
      },
    ]);

    switch (dataType) {
      case DATA_TYPES.TipoPosizione:
        await handlePositionType();
        break; 
      default:
        await handleDefaultType(dataType);
        break;
    }

  } catch (error) {
    console.error('Error:', error);
  }
}
  


//insert Bonifica e Bonifica+RandomSubscribe
async function insertDataBonifica( collectionName, environmentName) {

 delete DATA_TYPES.Email;
 delete DATA_TYPES.PIVA;

  try {
    const { dataType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'dataType',
        message: MESSAGES.selectDataType,
        choices: Object.values(DATA_TYPES),
      },
    ]);

    switch (dataType) {
      case DATA_TYPES.TipoPosizione:
        await handlePositionType();
        break; 
      case DATA_TYPES.TipoServizio:
        await handleServiceList();  
      default:
        await handleDefaultType(dataType);
        break;
    }

  } catch (error) {
    console.error('Error:', error);
  }
}



async function handleDefaultType(dataType) {
  try {
    const { value } = await inquirer.prompt([
      {
        type: 'input',
        name: 'value',
        message: MESSAGES.enterValue.replace('%s', dataType),
      },
    ]);

    const key =
      dataType === DATA_TYPES.CodiceFiscale
        ? 'INPUT_fcList'
        : `INPUT_${dataType.toLowerCase()}List`;
    const formattedInput = value.split(',').map((value) => value.trim()).join(', ');

    data.push({ key, value: formattedInput });
    dataHistory.push({ operation: 'Inserisci', data: { key, value: formattedInput } });
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}




//insert BonificaCostum
async function insertBonificaCostum(collectionName, environmentName) {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'pan',
        message: MESSAGES.enterValue.replace('%s', 'PAN'),
      },
      {
        type: 'input',
        name: 'cf',
        message: MESSAGES.enterValue.replace('%s', 'Codice Fiscale'),
      },
      {
        type: 'input',
        name: 'tel',
        message: MESSAGES.selectNumber,
      },
      {
        type: 'checkbox',
        name: 'pos',
        message: MESSAGES.selectPositionTypes,
        choices: ['1', '4'],
      },
      {
        type: 'checkbox',
        name: 'ser',
        message: MESSAGES.selectServiceTypes,
        choices: ['sms', 'acs'],
      },
    ]);

    // Store the bonificaCostum data
    bonificaCostum.PAN = answers.pan.split(',').map((value) => value.trim());
    bonificaCostum.CodiceFiscale = answers.cf.split(',').map((value) => value.trim());
    bonificaCostum.NumeroTelefono = answers.tel;
    bonificaCostum.TipoPosizione = answers.pos;
    bonificaCostum.TipoServizio = answers.ser.join(', ');

    data.push(bonificaCostum);
  //inserisici all 'interno dell' array data
    console.log(data);
 
  } catch (error) {
    console.error('Error:', error);
  }
}


async function insertDataK6(collectionName, environmentName) {

  delete DATA_TYPES.Email;
  delete DATA_TYPES.PIVA;
  delete DATA_TYPES.TipoServizio;
 
   try {
     const { dataType } = await inquirer.prompt([
       {
         type: 'list',
         name: 'dataType',
         message: MESSAGES.selectDataType,
         choices: Object.values(DATA_TYPES),
       },
     ]);
 
     switch (dataType) {
       case DATA_TYPES.TipoPosizione:
         await handlePositionType();
         break; 
       default:
         await handleDefaultType(dataType);
         break;
     }
 
   } catch (error) {
     console.error('Error:', error);
   }

}

//inserimento e-mail
async function insertEmail(collectionName, environmentName) {

  // Rimuovi le chiavi desiderate
delete MESSAGES.selectServiceTypes;
delete MESSAGES.selectPositionTypes;
delete MESSAGES.selectNumber;
delete MESSAGES.enterValue;
delete DATA_TYPES.PAN;
delete DATA_TYPES.CodiceFiscale;
delete DATA_TYPES.TipoServizio;
delete DATA_TYPES.TipoPosizione;
delete DATA_TYPES.PIVA;

  try {
    const { dataType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'dataType',
        message: MESSAGES.selectDataType,
        choices: Object.values(DATA_TYPES),
      },
    ]);

    switch (dataType) {
      case DATA_TYPES.Email:
      default:
        await handleDefaultEmail();
        break;
    }
   
    
  } catch (error) {
    console.error('Error:', error);
  }

};



 async function handleDefaultEmail() {

  const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'emails',
        message: MESSAGES.selectEmail,
        validate:  (input) => {
          // Validazione: controlla se l'input è una lista di email valide separate da virgola.
          const emailRegex = /^[\w\.-]+@[\w\.-]+(?:,[\w\.-]+@[\w\.-]+)*$/;
          return emailRegex.test(input) || 'Inserisci uno o più indirizzi email validi separati da virgola.';
        },
      },
    ])
      // Suddivide l'input in una lista di indirizzi email.
      const emailList = answers.emails.split(',').map((email) => email.trim());

      // Qui puoi fare qualcosa con la lista di indirizzi email, ad esempio, salvarli in un array.
      console.log('Hai inserito i seguenti indirizzi email:');
      emailList.forEach((email) => {
        console.log(email);
      });
      
      data.push({ key: 'INPUT_uidList' , value: emailList });
    };



  async function insertDataCommercial(collectionName, environmentName) {
      delete DATA_TYPES.TipoPosizione;
      delete DATA_TYPES.TipoServizio;
      delete DATA_TYPES.Email;
    
      try {
        const { dataType } = await inquirer.prompt([
          {
            type: 'list',
            name: 'dataType',
            message: MESSAGES.selectDataType,
            choices: Object.values(DATA_TYPES),
          },
        ]);
    
        switch (dataType) {
          case DATA_TYPES.PIVA: // Aggiungi il caso per la PIVA
            await handlePIVA();
            break;
          default:
            await handleDefaultType(dataType);
            break;
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
    
    async function handlePositionType() {
      try {
        const { values } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'values',
            message: MESSAGES.selectPositionTypes,
            choices: ['1', '4'],
          },
        ]);
    
        data.push({ key: 'INPUT_positionType', value: JSON.stringify(values) });
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
    async function handlePIVA() {
      try {
        const { value } = await inquirer.prompt([
          {
            type: 'input',
            name: 'value',
            message: MESSAGES.enterPIVA,
          },
        ]);
    
        const formattedInput = value.split(',').map((value) => value.trim()).join(', ');
        data.push({ key: 'INPUT_pivaList', value: formattedInput });
        dataHistory.push({ operation: 'Inserisci', data: { key: 'INPUT_pivaList', value: formattedInput } });
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
    async function handleDefaultType(dataType) {
      try {
        const inputMessage = MESSAGES.enterValue.replace('%s', dataType);
        const key = dataType === DATA_TYPES.CodiceFiscale ? 'INPUT_fcList' : `INPUT_${dataType.toLowerCase()}List`;
    
        const { value } = await inquirer.prompt([
          {
            type: 'input',
            name: 'value',
            message: inputMessage,
          },
        ]);
    
        const formattedInput = value.split(',').map((value) => value.trim()).join(', ');
    
        data.push({ key, value: formattedInput });
        dataHistory.push({ operation: 'Inserisci', data: { key, value: formattedInput } });
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    async function handleServiceList() {
      try {
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
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }

/*
// Avvia inserimento
 startDataInsertion()
  .then((message) => console.log(message))
  .catch((error) => console.error('Unhandled Error:', error));
*/



  module.exports = {insertDataBonifica, insertData,startDataInsertion, insertBonificaCostum, insertEmail, insertDataCommercial, insertDataK6,insertContactCenter };