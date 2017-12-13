/* eslint-disable */
const assert = require('assert');
const path = require('path');
const { getAstAndCode } = require('../../../../../test');
const refactor = require('../../../../../../cli/refactor');
const router = require('../../../../../../cli/core/router');

exports.test = () => {
    describe('router.js#init', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('should have a router.js in feature folder', () => {
            const feature = 'newFeature';
            router.init(feature);

            assert.ok(!!refactor.toSave[refactor.getFeatureFolder(feature) + '/' + router.FILENAME]);
        });

        it('should add init export in router.js', () => {
            const feature = 'newFeature';
            router.init(feature);

            const fileLines = refactor.fileLines[refactor.getFeatureFolder(feature) + '/' + router.FILENAME];
            assert.equal('object', typeof fileLines);

            const expect = getAstAndCode(path.join(__dirname, 'expect.js'));
            assert.equal(expect.code, fileLines.join('\n'));
        });
    })
};
