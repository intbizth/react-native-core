/* eslint-disable */
const assert = require('assert');
const path = require('path');
const refactor = require('../../../../../../cli/refactor');
const { getFeatureFolder, getCommonFolder } = require('../../../../../../cli/refactor/utils');
const feature = require('../../../../../../cli/manager/feature');
const { getAstAndCode } = require('../../../../../test');
const FEATURE_FOR_TESTING = 'fooFeature';

exports.test = () => {
    describe('feature.js#add', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('its should create folders api, components, containers, forms, redux, screen', () => {
            feature.add({feature: FEATURE_FOR_TESTING});
            const featureFolder = getFeatureFolder('foo-feature');

            // folders
            assert.deepEqual(Object.keys(refactor.dirs), [
                featureFolder,
                featureFolder + '/api',
                featureFolder + '/components',
                featureFolder + '/containers',
                featureFolder + '/forms',
                featureFolder + '/redux',
                featureFolder + '/screen'
            ]);
        });

        it('its should create files', () => {
            feature.add({feature: FEATURE_FOR_TESTING});
            const featureFolder = getFeatureFolder('foo-feature');

            const files = Object.keys(refactor.toSave),
                needs = [
                    featureFolder + '/redux/actions.js',
                    featureFolder + '/redux/constants.js',
                    featureFolder + '/redux/initialState.js',
                    featureFolder + '/redux/reducer.js',
                    featureFolder + '/redux/sagas.js',
                    featureFolder + '/redux/selectors.js',
                    featureFolder + '/router.js',
                ],
                intersecs = [files, needs].reduce((a, b) => a.filter(c => b.includes(c)));

            assert.ok(intersecs.length, needs.length);
        });

        it('its should add entry import reducer in root', () => {
            feature.add({feature: FEATURE_FOR_TESTING});
            const commonFolder = getCommonFolder();

            const fileLines = refactor.fileLines[commonFolder + '/rootReducer.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_root_reducer.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });

        it('its should add entry import saga in root', () => {
            feature.add({feature: FEATURE_FOR_TESTING});
            const commonFolder = getCommonFolder();

            const fileLines = refactor.fileLines[commonFolder + '/rootSaga.js'];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect_root_saga.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });
    })
};
