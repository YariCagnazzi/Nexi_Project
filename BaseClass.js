const fs = require('fs');
const path = require('path');

class BaseClass {
  constructor(basePath, filePath) {
    this.collectionFilePath = path.join(basePath, filePath);
    this.data = null;
  }

  validateFilePath() {
    const osPlatform = process.platform;
    const absolutePath = path.resolve(this.collectionFilePath);

    if ((osPlatform === 'win32' && !absolutePath.match(/^[a-zA-Z]:\\/)) ||
        ((osPlatform === 'darwin' || osPlatform === 'linux') && !absolutePath.startsWith('/'))) {
      throw new Error(`Invalid file path format on ${osPlatform}. Use "${osPlatform === 'win32' ? 'C:\\path\\to' : '/path/to'}/${this.constructor.name.toLowerCase()}.json"`);
    }
  }

  readAndParseData() {
    this.validateFilePath();
    try {
      const data = fs.readFileSync(this.collectionFilePath, 'utf8');
      this.data = JSON.parse(data);
    } catch (error) {
      throw new Error(`Error reading or parsing the ${this.constructor.name.toLowerCase()} file: ${error.message}`);
    }
  }

  getData() {
    if (!this.data) {
      this.readAndParseData();
    }
    return this.data;
  }
}


class Collection extends BaseClass {
  constructor(collectionFile) {
    super('./collections/', collectionFile);
  }
}


class Environment extends BaseClass {
  constructor(collectionFile) {
    super('./environments/', collectionFile);
  }
}

module.exports={Collection, Environment};