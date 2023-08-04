const newman = require('newman');
var inquirer = require('inquirer');

console.info('Benvenuto su Rockman!!! ');

inquirer
  .prompt([
    /* Pass your questions in here */
    /*scelta quale operazione vuoi eseguire */
    {
      type: 'list',
      name: 'Quale collection vuoi eseguire ?',
      messagge: 'first-list-questions',
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
      name: 'In quale ambiente vuoi eseguire la collection ?',
      messagge: 'second-list-questions',
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
      name:'Indica che tipo di dati vuoi inserire ?',
      messagge: 'data',
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
  })