/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');

exports.test = () => {
    describe('importExport.js#removeExportSpecifier', () => {
        it('should remove with object', () => {
            const source = getAstAndCode(path.join(__dirname, 'source.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_1.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.removeExportSpecifier(source.ast, 'take')));
        });
        it('should remove with const', () => {
            const source = getAstAndCode(path.join(__dirname, 'source.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_2.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.removeExportSpecifier(source.ast, 'aaa')));
        });
        it('should remove with function', () => {
            const source = getAstAndCode(path.join(__dirname, 'source.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_3.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.removeExportSpecifier(source.ast, 'bbb')));
        });
    })
};
