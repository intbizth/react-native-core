/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');
const saga = require('../../../../../../cli/core/saga');

exports.test = () => {
    describe('saga.js#add', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('should not change if `withSaga === null`', () => {
            const args = {
                feature: 'blank',
                name: 'getPageById',
                type: 'request',
                withSaga: null,
            };

            saga.add(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + 'reducers/reducer.js'];
            assert.equal('undefined', typeof fileLines);
        });

        it('should add a saga with request type', () => {
            const args = {
                feature: 'blank',
                name: 'getPageById',
                type: 'request',
                withSaga: 'reducer',
                withReducer: 'pageDetail'
            };

            saga.add(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/reducers/reducer.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_request.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should add a saga with submit type', () => {
            const args = {
                feature: 'blank',
                name: 'createPage',
                type: 'submit',
                withSaga: 'reducer',
                withReducer: 'createPageResult'
            };

            saga.add(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/reducers/reducer.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_submit.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should add a saga with paginate type', () => {
            const args = {
                feature: 'blank',
                name: 'fetchPages',
                type: 'paginate',
                withSaga: 'reducer',
                withReducer: 'pages'
            };

            saga.add(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/reducers/reducer.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_paginate.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });
    })
};
