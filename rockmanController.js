const RockmanView = require('./rockmanView');


class RockmanController {
    constructor(model, view) {
      // Initialize RockmanView instance with the current controller
      this.rockmanView = new RockmanView(this);
      this.model = model;
      this.view = view;
    }
  
    runRockman() {
      // Get collection names from the model
      const collectionsNames = this.model.getCollectionsNames(); 
      // Get environment names from the model
      const environmentsNames = this.model.getEnvironmentsNames();
      // Display the main menu
      this.rockmanView.showMainMenu(collectionsNames, environmentsNames);
    }
  }
  
  module.exports = RockmanController;  