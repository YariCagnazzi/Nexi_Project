const newman = require('newman');
const inquirer = require('inquirer');
const fs = require('fs');


console.info('Benvenuto su Rockman!!! ');

inquirer
  .prompt([
    /* Pass your questions in here */
    /*scelta quale operazione vuoi eseguire */
    {
      type: 'list',
      name: 'Quale collection vuoi eseguire ?',
      messagge: 'fist-list-question',
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
      messagge: 'second-list-question',
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
                'INPUT_mfaIdList',
                'INPUT_uidList'] 

    }

  ])
  .then((answers) => {
   
    console.info('Risposte inserite:', answers);

        // Recupero le risposte corrispondente alla scelta dell'utente
       const collectionName = answers['Quale collection vuoi eseguire ?'];
       const environmentName = answers['In quale ambiente vuoi eseguire la collection ?'];
       const inputDataChoice = answers['data'];
     


      if(inputDataChoice === 'INPUT_fcList'){
        promptForPANsOrCFs(inputDataChoice);
      }
      else if(inputDataChoice === 'INPUT_panList'){
        promptForPANsOrCFs(inputDataChoice);
      }
      else if(inputDataChoice === 'INPUT_pivaList'){
        promptForPANsOrCFs(inputDataChoice);
      }
      else if (inputDataChoice ==='INPUT_mfaIdList' || inputDataChoice==='INPUT_uidList'){
        promptForPANsOrCFs(inputDataChoice);
      }
         
  
    function promptForPANsOrCFs(inputData) {
      // eseguio di nuovo il prompt che accetta  CF
      if(inputData==='INPUT_fcList') {  
        const panOrCFQuestions = [
          {
            type: 'checkbox',
            name: 'Select data (CF)',
            message: 'Inserisci uno o più CF',
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
                console.info(collectionName);
                console.info(environmentName);
                
                     // chiamo la procedura per poter eseguire con newman         
                runCollection(collectionName, environmentName ,datachoices );
                return ;
             
          })
        } else if (inputData==='INPUT_panList') {
         // eseguio di nuovo il prompt che accetta  PAN
          const panOrCFQuestions = [
            {
              type: 'checkbox',
              name: 'Select data (PAN)',
              message: 'Inserisci uno o più PAN',
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
                  console.info(collectionName);
                  console.info(environmentName);
               
                  
                     // chiamo la procedura per poter eseguire con newman 
                  runCollection(collectionName, environmentName ,datachoices );
    
                  return ;
               
            }) 
        } else if (inputData==='INPUT_pivaList') {
          // eseguio di nuovo il prompt che accetta  PAN
           const panOrCFQuestions = [
             {
               type: 'checkbox',
               name: 'Select data (PIVA)',
               message: 'Inserisci uno o più PIVA',
               choices: ['01328240054', '02333970014', '15061221469', '00000000018', '00051830529', '02333970014'],
              // validate: validatePANorCF, // Aggiungo la validazione
             },
           ];
       
           inquirer
           .prompt(panOrCFQuestions)
           .then((answers) => {
                   // Use user feedback for... whatever!!
                   console.info('Risposte:', answers['Select data (PIVA)']);
                   // recupero le risposte e le memorizzo 
                   const datachoices = answers['Select data (PIVA)'];
                   console.info('dati inseriti:'+ datachoices);
                   console.info(collectionName);
                   console.info(environmentName);

             // chiamo la procedura per poter eseguire con newman   
                   runCollection(collectionName, environmentName ,datachoices );  
     
                   return ;
                }) 
            
         } else if (inputData === 'INPUT_mfaIdList' || inputData === 'INPUT_uidList') {
              
              // eseguio di nuovo il prompt che accetta e-mail
            const panOrCFQuestions = [
              {
                type: 'checkbox',
                name: 'Select data (E-MAIL)',
                message: 'Inserisci uno o più E-MAIL',
                choices: ['UTENZA_CHB_21@YOPMAIL.COM', 'iosi.debito4@yopmail.com','stg_pt.excel.mc03@yopmail.com'],
               // validate: validatePANorCF, // Aggiungo la validazione
              },
            ];
        
            inquirer
            .prompt(panOrCFQuestions)
            .then((answers) => {
                    // Use user feedback for... whatever!!
                    console.info('Risposte:', answers['Select data (E-MAIL)']);
                    // recupero le risposte e le memorizzo 
                    const datachoices = answers['Select data (E-MAIL)'];
                    console.info('dati inseriti:'+ datachoices);
                    console.info(collectionName);
                    console.info(environmentName);

                    // chiamo la procedura per poter eseguire con newman   
                   runCollection(collectionName, environmentName ,datachoices );  
               
                    return ;                     
         })     
               

         }

};


          // procedura per aggiornare i dati di ingresso in base all'input
          function updateJSONCollection(inputDataChoice, collectionFilePath, datachoices) {

            let variableKey = '';
            let resetVariableKey = '';
        
            // Determina la chiave corrispondente in base al nome del dato in input
            switch (inputDataChoice) {
                case 'INPUT_fcList':
                    variableKey = 'INPUT_fcList';
                    resetVariableKey = 'INPUT_panList';
                    break;
                case 'INPUT_panList':
                    variableKey = 'INPUT_panList';
                    resetVariableKey = 'INPUT_fcList';
                    break;
                case 'INPUT_pivaList':
                    variableKey = 'INPUT_pivaList';
                    break;
                case 'INPUT_mfaIdList':
                  variableKey = 'INPUT_mfaIdList';
                     break;
                case 'INPUT_uidList':
                  variableKey ='INPUT_uidList';
                     break;      
                default:
                    console.error('Nome del dato di Input non supportato.');
                    return;
            }
        
            // Parsa il file JSON e convertilo in Object
          
            let existingData = JSON.parse(fs.readFileSync(collectionFilePath, 'utf8'));
        
            // Aggiorna l'oggetto del file JSON 
            existingData.variable.forEach(variable => {
                if (variable.key === variableKey) {
                    variable.value = datachoices.join('\n');
                    console.info(variable.value);
                }
        
                if (variable.key === resetVariableKey) {
                    variable.value = '';
                }
            });
        
            // Converti l'oggetto aggiornato in una stringa JSON
            const updatedJSON = JSON.stringify(existingData, null, 2);
        
            fs.writeFileSync(collectionFilePath, updatedJSON, 'utf8');
        
            //console.log('Dato aggiornato:', updatedJSON);
        };
        

        // running collection with newman
     function runCollection(collectionName, environmentName , datachoices ){
   

        const basecollection='./collections/';
        const baseEnv='./environment/';
        const collectionPostfix='.postman_collection.json';
        const envPpostfix='.postman_environment.json';

     //costruiscio il path relativo della collection e dell'ambiente
        const collectionFilePath = basecollection + collectionName + collectionPostfix;
        const environmentFilePath = baseEnv + environmentName + envPpostfix;

        console.info(datachoices);

      //aggiorna il JSON della collection con i dati di input
        updateJSONCollection(inputDataChoice, collectionFilePath , datachoices );

      console.log('----------------Running collection----------');
    
   
  newman.run(
    {
      //imposta la collection
      collection: collectionFilePath ,
      //imposta le variabili d'ambiente
      environment: environmentFilePath,
      //disabilita la verifica SSL 
      insecure: true
   }
  ).on('start', function (err, args) { // on start of run, log to console
    console.log('running a collection...');

  }).on('done', function (err, summary) {
    if (err || summary.error) {
        console.error('collection run encountered an error.');
    }
    else {
      console.info(summary.environment.name);
      //recupero variabile RESULT in INTEGRATION e STAGING
       console.info ('SUCCESS: '+ summary.environment.values.members[26].value);     
     
       //recupero dei eventuali Errori e/o Assertioni
      summary.run.failures.forEach((err, index) => {
        console.error('****** ERROR ****** ' + index + ': ' + JSON.stringify(err.error.message) + '  IN  '+ JSON.stringify(err.parent.name));
      });
      
        console.log('Collection run completed.');
    }

    
})


}

   
  });
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
 
  
 


