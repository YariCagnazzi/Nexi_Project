const { JSONCollectionReader } = require('./JSONCollectionReader');


class RockmanModel {
    constructor(collections, environments) {
      this.collectionsNames = new JSONCollectionReader(collections).readFolder();
      this.environmentsNames = new JSONCollectionReader(environments).readFolder();
    }
  
    getCollectionsNames() {
      return this.collectionsNames;
    }
  
    getEnvironmentsNames() {
      return this.environmentsNames;
    }

  }
  
  module.exports = RockmanModel;