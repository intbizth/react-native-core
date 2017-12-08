/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');
const action = require('../../../../../../cli/core/action');

exports.test = () => {
    describe('action.js#remove', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('should remove a constant with request type', () => {
            const args = {
                feature: 'page',
                name: 'getPageById',
                type: 'request',
                withReducer: null
            };

            action.remove(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/actions.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_request.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should remove a constant with submit type', () => {
            action.remove({
                feature: 'page',
                name: 'updatePage',
                type: 'submit',
                withReducer: null
            });

            const fileLines = refactor.fileLines[refactor.getReduxFolder('page') + '/actions.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_submit.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should remove a constant with paginate type', () => {
            const args = {
                feature: 'page',
                name: 'fetchPages',
                type: 'paginate',
                withReducer: null
            };

            action.remove(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/actions.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_paginate.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });
    })
};
