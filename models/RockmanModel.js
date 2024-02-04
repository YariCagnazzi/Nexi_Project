const { JSONCollectionReader } = require('../controllers/JSONCollectionReader');

/**
 * RockmanModel class represents a model that manages collections and environments.
 */
class RockmanModel {
   /**
   * Creates an instance of RockmanModel.
   *
   * @param {string} collections - The path to the collections folder.
   * @param {string} environments - The path to the environments folder.
   */
    constructor(collections, environments) {
      this.collectionsNames = new JSONCollectionReader(collections).readFolder();
      this.environmentsNames = new JSONCollectionReader(environments).readFolder();
    }
  
     /**
   * Gets the names of collections.
   *
   * @returns {Array<string>} - Names of collections.
   */
    getCollectionsNames() {
      return this.collectionsNames;
    }
    /**
   * Gets the names of environments.
   *
   * @returns {Array<string>} - Names of environments.
   */
    getEnvironmentsNames() {
      return this.environmentsNames;
    }

  }
  
  module.exports = RockmanModel;