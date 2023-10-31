const { CollectionUtils } = require('./collectionUtils');
const { executeCollection } = require('./executionModule');

/**
 * Esegue un'operazione interattiva basata sul tipo di dato selezionato.
 *
 * @param {string} dataType - Tipo di operazione da eseguire (Inserisci, Cancella, Modifica, Fine)
 * @param {Collection} collectionData - Dati della collection
 * @param {Environment} environmentData - Dati dell'environment
 * @returns {void} Non ritorna nulla
 */
async function performOperation(dataType, collectionData, environmentData) {
  try {
    const utils = new CollectionUtils(collectionData, environmentData);
    switch (dataType) {
      case 'Mostra':
        await utils.showInputList();
        break;
      case 'Modifica':
        await utils.modifyValues();
        break;
      case 'Elimina':
        await utils.removeValues();
        break;
      case 'Reset input':
        await utils.resetValues();
        break;
      case 'Aggiungi':
        await utils.checkSelectedCollection();
        break;
      case 'Esegui':
        await executeCollection(collectionData, environmentData);
        break;
      case 'Termina':
        await utils.exit();
        break;
      default:
        // Se il dataType non corrisponde a nessun caso, non fare nulla
        break;
    }
  } catch (error) {
    console.error('Si è verificato un errore:', error);
    // Puoi aggiungere ulteriori logiche per gestire l'errore qui, se necessario
  }
}

module.exports = { performOperation };