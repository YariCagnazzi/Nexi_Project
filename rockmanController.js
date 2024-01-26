const RockmanView = require('./rockmanView');


class RockmanController {
    constructor(model, view) {
      this.rockmanView = new RockmanView(this);
      this.model = model;
      this.view = view;
    }
  
    runRockman() {
      const collectionsNames = this.model.getCollectionsNames(); 
      const environmentsNames = this.model.getEnvironmentsNames();
  
      this.rockmanView.showMainMenu(collectionsNames, environmentsNames);
    }
  }
  
  module.exports = RockmanController;  