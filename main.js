const fs = require('fs');
const path = require('path');
const funzioni = require('./funzioni');


//classe per gestire le cartelle in ingresso
class JSONCollectionReader {
    constructor(folderPath) {
        this.folderPath = folderPath;
    }
   
    readFolder() {
        const collectionFiles = [];
        const filenames = fs.readdirSync(this.folderPath);
    
        for (const filename of filenames) {
            if (filename.endsWith('.json') || filename.endsWith('.postman_collection')) {
                collectionFiles.push(filename);
            }
        }
         
        return collectionFiles;
    }
    
};



/**
 * Questa è una procedura che è il punto principale di eseczuzione.
 *
 * @param {string} collections - Il primo numero da sommare.
 * @param {string} environments - Il secondo numero da sommare.
 * @returns { } no ritorna nulla
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



runRockman('collections', 'environment');




