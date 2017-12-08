/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');
const initialState = require('../../../../../../cli/core/initialState');

exports.test = () => {
    describe('initialState.js#add', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('should throw error when `const initialState` is not defined', () => {
            const args = {
                feature: 'blank',
                name: 'getPageById',
                type: 'request',
                withReducer: 'pageDetail'
            };

            assert.throws(() => initialState.add(args), Error, /(.+)/);
        });

        it('should not add a initialState if `withReducer === null`', () => {
            const args = {
                feature: 'blank',
                name: 'getPageById',
                type: 'request',
                withReducer: null
            };

            initialState.add(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/initialState.js'];
            assert.equal('undefined', typeof fileLines);
        });

        it('should add a initialState with request type', () => {
            const args = {
                feature: 'page',
                name: 'getPageById',
                type: 'request',
                withReducer: 'pageDetail'
            };

            initialState.add(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/initialState.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_request.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should add a initialState with submit type', () => {
            const args = {
                feature: 'page',
                name: 'createPage',
                type: 'submit',
                withReducer: 'createPageResult'
            };

            initialState.add(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/initialState.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_submit.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should add a initialState with paginate type', () => {
            const args = {
                feature: 'page',
                name: 'fetchPagesWithUser',
                type: 'paginate',
                withReducer: 'pagesWithUser'
            };

            initialState.add(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/initialState.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_paginate.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });
    })
};
