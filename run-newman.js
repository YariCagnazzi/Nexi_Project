const newman = require('newman');
const fs = require('fs');


// agiorna la collection con i dati di input
function updateCollectionValues(collectionFilePath, newValues) {
    // Leggi la collection dal file o da una fonte
    const collection = JSON.parse(fs.readFileSync(collectionFilePath, 'utf8'));

  // Aggiorna i valori desiderati con i nuovi valori forniti
  for (const newValue of newValues) {
      const itemToUpdate = collection.variable.find(item => item.key === newValue.key);
      if (itemToUpdate) {
          itemToUpdate.value = newValue.value;
      }

  }

  // Converti la collection aggiornata in formato JSON
  const updatedCollectionJSON = JSON.stringify(collection, null, 2); 

  // Scrivi il file JSON aggiornato
  fs.writeFileSync(collectionFilePath, updatedCollectionJSON, 'utf-8');

  // Restituisci la collection aggiornata
  return ;
}; //fine 


/**
 * Questa è una procedura che esegue la collection usando la libreria Newman.
 *
 * @param {string} collectionsName - nome della collection
 * @param {string} environmentsName - nome dell 'environment
 * @param {string} data - dati di input che aggiorna la collection
 * @returns { } non ritorna nulla
 */ 



function runNewman(collectionName, environmentName, data ) {
    
    const basecollection='./collections/';
    const baseEnv='./environment/';

    //costruisco il path completo della collection
    const collectionFilePath = basecollection + collectionName;
    console.info(collectionFilePath);
 
    //costruisco il path completo dell' ambiente
    const environmentFilePath = baseEnv + environmentName;
    console.log(environmentFilePath);
     
    //aggiorna con i dati di input
    updateCollectionValues(collectionFilePath, data);

   console.log('----------------Running collection----------');
 
    newman.run(
      {
        //imposta la collection
        collection: collectionFilePath ,
        //imposta le variabili d'ambiente
        environment: environmentFilePath,  
        //disabilita la verifica SSL 
        insecure: true ,


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
         console.info ('SUCCESS: '+ summary.environment.values.members[27].value);     
       
         //recupero dei eventuali Errori e/o Assertioni
        summary.run.failures.forEach((err, index) => {
          console.error('****** ERROR ****** ' + index + ': ' + JSON.stringify(err.error.message) + '  IN  '+ JSON.stringify(err.parent.name));
        });
        
          console.log('Collection run completed.');
      }
  
      
    }) 
};//fine runNewman


module.exports = { runNewman };