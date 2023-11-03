const funzioni = require('./funzioni');

async function handleMainMenu(collectionsNames, environmentsNames) {
  await funzioni.getMainMenu(collectionsNames, environmentsNames);
}

module.exports = { handleMainMenu };