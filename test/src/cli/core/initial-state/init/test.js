/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');
const initialState = require('../../../../../../cli/core/initialState');

exports.test = () => {
    describe('initialState.js#init', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('should have a initialState.js in feature folder', () => {
            const feature = 'newFeature';
            initialState.init(feature);

            assert.ok(!!refactor.toSave[refactor.getReduxFolder(feature) + '/' + initialState.FILENAME]);
        });

        it('should add init export in initialState.js', () => {
            const feature = 'newFeature';
            initialState.init(feature);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(feature) + '/' + initialState.FILENAME];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });
    })
};
