const inquirer = require('inquirer');
const { Collection } = require('./Collection');
const { Environment } = require('./Environment');
const { CollectionUtils } = require('./collectionUtils');
const { JSONCollectionReader } = require('./JSONCollectionReader');
const newman = require('./run-newman');

class RockmanView {
  static menuOptions = ['Mostra', 'Modifica', 'Elimina', 'Reset input', 'Aggiungi', 'Esegui', 'Termina'];
  static subMenuOptions = ['Esegui un\'altra collection', 'Riesegui la collection', 'Torna Indietro'];

  constructor(controller) {
    this.controller = controller;
  }


  /**
 * Displays an interactive menu using Inquirer to prompt the user to choose a collection and environment.
 * Once the choices are made, it logs the selected collection and environment, then calls the
 * `interactiveData` function with the chosen collection and environment.
 *
 * @param {Array<string>} collectionsNames - An array of strings representing the names of available collections.
 * @param {Array<string>} environmentsNames - An array of strings representing the names of available environments.
 *
 * @returns {Promise<void>} - A promise that resolves once the user makes the choices and the `interactiveData` function is called.
 * @throws {Error} - Throws an error if there's any issue during the execution of the menu.
 */
 async getMainMenu(collectionsNames, environmentsNames) {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'collectionChoice',
          message: 'Scegli la collection che vuoi eseguire:',
          choices: collectionsNames,
        },
        {
          type: 'list',
          name: 'environmentChoice',
          message: 'In quale ambiente vuoi eseguire la collezione?',
          choices: environmentsNames,
        },
      ]);

      //console.info('Risposte inserite:', answers);

      const collectionName = answers.collectionChoice;
      const environmentName = answers.environmentChoice;

      //console.info(collectionName);
      //console.info(environmentName);

      await this.interactiveData(collectionName, environmentName);
    } catch (error) {
      console.error('Errore durante l\'esecuzione del menu principale:', error);
    }
  }

  /**
 * Executes a collection using Newman based on provided collection and environment data.
 * After the execution, prompts the user for post-execution actions such as running another collection,
 * re-executing the current collection, or returning to the main menu.
 *
 * @param {object} collectionData - Data representing the Newman collection to be executed.
 * @param {object} environmentData - Data representing the Newman environment to be used for the execution.
 *
 * @returns {Promise<void>} - A promise that resolves after the user selects a post-execution action and the corresponding action is performed.
 * @throws {Error} - Throws an error if there's any issue during the execution of the collection or user interaction.
 */
  async executeCollection(collectionData, environmentData) {
    await newman.runNewman(collectionData, environmentData);
    const { afterExecutionChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'afterExecutionChoice',
        message: 'Cosa vuoi fare dopo l\'esecuzione della collection?',
        choices: RockmanView.subMenuOptions,
      },
    ]);

    switch (afterExecutionChoice) {
      case 'Esegui un\'altra collection':
        await this.showMainMenu();
        break;
      case 'Riesegui la collection':
        await this.executeCollection(collectionData, environmentData);
        break;
      case 'Torna Indietro':
        await this.showMainMenu();
        break;
      default:
        // Do nothing for unrecognized choices
        break;
    }
  }

  /**
 * Performs various operations based on the specified data type. Operations include displaying, modifying,
 * deleting, resetting input, adding, executing a collection, and terminating the application.
 *
 * @param {string} dataType - The type of operation to perform. Supported values: 'Mostra', 'Modifica', 'Elimina',
 * 'Reset input', 'Aggiungi', 'Esegui', 'Termina'.
 * @param {object} collectionData - Data representing the Newman collection to be used in applicable operations.
 * @param {object} environmentData - Data representing the Newman environment to be used in applicable operations.
 *
 * @returns {Promise<void>} - A promise that resolves after the specified operation is performed.
 * @throws {Error} - Throws an error if there's any issue during the execution of the operation or data handling.
 */
  async performOperation(dataType, collectionData, environmentData) {
    try {
      const utils = new CollectionUtils(collectionData, environmentData);

      switch (dataType) {
        case 'Mostra':
        case 'Modifica':
        case 'Elimina':
        case 'Reset input':
        case 'Aggiungi':
          await this.handleDataOperation(dataType, utils);
          break;
        case 'Esegui':
          await this.executeCollection(collectionData, environmentData);
          break;
        case 'Termina':
          await utils.exit();
          break;
        default:
          // Do nothing for unsupported data operations
          break;
      }
    } catch (error) {
      console.error('Si è verificato un errore:', error);
    }
  }

  /**
 * Handles various data operations based on the specified data type. Operations include displaying input lists,
 * modifying values, removing values, resetting input, and checking the selected collection for addition.
 *
 * @param {string} dataType - The type of data operation to perform. Supported values: 'Mostra', 'Modifica', 'Elimina',
 * 'Reset input', 'Aggiungi'.
 * @param {object} utils - An instance of the CollectionUtils class providing utility methods for data operations.
 *
 * @returns {Promise<void>} - A promise that resolves after the specified data operation is performed.
 * @throws {Error} - Throws an error if there's any issue during the execution of the data operation.
 */
  async handleDataOperation(dataType, utils) {
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
      default:
        // Handle unsupported data operation
        break;
    }
  }

  
   /**
 * Provides an interactive interface for continuous data interaction based on the specified collection and environment.
 * The user can choose from options such as displaying, modifying, deleting, resetting input, adding, executing a collection,
 * and terminating the application in a loop.
 *
 * @param {string} collectionName - The name of the collection for which interactive data operations are performed.
 * @param {string} environmentName - The name of the environment associated with the collection.
 *
 * @returns {Promise<void>} - A promise that continues until the user chooses to terminate the interactive session.
 * @throws {Error} - Throws an error if there's any issue during the interactive data operations.
 */
  async interactiveData(collectionName, environmentName) {
    const collectionData = new Collection(collectionName).getData();
    const environmentData = new Environment(environmentName).getData();

    while (true) {
      const { dataType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'dataType',
          message: 'Seleziona cosa vuoi effettuare tra Mostra, Modifica, Elimina, Reset input, Aggiungi, Esegui e Termina:',
          choices: RockmanView.menuOptions,
        },
      ]);

      await this.performOperation(dataType, collectionData, environmentData);
    }
  }

  async showMainMenu() {
    const collectionsNames = new JSONCollectionReader('collections').readFolder();
    const environmentsNames = new JSONCollectionReader('environments').readFolder();
    await this.getMainMenu(collectionsNames, environmentsNames);
  }
}

module.exports = RockmanView;