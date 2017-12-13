/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');
const entry = require('../../../../../../cli/core/entry');

exports.test = () => {
    describe('entry.js#unlink', () => {
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

        it('should unlinked a saga with from sagas.js', () => {
            const args = {
                feature: 'page',
                name: 'updatePage',
                type: 'submit',
                withSaga: 'page',
            };

            entry.unlinkSaga(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/sagas.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_saga_unlinked.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should unlinked a reducer with from reducer.js', () => {
            const args = {
                feature: 'page',
                name: 'updatePage',
                type: 'submit',
                withSaga: 'page',
            };

            entry.unlinkReducer(args);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(args.feature) + '/reducer.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_reducer_unlinked.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('should unlinked a feature reducer,saga to root', () => {
            const feature = 'page';

            entry.unlinkFeature(feature);

            const commonFolder = refactor.getCommonFolder();

            const rootReducerFileLines = refactor.fileLines[commonFolder + '/rootReducer.js'];
            assert.equal('object', typeof rootReducerFileLines);

            const expectRootReducer = getAstAndCode(path.join(__dirname, 'expect_root_reducer_unlinked.js'));
            assert.equal(expectRootReducer.code, rootReducerFileLines.join('\n'));

            const rootSagaFileLines = refactor.fileLines[commonFolder + '/rootSaga.js'];
            assert.equal('object', typeof rootSagaFileLines);

            const expectRootSaga = getAstAndCode(path.join(__dirname, 'expect_root_saga_unlinked.js'));
            assert.equal(expectRootSaga.code, rootSagaFileLines.join('\n'));
        });
    })
};
