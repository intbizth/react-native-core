/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../../test');
const refactor = require('../../../../../../../cli/refactor');

exports.test = () => {
    describe('array.js#addToArray: single line', () => {
        it('should return a string contains new item', () => {
            const source = getAstAndCode(path.join(__dirname, 'source.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.addToArray(source.ast, 'arr', '5')));
        });
    })
};
