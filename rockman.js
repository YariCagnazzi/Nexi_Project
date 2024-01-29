const RockmanModel = require('./rockmanModel');
const RockmanView = require('./rockmanView');
const RockmanController = require('./rockmanController');

// Create instances of the model, controller, and view
const model = new RockmanModel('collections', 'environments');
const controller = new RockmanController(model);
const view = new RockmanView(controller);

// Start the application by running Rockman
controller.runRockman();