const fs = require('fs');
const path = require('path');
const funzioni = require('./funzioni');
const {JSONCollectionReader} = require('./JSONCollectionReader');


/**
 * Questa è una procedura che è il punto principale di eseczuzione.
 *
 * @param {string} collections - Lista di collections.
 * @param {string} environments - Lista dei environments.
 * @returns { } non ritorna nulla
 */

//**** */ punto di accesso principale di esecuzione *************//
function runRockman(collections, environments) {
  
    // leggo tutti file all'interno della cartella collection e ritona i nomi delle collections
   let collectionsNames = new JSONCollectionReader(collections).readFolder();
    //console.log(collectionsNames);
   
    // leggo tutti file all'interno della cartella environment e ritorna i nomi dei ambienti
    let environmentsNames = new JSONCollectionReader(environments).readFolder();
    //console.log(environmentsNames);

     // funzione che richiama dall 'utente per visualizzare il menu e inserire i dati a mano
    funzioni.getMainMenu(collectionsNames, environmentsNames);


  return ;  
};



runRockman('collections', 'environments');




