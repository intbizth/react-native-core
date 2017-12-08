/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');
const constant = require('../../../../../../cli/core/constant');

exports.test = () => {
    describe('constant.js#add', () => {
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

            constant.add(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/constants.js'];
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

            constant.add(args);


            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/constants.js'];
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

            constant.add(args);


            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/constants.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_paginate.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should add 2 constant `action` & `state_key` with `withReducer = a file name`', () => {
            const args = {
                feature: 'blank',
                name: 'getPageById',
                type: 'request',
                withReducer: 'createPageResult'
            };

            constant.add(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/constants.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_state_key.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });
    })
};
