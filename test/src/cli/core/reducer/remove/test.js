/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');
const reducer = require('../../../../../../cli/core/reducer');

exports.test = () => {
    describe('reducer.js#remove', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('should remove a reducer with request type', () => {
            const args = {
                feature: 'page',
                name: 'getPageById',
                type: 'request',
                withSaga: 'page',
            };

            reducer.remove(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/reducers/page.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_request.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should remove a reducer with submit type', () => {
            const args = {
                feature: 'page',
                name: 'updatePage',
                type: 'submit',
                withSaga: 'page',
            };

            reducer.remove(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/reducers/page.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_submit.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should remove a reducer with paginate type', () => {
            const args = {
                feature: 'page',
                name: 'fetchPages',
                type: 'paginate',
                withSaga: 'page',
            };

            reducer.remove(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/reducers/page.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_paginate.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });
    })
};
