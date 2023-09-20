const fs = require('fs');
const path = require('path');

class Collection {
  constructor(collectionFile) {
    const baseCollection = './collections/';
    this.collectionFilePath = baseCollection + collectionFile;
    this.collectionData = null;
  }

  validateFilePath() {
    const osPlatform = process.platform;
    const filePath = this.collectionFilePath;

    // Converti il percorso relativo in un percorso assoluto
    const absolutePath = path.resolve(filePath);

    if (osPlatform === 'win32') {
      // Validazione per Windows
      if (!absolutePath.match(/^[a-zA-Z]:\\/)) {
        throw new Error(`Invalid file path format on Windows. Use "C:\\path\\to\\collection.json"`);
      }
    } else if (osPlatform === 'darwin' || osPlatform === 'linux') {
      // Validazione per macOS e Linux
      if (!absolutePath.startsWith('/')) {
        throw new Error(`Invalid file path format on ${osPlatform}. Use "/path/to/collection.json"`);
      }
    } else {
      // Gestire altri sistemi operativi se necessario
      throw new Error(`Unsupported operating system: ${osPlatform}`);
    }
  }

  readAndParseCollection() {
    this.validateFilePath();
    try {
      const collectionData = fs.readFileSync(this.collectionFilePath, 'utf8');
      this.collectionData = JSON.parse(collectionData);
    } catch (error) {
      throw new Error(`Error reading or parsing the collection file: ${error.message}`);
    }
  }

  getCollection() {
    if (!this.collectionData) {
      this.readAndParseCollection();
    }
    return this.collectionData;
  }
}



module.exports = { Collection };