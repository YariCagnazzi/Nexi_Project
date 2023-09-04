const interactiveDataCollection = require('./interactive-data-collection');


/**
 * Questa è una procedura che visualizza il sotto-menu in base alla collection e all' environment selezionata.
 *
 * @param {string} collectionsName - nome della collection
 * @param {string} environmentsName - nome dell 'environment
 * @returns { } non ritorna nulla
 */ 

  function subMenu (collectionName, environmentName) {       

      interactiveDataCollection.interactiveData(collectionName, environmentName );

  }; //fine submenu


module.exports = { subMenu };