const fs = require('fs');

//classe per gestire la lettura delle cartelle in ingresso
class JSONCollectionReader {
    constructor(folderPath) {
        this.folderPath = folderPath;
    }
   
    readFolder() {
        const collectionFiles = [];
        const filenames = fs.readdirSync(this.folderPath);
    
        for (const filename of filenames) {
            if (filename.endsWith('.json') || filename.endsWith('.postman_collection')) {
                collectionFiles.push(filename);
            }
        }
         
        return collectionFiles;
    }
    
};

module.exports = { JSONCollectionReader };