const { readFile } = require('fs/promises');
const User = require('./user');
const { error, separator, lineBreaker } = require('./constants');

const DEFAULT_OPTIONS = {
    maxRows: 3,
    fields: [
        'id',
        'name',
        'profession',
        'age',
    ],
}; 

class File {
    static async getFileContent(filePath) {
        const fileContent = (await readFile(filePath)).toString('utf8');
        return fileContent;
    }

    static isValid(csvString, options = DEFAULT_OPTIONS) {
        const [header, ...rows] = csvString.split(lineBreaker);
        const isHeaderValid = header === options.fields.join(separator);
        if (!isHeaderValid) {
            return { message: error.FILE_FIELDS_ERROR_MESSAGE, isValid: false };
        }

        const isFileEmpty = rows.length === 0;
        if (isFileEmpty) {
            return { message: error.FILE_EMPTY_ERROR_MESSAGE, isValid: false };
        }

        const isContentLengthValid = rows.length <= options.maxRows;
        if (!isContentLengthValid) {
            return { message: error.FILE_TOO_BIG_ERROR_MESSAGE, isValid: false };
        }

        return { message: 'The CSV is valid', isValid: true };
    }

    static parseCsvToJson(csvString) {
        const lines = csvString.split(lineBreaker);
        const firstLine = lines.shift();
        const header = firstLine.split(separator);
        const rows = lines.map(line => {
            const columns = line.split(separator);
            let row = {};
            for (const index in columns) {
                row[header[index]] = columns[index]
            }
            return new User(row);
        });
        return rows;
    }

    static async csvToJson(filePath) {
        const content = await File.getFileContent(filePath);
        const validation = File.isValid(content);
        if (!validation.isValid) throw new Error(validation.message);
        return File.parseCsvToJson(content);
    }
}

module.exports = File;
