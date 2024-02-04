const RockmanModel = require('./models/RockmanModel');
const RockmanView = require('./prompts/rockmanView');
const RockmanController = require('./controllers/rockmanController');

// Create instances of the model, controller, and view
const model = new RockmanModel('collections', 'environments');
const controller = new RockmanController(model);
const view = new RockmanView(controller);

// Start the application by running Rockman
controller.runRockman();