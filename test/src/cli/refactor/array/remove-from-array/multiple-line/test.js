/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../../test');
const refactor = require('../../../../../../../cli/refactor');

exports.test = () => {
    describe('array.js#removeFromArray: multiple line', () => {
        it('should return a string not contains specific item (multiple line)', () => {
            const source = getAstAndCode(path.join(__dirname, 'source.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.removeFromArray(source.ast, 'arr', 'someAddition')));
        });
    });
};
