/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');

exports.test = () => {
    describe('importExport.js#removeImportSpecifier', () => {
        it('should remove disappear', () => {
            const source = getAstAndCode(path.join(__dirname, 'source.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_1.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.removeImportSpecifier(source.ast, 'React')));
        });
        it('should remove with default name', () => {
            const source = getAstAndCode(path.join(__dirname, 'source.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_2.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.removeImportSpecifier(source.ast, 'Saga')));
        });
        it('should remove with object', () => {
            const source = getAstAndCode(path.join(__dirname, 'source.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_3.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.removeImportSpecifier(source.ast, 'takeEvery')));
        });
    })
};
