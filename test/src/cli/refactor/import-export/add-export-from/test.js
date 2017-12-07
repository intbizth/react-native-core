/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');

exports.test = () => {
    describe('importExport.js#addExportFrom: multiple line', () => {
        it('should exported with object', () => {
            const source = getAstAndCode(path.join(__dirname, 'source_1.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_1.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.addExportFrom(source.ast, 'redux-saga/effects', '', 'takeLatest')));
        });
        it('should exported with defaultName', () => {
            const source = getAstAndCode(path.join(__dirname, 'source_2.js'));
            const expect = getAstAndCode(path.join(__dirname, 'expect_2.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.addExportFrom(source.ast, 'redux-saga/effects', 'Saga')));
        });
        it('should not exported if it has exported already.', () => {
            const source = getAstAndCode(path.join(__dirname, 'source_1.js'));
            const expect = getAstAndCode(path.join(__dirname, 'source_1.js'));
            assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.addExportFrom(source.ast, 'redux-saga/effects', '', 'takeEvery')));
        });
    })
};
