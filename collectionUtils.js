const fs = require('fs');


function getInputVariables(collectionName) {
    const baseCollection = './collections/';
    const collectionFilePath = `${baseCollection}${collectionName}`;
    console.info(collectionFilePath);
     
    try {
      const collection = JSON.parse(fs.readFileSync(collectionFilePath, 'utf8'));
      const inputVariables = [];
  
      if (collection) {
        collection.variable.forEach((item) => { // Itera sulla collezione stessa
          if (item.key && item.key.startsWith("INPUT")) {
            inputVariables.push(item.key);
          }
        });
      }
  
      return inputVariables;
    } catch (error) {
      console.error("Errore durante il parsing del file JSON:", error);
      return [];
    }
  };
 
  
  function checkSelectedCollection(collectionName) {
    const baseCollection = './collections/';
    const collectionFilePath = `${baseCollection}${collectionName}`;
    console.info(collectionFilePath);
  
    // recupera i dati di INPUT
    const requiredKeys = getInputVariables(collectionName);
  
    try {
        const collection = JSON.parse(fs.readFileSync(collectionFilePath, 'utf8'));
  
        if (requiredKeys.every(key => collection.variable.some(variable => variable.key === key))) {
          startDataInsertion();
            
        } else {
            console.error("Una o più variabili richieste sono mancanti.");
        }
    } catch (error) {
        console.error("Errore durante la lettura o il parsing del file della collezione:", error);
    }
  };
  
 


  module.exports = {checkSelectedCollection};