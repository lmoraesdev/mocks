const assert = require('assert');
const { error } = require('./src/constants');
const File = require('./src/file');

(async () => {
    {
        const filePath = './mocks/emptyFile-invalid.csv';
        const rejection = new Error(error.FILE_EMPTY_ERROR_MESSAGE);
        const result = File.csvToJson(filePath);
        await assert.rejects(result, rejection);
    }
    {
        const filePath = './mocks/fourItems-invalid.csv';
        const rejection = new Error(error.FILE_TOO_BIG_ERROR_MESSAGE);
        const result = File.csvToJson(filePath);
        await assert.rejects(result, rejection);
    }
    {
        const filePath = './mocks/header-invalid.csv';
        const rejection = new Error(error.FILE_FIELDS_ERROR_MESSAGE);
        const result = File.csvToJson(filePath);
        await assert.rejects(result, rejection);
    }
    {
        const filePath = './mocks/oneItem-valid.csv';
        const result = await File.csvToJson(filePath);
        const expected = [
            {
                id: 123,
                name: 'Mateus Larrubia',
                profession: 'Front-end developer',
                birthyear: 1999,
            },
        ];
        await assert.strictEqual(JSON.stringify(result), JSON.stringify(expected));
    }
    {
        const filePath = './mocks/threeItems-valid.csv';
        const result = await File.csvToJson(filePath);
        const expected = [
            {
              id: 123,
              name: 'Mateus Larrubia',
              profession: 'Front-end developer',
              birthyear: 1999
            },
            {
              id: 124,
              name: 'Fulano',
              profession: 'Back-end developer',
              birthyear: 1999
            },
            {
              id: 125,
              name: 'Ciclano',
              profession: 'Project Leader',
              birthyear: 1999
            },
        ];
        await assert.strictEqual(JSON.stringify(result), JSON.stringify(expected));
    }
})();
