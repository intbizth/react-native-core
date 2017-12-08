/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');
const action = require('../../../../../../cli/core/action');

exports.test = () => {
    describe('action.js#add', () => {
        afterEach(function() {
            refactor.reset();
        });


        it('should add a constant with request type', () => {
            const args = {
                feature: 'blank',
                name: 'getPageById',
                type: 'request',
                withReducer: null
            };

            action.add(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/actions.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_request.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should add a constant with submit type', () => {
            const args = {
                feature: 'blank',
                name: 'createPage',
                type: 'submit',
                withReducer: null
            };

            action.add(args);


            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/actions.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_submit.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should add a constant with paginate type', () => {
            const args = {
                feature: 'blank',
                name: 'fetchPages',
                type: 'paginate',
                withReducer: null
            };

            action.add(args);


            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/actions.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_paginate.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });
    })
};
