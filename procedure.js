const interactiveDataCollection = require('./interactive-data-collection');

/**
 * Questa è una procedura che visualizza il sotto-menu in base alla collection e all'environment selezionata.
 *
 * @param {string} collectionName - Nome della collection.
 * @param {string} environmentName - Nome dell'environment.
 * @returns {void} Non ritorna nulla.
 */
function subMenu(collectionName, environmentName) {
  interactiveDataCollection.interactiveData(collectionName, environmentName);
}

module.exports = { subMenu };