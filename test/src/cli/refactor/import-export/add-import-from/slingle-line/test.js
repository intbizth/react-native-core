/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../../test');
const refactor = require('../../../../../../../cli/refactor');

exports.test = () => {
    describe('importExport.js#addImportFrom: single line', () => {
        it('should imported with object', () => {
            const source = getAstAndCode(path.join(__dirname, 'source_1.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_1.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.addImportFrom(source.ast, 'redux-saga/effects', '', 'takeLatest')));
        });
        it('should imported with defaultName', () => {
            const source = getAstAndCode(path.join(__dirname, 'source_2.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_2.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.addImportFrom(source.ast, 'redux-saga/effects', 'Saga')));
        });
        it('should not imported if it has imported already.', () => {
            const source = getAstAndCode(path.join(__dirname, 'source_1.js'));
            const expect = getAstAndCode(path.join(__dirname, 'source_1.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.addImportFrom(source.ast, 'redux-saga/effects', '', 'takeEvery')));
        });
    })
};
