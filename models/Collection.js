const { BaseClass } = require('./BaseClass');

class Collection extends BaseClass {
    constructor(collectionFile) {
      super('./collections/', collectionFile);
    }
  }



  module.exports={Collection};
