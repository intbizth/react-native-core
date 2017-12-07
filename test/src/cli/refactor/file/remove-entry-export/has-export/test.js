/* eslint-disable */
const assert = require('assert');
const path = require('path');
const refactor = require('../../../../../../../cli/refactor');

exports.test = () => {
    describe('When `removeFileWhichNoExported` called in a file has at least one export.', () => {
        it('should return false', () => {
            assert.equal(false, refactor.removeFileWhichNoExported(path.join(__dirname, './source.js')));
        });
    })
};
