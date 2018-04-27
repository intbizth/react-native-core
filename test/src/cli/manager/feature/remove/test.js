/* eslint-disable */
const assert = require('assert');
const path = require('path');
const refactor = require('../../../../../../cli/refactor');
const { getFeatureFolder, getCommonFolder } = require('../../../../../../cli/refactor/utils');
const feature = require('../../../../../../cli/manager/feature');
const { getAstAndCode } = require('../../../../../test');
const FEATURE_FOR_TESTING = 'page';

exports.test = () => {
    describe('feature.js#remove', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('its should remove feature folder', () => {
            feature.remove({feature: FEATURE_FOR_TESTING});
            const featureFolder = getFeatureFolder('page');

            assert.ok(refactor.toDel[featureFolder]);
        });

        it('its should remove entry import reducer in root', () => {
            feature.remove({feature: FEATURE_FOR_TESTING});
            const commonFolder = getCommonFolder();

            const fileLines = refactor.fileLines[commonFolder + '/rootReducer.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_root_reducer.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('its should remove entry import saga in root', () => {
            feature.remove({feature: FEATURE_FOR_TESTING});
            const commonFolder = getCommonFolder();

            const fileLines = refactor.fileLines[commonFolder + '/rootSaga.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_root_saga.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });
    })
};
