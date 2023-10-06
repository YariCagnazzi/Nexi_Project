const { BaseClass } = require('./BaseClass');

class Environment extends BaseClass {
    constructor(collectionFile) {
      super('./environments/', collectionFile);
    }
  }



  module.exports={Environment}; 