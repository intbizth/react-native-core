/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');
const initialState = require('../../../../../../cli/core/initialState');

exports.test = () => {
    describe('initialState.js#remove', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('should remove a initialState with request type', () => {
            const args = {
                feature: 'page',
                name: 'getPageById',
                type: 'request',
                withReducer: null
            };

            initialState.remove(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/initialState.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_request.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should remove a initialState with paginate type', () => {
            const args = {
                feature: 'page',
                name: 'fetchPages',
                type: 'paginate',
                withReducer: null
            };

            initialState.remove(args);


            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/initialState.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_paginate.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });
    })
};
