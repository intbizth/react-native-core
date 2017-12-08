/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');

exports.test = () => {
    describe('object.js#removeObjectProperty', () => {
        it('should return a object has no a prop5 property (multiple line)', () => {
            const source = getAstAndCode(path.join(__dirname, 'source.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_1.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.removeObjectProperty(source.ast, 'obj1', 'prop5')));
        });
        it('should return a object has no a prop5 property (single line)', () => {
            const source = getAstAndCode(path.join(__dirname, 'source.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_2.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.removeObjectProperty(source.ast, 'obj2', 'prop5')));
        });
    })
};
