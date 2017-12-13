/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');
const reducer = require('../../../../../../cli/core/reducer');

exports.test = () => {
    describe('reducer.js#init', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('should have a reducer.js in feature folder', () => {
            const feature = 'newFeature';
            reducer.init(feature);

            assert.ok(!!refactor.toSave[refactor.getReduxFolder(feature) + '/' + reducer.FILENAME]);
        });

        it('should add init export in initialState.js', () => {
            const feature = 'newFeature';
            reducer.init(feature);

            const fileLines = refactor.fileLines[refactor.getReduxFolder(feature) + '/' + reducer.FILENAME];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });
    })
};
