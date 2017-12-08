/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');

exports.test = () => {
    describe('object.js#addObjectProperty', () => {
        it('should return a object has a prop5 property with value 2 (multiple line)', () => {
            const source = getAstAndCode(path.join(__dirname, 'source.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_1.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.addObjectProperty(source.ast, 'obj1', 'prop5', 2)));
        });
        it('should return a object has a prop5 property with value 5 (single line)', () => {
            const source = getAstAndCode(path.join(__dirname, 'source.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_2.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.addObjectProperty(source.ast, 'obj2', 'prop5', 5)));
        });
    })
};
