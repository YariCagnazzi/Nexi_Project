const newman = require('newman');
const inquirer = require('inquirer');


console.info('Benvenuto su Rockman!!! ');

inquirer
  .prompt([
    /* Pass your questions in here */
    /*scelta quale operazione vuoi eseguire */
    {
      type: 'list',
      name: 'first-list-questions',
      messagge: 'Quale collection vuoi eseguire ?',
      choices: ['[ACCOUNT] [INT] [STG] - Delete Devices',
                '[ACCOUNT] [STG] - Account password update custom password',
                '[API] [INT] [STG] - API primitive utili',
                '[BONIFICA] [INT] [STG] - Bonifica+Subscribe+CUSTOM mobiles',
                '[BONIFICA] [INT] [STG] - Bonifica+Subscribe+RANDOM mobiles',
                '[BONIFICA] [INT] [STG] - Bonifica',
                '[COMMERCIAL] [INT] - Get account commercial roles Given PIVA',
                '[CONTACT CENTER] [INT] [STG] - Get Access token portale titolari',
                '[CONTACT CENTER] [INT] [STG] - Read user details given CF List',
                '[CONTACT CENTER] [INT] [STG] - Read user details given PAN List',
                '[CONTACT] [INT] [STG] - Get contact subscription details',
                '[INQPAC] [INT] - Check PAN is registered on SIA',
                '[K6] [INT] - Burned K6',
                '[K6] [INT] [STG] - Delete K6',
                '[K6] [INT] [STG] - Set K6',
                '[K6] [INT] [STG] - Lock K6',
                '[MASSIVE] [STG] - Get PAN Alias, ABI, POSI and User details']

    },
    /*scelta in quale ambiente vuoi eseguire */
    {
      type: 'list',  
      name: 'second-list-questions',
      messagge: 'In quale ambiente vuoi eseguire la collection ?',
      choices: ['INT_NEXI', 
                'INT_CA_DEBIT',
                'INT_CHB',
                'INT_DB',
                'INT_MPS',
                'INT_BPER',
                'INT_BPM',
                'STG_NEXI',
                'STG_CA_DEBIT',
                'STG_CHB',
                'STG_DB',
                'STG_MPS',
                'STG_BPER',
                'STG_BPM'
              ]
    },
    /*scelta quali dati di input */
    {
      type:'list',
      name:'data',
      messagge: 'Indica che tipo di dati vuoi inserire ?',
      choices: ['INPUT_fcList', 
                'INPUT_panList',
                'INPUT_fc',
                'INPUT_pan', 
                'INPUT_dataList', 
                'INPUT_pivaList',
                'INPUT_mfaIdList'] 

    }

  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
   
    console.info('Risposte inserite:', answers);

        // Esegui l'operazione corrispondente alla scelta dell'utente
       const collectionName = answers['first-list-questions'];
       const environmentName = answers['second-list-questions'];
       const inputDataChoice = answers['data'];


    if (inputDataChoice === 'INPUT_fcList') {
      inputData = promptForPANsOrCFs('CF');
    } else if (inputDataChoice === 'INPUT_panList') {
      inputData = promptForPANsOrCFs('PAN');
    }  else if (inputDataChoice === 'INPUT_pivaList') {
      inputData = promptForPANsOrCFs('PIVA');
    } 
      

  })
/*
  // Funzione per validare PAN o CF
function validatePANorCF(value) {
  // Qui puoi inserire la tua logica di validazione per PAN o CF
  // Ad esempio, potresti verificare la lunghezza o utilizzare espressioni regolari

  if (/^\d{16}$/.test(value) || /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/.test(value)) {
    return true;
  }

  return 'Inserisci un PAN valido (16 cifre) o un Codice Fiscale valido';
}
*/
  // eseguio di nuovo il prompt che accetta o PAN o il CF
 
  
  function promptForPANsOrCFs(type) {

 
  if(type==='CF') {  
    const panOrCFQuestions = [
      {
        type: 'checkbox',
        name: 'Select data (CF)',
        message: `Inserisci uno o più ${type}`,
        choices: ['FRNCHR63L48H501V','TRVVNT80P63H501A', 'CRCLSS62S28F496A' ],
       // validate: validatePANorCF, // Aggiungo la validazione
      },
    ];

    inquirer
    .prompt(panOrCFQuestions)
    .then((answers) => {
            // Use user feedback for... whatever!!
            console.info('Risposte:', answers['Select data (CF)']);
            // recupero le risposte e le memorizzo 
            const datachoices = answers['Select data (CF)'];
            console.info('dati inseriti:'+ datachoices);

            return datachoices;
         
      })
    } else if (type==='PAN') {

      const panOrCFQuestions = [
        {
          type: 'checkbox',
          name: 'Select data (PAN)',
          message: `Inserisci uno o più ${type}`,
          choices: ['4970199002897286', '4532200022110725', '4539970045339062'],
         // validate: validatePANorCF, // Aggiungo la validazione
        },
      ];
  
      inquirer
      .prompt(panOrCFQuestions)
      .then((answers) => {
              // Use user feedback for... whatever!!
              console.info('Risposte:', answers['Select data (PAN)']);
              // recupero le risposte e le memorizzo 
              const datachoices = answers['Select data (PAN)'];
              console.info('dati inseriti:'+ datachoices);

              return datachoices;
           
        })
    }
  
    
  }
  
 


