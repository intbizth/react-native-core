/* eslint-disable */
const assert = require('assert');
const path = require('path');
const refactor = require('../../../../../../../cli/refactor');

exports.test = () => {
    describe('When `removeFileWhichNoExported` called in a file has no export.', () => {
        it('should return true', () => {
            assert.equal(true, refactor.removeFileWhichNoExported(path.join(__dirname, './source.js')));
        });
    })
};
