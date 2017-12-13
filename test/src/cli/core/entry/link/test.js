/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');
const entry = require('../../../../../../cli/core/entry');

exports.test = () => {
    describe('entry.js#link', () => {
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

            entry.linkSaga(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + 'reducers/reducer.js'];
            assert.equal('undefined', typeof fileLines);
        });

        it('should linked a saga with from sagas.js', () => {
            const args = {
                feature: 'page',
                name: 'removePage',
                type: 'request',
                withSaga: 'page',
            };

            entry.linkSaga(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/sagas.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_saga_linked.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should linked a reducer with from reducer.js', () => {
            const args = {
                feature: 'page',
                name: 'removePage',
                type: 'request',
                withSaga: 'page',
            };

            entry.linkReducer(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/reducer.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_reducer_linked.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should linked a feature reducer,saga to root', () => {
            const feature = 'newFeature';

            entry.linkFeature(feature);

            const commonFolder = refactor.getProjectRoot() + 'common';

            const rootReducerFileLines = refactor.fileLines[commonFolder + '/rootReducer.js'];
            assert.equal('object', typeof rootReducerFileLines);

            const expectRootReducer = getAstAndCode(path.join(__dirname, 'expect_root_reducer_linked.js'));
            assert.equal(expectRootReducer.code, rootReducerFileLines.join('\n'));

            const rootSagaFileLines = refactor.fileLines[commonFolder + '/rootSaga.js'];
            assert.equal('object', typeof rootSagaFileLines);

            const expectRootSaga = getAstAndCode(path.join(__dirname, 'expect_root_saga_linked.js'));
            assert.equal(expectRootSaga.code, rootSagaFileLines.join('\n'));
        });
    })
};
